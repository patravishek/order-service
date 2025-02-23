// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import orderRoutes from './routes/orderRoutes';

const app = express();
app.use(bodyParser.json());

// Register routes
app.use('/orders', orderRoutes);

export default app;