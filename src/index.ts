// order-service/src/index.ts
import app from './app';
import { ENV } from './config/environment';
import { consumeWithRetry } from './config/rabbitmq';
import { OrderService } from './services/orderService';
import { logger } from './config/logger';

const startServer = async () => {
  // Set up consumer for payment_response_queue with retry logic
  await consumeWithRetry('payment_response_queue', async (msg, channel) => {
    const content = msg.content.toString();
    const responseData = JSON.parse(content);
    // Process the payment response
    await OrderService.handlePaymentResponse(responseData);
  });

  app.listen(ENV.PORT, () => {
    logger.info(`Order Service listening on port ${ENV.PORT}`);
  });
};

startServer().catch((err) => {
  logger.error('Error starting server:', err);
});