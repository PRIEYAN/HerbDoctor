// Error handling utility for API responses
export interface ApiError {
  response?: {
    status: number;
    data: any;
  };
  request?: any;
  code?: string;
  message?: string;
}

export const getErrorMessage = (error: ApiError): string => {
  let errorMessage = 'An error occurred. Please try again.';
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const { message, error: serverError } = data || {};
    
    if (message) {
      errorMessage = message;
    } else if (serverError) {
      errorMessage = serverError;
    } else {
      // Handle specific HTTP status codes
      errorMessage = getStatusMessage(status);
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'Network error. Please check your connection and try again.';
  } else if (error.code === 'ECONNABORTED') {
    // Request timeout
    errorMessage = 'Request timeout. Please try again.';
  } else if (error.message) {
    // Other error messages
    errorMessage = error.message;
  }
  
  return errorMessage;
};

export const getStatusMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Unauthorized. Please check your credentials.';
    case 403:
      return 'Access forbidden. You don\'t have permission.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. Resource already exists.';
    case 422:
      return 'Validation error. Please check your data.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
      return 'Bad gateway. Server is temporarily unavailable.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 504:
      return 'Gateway timeout. Please try again.';
    default:
      return `Server error (${status})`;
  }
};

// Validation error formatter
export const formatValidationErrors = (errors: any): string => {
  if (typeof errors === 'string') {
    return errors;
  }
  
  if (Array.isArray(errors)) {
    return errors.join(', ');
  }
  
  if (typeof errors === 'object') {
    const errorMessages = Object.values(errors).filter(Boolean);
    return errorMessages.join(', ');
  }
  
  return 'Validation error occurred.';
};

// Network error checker
export const isNetworkError = (error: ApiError): boolean => {
  return !error.response && !!error.request;
};

// Authentication error checker
export const isAuthError = (error: ApiError): boolean => {
  return error.response?.status === 401 || error.response?.status === 403;
};

// Server error checker
export const isServerError = (error: ApiError): boolean => {
  const status = error.response?.status;
  return status ? status >= 500 : false;
};

// Client error checker
export const isClientError = (error: ApiError): boolean => {
  const status = error.response?.status;
  return status ? status >= 400 && status < 500 : false;
}; 