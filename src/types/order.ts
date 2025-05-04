import { ObjectId } from 'mongodb';

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface OrderItem {
  diamondId: string;
  quantity: number;
  price: number;
  name?: string;
}

export interface Order {
  _id?: ObjectId;
  id?: string;
  customerName: string;
  email: string;
  phone: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
