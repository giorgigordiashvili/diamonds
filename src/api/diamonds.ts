import { Diamond } from '@/types/diamond';
import { del, get, post, put } from './client';

export interface DiamondListResponse {
  diamonds: Diamond[];
  total: number;
}

export interface DiamondSearchParams {
  search?: string;
  shape?: string;
  caratMin?: number;
  caratMax?: number;
  colorMin?: string;
  colorMax?: string;
  clarityMin?: string;
  clarityMax?: string;
  cutMin?: string;
  cutMax?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get a list of diamonds with optional filtering
 */
export function getDiamonds(params: DiamondSearchParams = {}): Promise<DiamondListResponse> {
  return get<DiamondListResponse>('/api/diamonds', {
    params: params as Record<string, string>,
  });
}

/**
 * Get a single diamond by ID
 */
export function getDiamond(id: string): Promise<Diamond> {
  return get<Diamond>(`/api/diamonds/${id}`);
}

/**
 * Create a new diamond (admin only)
 */
export function createDiamond(diamond: Omit<Diamond, 'id'>): Promise<Diamond> {
  return post<Diamond>('/api/diamonds', diamond, { requireAuth: true });
}

/**
 * Update an existing diamond (admin only)
 */
export function updateDiamond(id: string, diamond: Partial<Diamond>): Promise<Diamond> {
  return put<Diamond>(`/api/diamonds/${id}`, diamond, { requireAuth: true });
}

/**
 * Delete a diamond (admin only)
 */
export function deleteDiamond(id: string): Promise<{ success: boolean }> {
  return del<{ success: boolean }>(`/api/diamonds/${id}`, { requireAuth: true });
}
