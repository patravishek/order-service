// src/interfaces/IItem.ts
export interface IItem {
    itemName: string;
    qty: number;
    variant?: string[];
    size?: string;
    additional_request?: string;
    restaurant_id: string;
  }