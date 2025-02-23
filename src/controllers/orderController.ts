// src/controllers/orderController.ts
import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { IOrder } from '../interfaces/IOrder';
import { logger } from '../config/logger';

export class OrderController {
  static async placeOrder(req: Request, res: Response): Promise<void> {
    try {
      const order: IOrder = req.body;
      const message = await OrderService.placeOrder(order);
      res.status(200).json({
        status: 'success',
        message
      });
    } catch (error) {
      logger.error('Caught error:', error);
      res.status(400).json({
        status: 'error',
        message: (error as Error).message
      });
    }
  }
}