import { Cart, CartItem } from '@/types/cart';
import { del, get, post, put } from './client';

/**
 * Get the current user's cart
 */
export function getCart(): Promise<Cart> {
  return get<Cart>('/api/cart');
}

/**
 * Update the entire cart
 */
export function updateCart(items: CartItem[]): Promise<Cart> {
  return post<Cart>('/api/cart', { items });
}

/**
 * Add an item to the cart
 */
export function addToCart(diamondId: string, quantity: number = 1): Promise<Cart> {
  return post<Cart>('/api/cart/items', { diamondId, quantity });
}

/**
 * Update a specific item in the cart
 */
export function updateCartItem(diamondId: string, quantity: number): Promise<Cart> {
  return put<Cart>(`/api/cart/items/${diamondId}`, { quantity });
}

/**
 * Remove an item from the cart
 */
export function removeFromCart(diamondId: string): Promise<Cart> {
  return del<Cart>(`/api/cart/items/${diamondId}`);
}

/**
 * Clear the entire cart
 */
export function clearCart(): Promise<{ message: string }> {
  return del<{ message: string }>('/api/cart');
}

/**
 * Checkout the cart and create an order
 */
export interface CheckoutData {
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
  paymentMethod: string;
  paymentDetails?: any;
  notes?: string;
}

export interface CheckoutResponse {
  orderId: string;
  redirectUrl?: string;
  success: boolean;
}

export function checkout(checkoutData: CheckoutData): Promise<CheckoutResponse> {
  // Conditionally set requireAuth based on token presence
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const options = token ? { requireAuth: true } : {};
  return post<CheckoutResponse>('/api/cart/checkout', checkoutData, options);
}

/**
 * Merge a guest cart with the user's cart after login
 */
export function mergeCart(): Promise<Cart> {
  return post<Cart>('/api/cart/merge', {}, { requireAuth: true });
}

/**
 * Admin: Get all carts in the system
 */
export interface CartsListResponse {
  carts: Cart[];
  total: number;
}

export function getAllCarts(): Promise<CartsListResponse> {
  return get<CartsListResponse>('/api/carts', { requireAuth: true });
}
