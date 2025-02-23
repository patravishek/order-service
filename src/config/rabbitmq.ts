// order-service/src/config/rabbitmq.ts (or similarly in payment-service)
import amqp from 'amqplib';
import { ENV } from './environment';
import { logger } from './logger';

let channel: amqp.Channel;

export const getRabbitMQChannel = async (): Promise<amqp.Channel> => {
  if (channel) {
    return channel;
  }

  const connection = await amqp.connect(ENV.RABBITMQ_URL);
  channel = await connection.createChannel();

  // Create main queues
  await channel.assertQueue('payment_queue', { durable: true });
  await channel.assertQueue('payment_response_queue', { durable: true });

  // Optional dead-letter queue for failures
  await channel.assertQueue('payment_queue_deadletter', { durable: true });

  return channel;
};

/**
 * A helper function to handle message retry logic safely.
 */
export const consumeWithRetry = async (
  queue: string,
  onMessage: (msg: amqp.ConsumeMessage, channel: amqp.Channel) => Promise<void>,
  maxRetries = 3
) => {
  const ch = await getRabbitMQChannel();
  await ch.consume(queue, async (msg) => {
    if (!msg) return; // No message, consumer canceled

    try {
      await onMessage(msg, ch);
      ch.ack(msg); // Acknowledge on success
    } catch (err) {
      logger.error(`Error processing message in queue '${queue}': ${err}`);

      /**
       * Safely extract headers from msg.properties.headers.
       * Fallback to an empty object if headers are undefined.
       */
      const headers = msg.properties.headers || {};
      const currentRetries = headers['x-retries'] || 0;

      if (currentRetries < maxRetries) {
        // Nack the original message without re-queuing
        ch.nack(msg, false, false);

        // Increment retry count
        const newHeaders = {
          ...headers,
          'x-retries': currentRetries + 1,
        };

        // Re-publish the message to the same queue with incremented retries
        ch.sendToQueue(queue, msg.content, {
          persistent: true,
          headers: newHeaders,
        });

        logger.warn(
          `Message requeued (attempt ${currentRetries + 1}) for queue=${queue}`
        );
      } else {
        // Exceeded max retries, send to dead-letter queue (or discard)
        ch.nack(msg, false, false);
        ch.sendToQueue('payment_queue_deadletter', msg.content, {
          persistent: true,
          headers,
        });
        logger.error(`Message exceeded max retries. Sent to dead-letter queue.`);
      }
    }
  });
};