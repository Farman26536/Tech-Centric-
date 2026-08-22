import axios from 'axios';

export const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    // Network errors or connection issues
    if (!error.response || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'Unable to connect to the server. Please try again.';
    }

    const status = error.response.status;
    const serverMessage = error.response.data?.message;

    // Handle 401 Unauthorized
    if (status === 401) {
      if (
        serverMessage?.toLowerCase().includes('invalid email or password') ||
        serverMessage?.toLowerCase().includes('invalid credentials')
      ) {
        return 'Invalid email or password.';
      }
      return 'Please log in to continue.';
    }

    // Handle 403 Forbidden
    if (status === 403) {
      return "You don't have permission to access this page.";
    }

    // Handle 404 Not Found
    if (status === 404) {
      if (
        serverMessage?.toLowerCase().includes('account') ||
        serverMessage?.toLowerCase().includes('user') ||
        serverMessage?.toLowerCase().includes('email')
      ) {
        return 'No account found with this email.';
      }
      return "The page you're looking for doesn't exist.";
    }

    // Handle 500 and internal server errors
    if (status >= 500) {
      return 'Something went wrong. Please try again later.';
    }

    // Handle 400 and other 4xx errors
    if (serverMessage) {
      const lower = serverMessage.toLowerCase();
      if (lower.includes('invalid email or password') || lower.includes('invalid credentials')) {
        return 'Invalid email or password.';
      }
      if (lower.includes('account not found') || lower.includes('no account found') || lower.includes('user not found')) {
        return 'No account found with this email.';
      }
      if (lower.includes('already exists') || lower.includes('email already in use')) {
        return 'An account with this email already exists.';
      }
      if (!/^\d{3}\b/.test(serverMessage) && !lower.includes('axioserror')) {
        return serverMessage;
      }
    }

    return 'Something went wrong. Please try again later.';
  }

  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes('Network Error') || msg.includes('Failed to fetch')) {
      return 'Unable to connect to the server. Please try again.';
    }
    if (!/^\d{3}\b/.test(msg) && !msg.toLowerCase().includes('axioserror')) {
      return msg;
    }
  }

  return 'Something went wrong. Please try again later.';
};
