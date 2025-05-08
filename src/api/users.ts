import { User } from '@/types/user';
import { del, get, post, put } from './client';

export interface UserListResponse {
  users: User[];
  total: number;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

/**
 * User login
 */
export function login(email: string, password: string): Promise<AuthResponse> {
  return post<AuthResponse>('/api/users/login', { email, password });
}

/**
 * User registration
 */
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function register(userData: RegisterData): Promise<AuthResponse> {
  return post<AuthResponse>('/api/users/register', userData);
}

/**
 * Get current authenticated user profile
 */
export function getCurrentUser(): Promise<Omit<User, 'password'>> {
  return get<Omit<User, 'password'>>('/api/users/me', { requireAuth: true });
}

/**
 * Update current user profile
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export function updateProfile(profileData: UpdateProfileData): Promise<Omit<User, 'password'>> {
  return put<Omit<User, 'password'>>('/api/users/me', profileData, { requireAuth: true });
}

/**
 * Admin: Get all users
 */
export function getAllUsers(): Promise<UserListResponse> {
  return get<UserListResponse>('/api/users', { requireAuth: true });
}

/**
 * Admin: Get a specific user
 */
export function getUser(id: string): Promise<Omit<User, 'password'>> {
  return get<Omit<User, 'password'>>(`/api/users/${id}`, { requireAuth: true });
}

/**
 * Admin: Create a new user
 */
export function createUser(
  userData: RegisterData & { role?: string }
): Promise<Omit<User, 'password'>> {
  return post<Omit<User, 'password'>>('/api/users', userData, { requireAuth: true });
}

/**
 * Admin: Update a user
 */
export function updateUser(
  id: string,
  userData: UpdateProfileData & { role?: string }
): Promise<Omit<User, 'password'>> {
  return put<Omit<User, 'password'>>(`/api/users/${id}`, userData, { requireAuth: true });
}

/**
 * Admin: Delete a user
 */
export function deleteUser(id: string): Promise<{ success: boolean }> {
  return del<{ success: boolean }>(`/api/users/${id}`, { requireAuth: true });
}

/**
 * Admin: Promote a user to admin
 */
export function promoteToAdmin(
  userId: string
): Promise<{ success: boolean; user: Omit<User, 'password'> }> {
  return post<{ success: boolean; user: Omit<User, 'password'> }>(
    '/api/users/promote',
    { userId },
    { requireAuth: true }
  );
}

/**
 * Request password reset
 */
export function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  return post<{ success: boolean; message: string }>('/api/users/reset-password', { email });
}

/**
 * Reset password with token
 */
export function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  return post<{ success: boolean; message: string }>('/api/users/reset-password/confirm', {
    token,
    newPassword,
  });
}
