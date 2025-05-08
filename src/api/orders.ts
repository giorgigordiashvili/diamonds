import { Order } from '@/types/order';
import { del, get, patch, post } from './client';

export interface OrderListResponse {
  orders: Order[];
  total: number;
}

export interface OrderSearchParams {
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get user's orders (or all orders for admin)
 */
export function getOrders(params: OrderSearchParams = {}): Promise<OrderListResponse> {
  return get<OrderListResponse>('/api/orders', {
    requireAuth: true,
    params: params as Record<string, string>,
  });
}

/**
 * Get a specific order by ID
 */
export function getOrder(id: string): Promise<Order> {
  return get<Order>(`/api/orders/${id}`, { requireAuth: true });
}

/**
 * Create a new order (admin only)
 */
export interface CreateOrderData {
  userId: string;
  items: {
    diamondId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status?: string;
  paymentMethod: string;
  paymentStatus?: string;
  notes?: string;
}

export function createOrder(orderData: CreateOrderData): Promise<Order> {
  return post<Order>('/api/orders', orderData, { requireAuth: true });
}

/**
 * Update an order's status (admin only)
 */
export function updateOrderStatus(id: string, status: string): Promise<Order> {
  return patch<Order>(`/api/orders/${id}`, { status }, { requireAuth: true });
}

/**
 * Cancel an order
 */
export function cancelOrder(id: string): Promise<Order> {
  return patch<Order>(`/api/orders/${id}/cancel`, {}, { requireAuth: true });
}

/**
 * Delete an order (admin only)
 */
export function deleteOrder(id: string): Promise<{ success: boolean }> {
  return del<{ success: boolean }>(`/api/orders/${id}`, { requireAuth: true });
}

/**
 * Create order from an existing cart (admin only)
 */
export function createOrderFromCart(
  cartId: string,
  orderData: Omit<CreateOrderData, 'items'>
): Promise<Order> {
  return post<Order>(
    '/api/orders/from-cart',
    {
      cartId,
      ...orderData,
    },
    { requireAuth: true }
  );
}
