// order-service/src/services/orderService.ts
import { MenuService } from './menuService';
import { ServiceabilityService } from './serviceabilityService';
import { EncryptionService } from './encryptionService';
import { IOrder } from '../interfaces/IOrder';
import { getRabbitMQChannel } from '../config/rabbitmq';
import { IPayment } from '../interfaces/IPayment';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger';

export class OrderService {
  static async placeOrder(order: IOrder): Promise<string> {
    logger.info(`Placing order for customer ${order.customer_id}`);

    // Validate items
    logger.debug(`Validating order items with MenuService`);
    const isValidItems = await MenuService.validateItems(order.order_items.items);
    if (!isValidItems) {
      logger.warn(`Invalid items found for customer ${order.customer_id}`);
      throw new Error('Invalid items in the order');
    }

    // Check serviceability
    logger.debug(`Checking serviceability for customer ${order.customer_id}`);
    const isServiceable = await ServiceabilityService.checkServiceability(
      order.customer_id,
      order.order_items.items
    );
    if (!isServiceable) {
      logger.warn(`Order not serviceable for customer ${order.customer_id}`);
      throw new Error('Address or items not serviceable');
    }

    // Example cost calculation
    const amount = 100;
    logger.debug(`Calculated order amount as ${amount}`);

    // Publish Payment Request
    if (order.credit_card_info) {
      logger.info(`Encrypting credit card info for customer ${order.customer_id}`);
      const encryptedCardInfo = EncryptionService.encrypt(order.credit_card_info);
      const paymentData: IPayment = {
        orderId: uuidv4(),
        customerId: order.customer_id,
        encryptedCardInfo,
        amount
      };

      logger.debug(`Publishing payment request for order: ${paymentData.orderId}`);

      const channel = await getRabbitMQChannel();
      channel.sendToQueue('payment_queue', Buffer.from(JSON.stringify(paymentData)), {
        persistent: true,
        headers: { 'x-retries': 0 } // Initialize retry count
      });
    }

    return 'Order placed successfully, awaiting restaurant confirmation.';
  }

  static async handlePaymentResponse(responseData: any): Promise<void> {
    logger.info(`Received payment response: ${JSON.stringify(responseData)}`);
    // Here, you might update an "orders" table or status in your DB
    // Example: logger.debug('Updating order status in DB...');
  }
}