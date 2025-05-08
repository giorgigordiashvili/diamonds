import { Payment, PaymentDetails, PaymentMethod, PaymentStatus } from '@/types/payment';
import { del, get, patch, post } from './client';

export interface PaymentListResponse {
  payments: Payment[];
  total: number;
  limit: number;
  offset: number;
}

export interface PaymentSearchParams {
  status?: PaymentStatus;
  orderId?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get payments (user's own payments, or all payments for admin)
 */
export function getPayments(params: PaymentSearchParams = {}): Promise<PaymentListResponse> {
  return get<PaymentListResponse>('/api/payments', {
    requireAuth: true,
    params: params as Record<string, string>,
  });
}

/**
 * Get a specific payment by ID
 */
export function getPayment(id: string): Promise<Payment> {
  return get<Payment>(`/api/payments/${id}`, { requireAuth: true });
}

/**
 * Create a new payment
 */
export interface CreatePaymentData {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentDetails?: PaymentDetails;
  status?: PaymentStatus;
  transactionId?: string;
}

export function createPayment(paymentData: CreatePaymentData): Promise<{
  paymentId: string;
  payment: Payment;
  message: string;
}> {
  return post<{
    paymentId: string;
    payment: Payment;
    message: string;
  }>('/api/payments', paymentData, { requireAuth: true });
}

/**
 * Update a payment status (admin only)
 */
export function updatePaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<{
  message: string;
  payment: Payment;
}> {
  return patch<{
    message: string;
    payment: Payment;
  }>(`/api/payments/${id}`, { status }, { requireAuth: true });
}

/**
 * Delete a payment (admin only)
 */
export function deletePayment(id: string): Promise<{ message: string }> {
  return del<{ message: string }>(`/api/payments/${id}`, { requireAuth: true });
}

/**
 * Generate a payment receipt
 */
export function getPaymentReceipt(paymentId: string): Promise<any> {
  return get<any>('/api/payments/receipt', {
    requireAuth: true,
    params: { paymentId },
  });
}
