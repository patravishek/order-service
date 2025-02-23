// src/routes/orderRoutes.ts
import { Router } from 'express';
import { OrderController } from '../controllers/orderController';

const router = Router();

router.post('/', OrderController.placeOrder);

export default router;