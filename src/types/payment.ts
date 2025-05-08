import { ObjectId } from 'mongodb';

export interface Payment {
  _id?: string | ObjectId;
  orderId: string;
  userId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'paypal' | 'crypto' | 'other';

export interface PaymentDetails {
  // Common fields
  email?: string;

  // Credit card (masked for security)
  cardLast4?: string;
  cardBrand?: string;
  cardExpMonth?: number;
  cardExpYear?: number;

  // Bank transfer
  bankName?: string;
  accountLast4?: string;
  transferReference?: string;

  // PayPal
  paypalEmail?: string;
  paypalTransactionId?: string;

  // Crypto
  cryptoType?: string;
  cryptoAddress?: string;
  cryptoTransactionHash?: string;

  // Additional metadata
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  // Any additional payment provider-specific information
  providerMetadata?: Record<string, any>;
}
