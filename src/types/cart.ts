import { Diamond } from './diamond';
import { User } from './user'; // Import User type

export interface CartItem {
  diamondId: string;
  quantity: number;
  price: number; // This should be the price at the time of adding to cart
  diamond?: Diamond; // Diamond details might not always be populated
}

export interface Cart {
  _id?: string; // Add _id property
  userId?: string;
  user?: User; // Add user property
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}
