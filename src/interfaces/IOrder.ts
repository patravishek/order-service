// src/interfaces/IOrder.ts
import { IItem } from './IItem';

export interface IOrder {
  customer_id: string;
  order_items: {
    items: IItem[];
  };
  credit_card_info?: string; // In practice, keep or omit depending on how you're handling payment
}