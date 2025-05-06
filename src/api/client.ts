/**
 * Base API client with common request handling functionality
 */

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
  params?: Record<string, string>;
}

/**
 * Send a request to the API
 * @param path API endpoint path
 * @param options Request options
 * @returns Response data
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { requireAuth = false, params = {}, ...fetchOptions } = options;

  // Prepare URL with query parameters
  const url = new URL(path, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  // Prepare headers
  const headers = new Headers(fetchOptions.headers);

  if (fetchOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add authentication if required
  if (requireAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      throw new Error('Authentication required but no token found');
    }
  }

  // Send the request
  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
  });

  // Parse response
  const contentType = response.headers.get('Content-Type');
  let responseData;

  if (contentType?.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  // Handle error responses
  if (!response.ok) {
    // If the server returns error details, include them in the error
    const errorMessage =
      typeof responseData === 'object' && responseData.error
        ? responseData.error
        : 'API request failed';

    const error = new Error(errorMessage) as Error & {
      status?: number;
      data?: any;
    };

    error.status = response.status;
    error.data = responseData;

    throw error;
  }

  return responseData as T;
}

/**
 * Create a GET request
 */
export function get<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'GET' });
}

/**
 * Create a POST request
 */
export function post<T>(path: string, data?: any, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Create a PUT request
 */
export function put<T>(path: string, data?: any, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Create a PATCH request
 */
export function patch<T>(path: string, data?: any, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Create a DELETE request
 */
export function del<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'DELETE' });
}
