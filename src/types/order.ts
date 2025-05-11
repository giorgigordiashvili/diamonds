import { ObjectId } from 'mongodb';
import { Diamond } from './diamond'; // Assuming Diamond type is in diamond.ts
import { User } from './user'; // Assuming User type is in user.ts

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}

export interface OrderItem {
  diamond: Diamond; // Changed from diamondId to full Diamond object
  quantity: number;
  price: number; // Price at the time of order for this item (diamond.price * quantity)
}

export interface Address {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string; // Optional state/province
  phone?: string; // Optional phone for address
}

export interface PaymentDetails {
  paymentId?: string;
  paymentMethod?: string;
  paymentStatus?: string; // e.g., 'succeeded', 'pending', 'failed'
  transactionId?: string;
  cardLastFour?: string; // Example: if card payment
  paidAt?: Date;
}

export interface Order {
  _id: string | ObjectId; // Order ID
  userId?: string | ObjectId; // Can be guest or registered user
  user?: User; // Populate for registered users
  // For guest checkouts if user is not present
  guestCheckoutInfo?: {
    email: string;
    name?: string;
    phone?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address; // Billing address might be same as shipping or different
  paymentDetails?: PaymentDetails;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Fields like customerName, email, phone are removed in favor of user object or guestCheckoutInfo
}
