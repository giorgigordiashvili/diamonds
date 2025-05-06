import { useCallback, useEffect, useState } from 'react';

interface ApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  loadOnMount?: boolean;
  deps?: any[];
}

/**
 * Custom hook for handling API calls with loading, error, and data states
 *
 * @param apiFn The API function to call
 * @param options Configuration options
 * @returns Object with data, loading, error, and execute function
 */
export function useApi<T, P extends any[]>(
  apiFn: (...args: P) => Promise<T>,
  options: ApiOptions<T> = {}
) {
  const { onSuccess, onError, loadOnMount = false, deps = [] } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to execute the API call
  const execute = useCallback(
    async (...args: P) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFn(...args);

        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFn, onSuccess, onError]
  );

  // Call API on mount if loadOnMount is true
  useEffect(() => {
    if (loadOnMount) {
      execute(...([] as unknown as P));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadOnMount, execute, ...deps]);

  return { data, loading, error, execute };
}

/**
 * Custom hook for managing and persisting authentication state
 */
export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load auth state on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);

      // Try to get user data
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // Invalid user data, clear it
          localStorage.removeItem('userData');
        }
      }
    }

    setIsAuthLoading(false);
  }, []);

  // Login function
  const login = useCallback((authToken: string, userData: any) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Update user data
  const updateUserData = useCallback((userData: any) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  }, []);

  return {
    token,
    user,
    isAuthenticated,
    isAuthLoading,
    login,
    logout,
    updateUserData,
  };
}

/**
 * Custom hook for handling form state
 */
export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // Reset the form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const fieldName = name as keyof T;

      // Convert value type if needed (e.g., for number inputs)
      const fieldValue = type === 'number' ? parseFloat(value) : value;

      setValues((prevValues) => ({
        ...prevValues,
        [fieldName]: fieldValue,
      }));
    },
    []
  );

  // Handle field blur (for validation)
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      const fieldName = name as keyof T;

      setTouched((prevTouched) => ({
        ...prevTouched,
        [fieldName]: true,
      }));
    },
    []
  );

  // Set a specific field value
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  }, []);

  // Set a specific field error
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    resetForm,
    setValues,
    setErrors,
    setTouched,
  };
}
