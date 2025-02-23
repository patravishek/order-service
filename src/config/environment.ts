// src/config/environment.ts
import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.ORDER_SERVICE_PORT || 3000,
  MENU_SERVICE_URL: process.env.MENU_SERVICE_URL || 'http://localhost:4000',
  SERVICEABILITY_URL: process.env.SERVICEABILITY_URL || 'http://localhost:5000',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || 'mySecretKey'
};