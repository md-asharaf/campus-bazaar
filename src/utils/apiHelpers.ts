import type { ApiResponse } from "@/types";

/**
 * Utility functions for handling API responses consistently across the app
 */

/**
 * Extract data from API response safely
 */
export const extractApiData = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || 'API request failed');
  }
  return response.data;
};

/**
 * Handle API response with error checking
 */
export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response format');
  }

  if (!response.success) {
    throw new Error(response.message || 'Request failed');
  }

  return response.data;
};

/**
 * Create a typed query function for React Query
 */
export const createQueryFn = <T>(
  apiCall: () => Promise<ApiResponse<T>>
) => {
  return async (): Promise<T> => {
    const response = await apiCall();
    return handleApiResponse(response);
  };
};

/**
 * Create a typed mutation function for React Query
 */
export const createMutationFn = <TData, TVariables = void>(
  apiCall: (variables: TVariables) => Promise<ApiResponse<TData>>
) => {
  return async (variables: TVariables): Promise<TData> => {
    const response = await apiCall(variables);
    return handleApiResponse(response);
  };
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Check if response is successful
 */
export const isApiSuccess = <T>(response: any): response is ApiResponse<T> => {
  return response && 
         typeof response === 'object' && 
         'success' in response && 
         'message' in response && 
         'data' in response &&
         response.success === true;
};

/**
 * Validate API response structure
 */
export const validateApiResponse = <T>(response: any): ApiResponse<T> => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response: not an object');
  }

  if (!('success' in response)) {
    throw new Error('Invalid response: missing success field');
  }

  if (!('message' in response)) {
    throw new Error('Invalid response: missing message field');
  }

  if (!('data' in response)) {
    throw new Error('Invalid response: missing data field');
  }

  return response as ApiResponse<T>;
};

/**
 * Wrapper for service calls that automatically handles API response format
 */
export const wrapServiceCall = <T>(
  serviceCall: () => Promise<any>
): Promise<T> => {
  return serviceCall().then((response) => {
    const validatedResponse = validateApiResponse<T>(response);
    return handleApiResponse(validatedResponse);
  });
};

/**
 * Create safe query function with error boundaries
 */
export const createSafeQueryFn = <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  fallbackData?: T
) => {
  return async (): Promise<T> => {
    try {
      const response = await apiCall();
      return handleApiResponse(response);
    } catch (error) {
      console.error('Query failed:', handleApiError(error));
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw error;
    }
  };
};

/**
 * Retry wrapper for API calls
 */
export const withRetry = <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const attempt = async (retryCount: number) => {
      try {
        const result = await apiCall();
        resolve(result);
      } catch (error) {
        if (retryCount < maxRetries) {
          setTimeout(() => attempt(retryCount + 1), delay * retryCount);
        } else {
          reject(error);
        }
      }
    };
    
    attempt(1);
  });
};