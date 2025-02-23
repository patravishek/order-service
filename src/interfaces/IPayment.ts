// src/interfaces/IPayment.ts
export interface IPayment {
    orderId: string;
    customerId: string;
    encryptedCardInfo: string;
    amount: number; // You can add more fields as needed
  }