import { Diamond } from './diamond';

export interface CartItem {
  diamondId: string;
  quantity: number;
  diamond?: Diamond;
}

export interface Cart {
  userId?: string; // Optional for guest carts
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}
