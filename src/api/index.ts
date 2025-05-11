// Export all API functions for easy imports

// Base client
export * from './client';

// Resource-specific APIs
export * as cartApi from './cart';
export * as diamondsApi from './diamonds';
export * as ordersApi from './orders';
// export * as paymentsApi from './payments';
export * as uploadsApi from './uploads';
export * as usersApi from './users';

// Re-export common types for convenience
export type { DiamondListResponse, DiamondSearchParams } from './diamonds';

export type { CartsListResponse, CheckoutData, CheckoutResponse } from './cart';

export type { CreateOrderData, OrderListResponse, OrderSearchParams } from './orders';
// export type { CreatePaymentData, PaymentListResponse, PaymentSearchParams } from './payments';

export type { AuthResponse, RegisterData, UpdateProfileData, UserListResponse } from './users';

export type { UploadResponse } from './uploads';
