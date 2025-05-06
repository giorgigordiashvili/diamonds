// Export all API functions for easy imports

// Base client
export * from './client';

// Resource-specific APIs
export * as diamondsApi from './diamonds';
export * as cartApi from './cart';
export * as ordersApi from './orders';
export * as paymentsApi from './payments';
export * as usersApi from './users';
export * as uploadsApi from './uploads';

// Re-export common types for convenience
export type { DiamondSearchParams, DiamondListResponse } from './diamonds';

export type { CheckoutData, CheckoutResponse, CartsListResponse } from './cart';

export type { OrderSearchParams, OrderListResponse, CreateOrderData } from './orders';

export type { PaymentSearchParams, PaymentListResponse, CreatePaymentData } from './payments';

export type { AuthResponse, RegisterData, UpdateProfileData, UserListResponse } from './users';

export type { UploadResponse } from './uploads';
