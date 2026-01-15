import { ApolloError, ServerError } from '@apollo/client';
import useUserStore from '../store/user';

/**
 * Extracts error messages from Apollo errors, including from the response body
 */
export function extractErrorMessage(error: ApolloError | Error | any): string {
  // Handle GraphQL errors
  if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    
    // Try to get error from extensions first (often contains the real error message)
    if (graphQLError.extensions?.message) {
      return String(graphQLError.extensions.message);
    }
    
    // Try to get error from extensions.code or other extension fields
    if (graphQLError.extensions?.code) {
      // Some errors have code and message in extensions
      const extensionMessage = graphQLError.extensions.message || graphQLError.message;
      if (extensionMessage) {
        return String(extensionMessage);
      }
    }
    
    // Try to get error from response body data (if available in error object)
    if (error?.response?.data?.errors?.[0]?.message) {
      return error.response.data.errors[0].message;
    }
    if (error?.response?.data?.error) {
      return String(error.response.data.error);
    }
    
    // Use GraphQL error message
    if (graphQLError.message) {
      return graphQLError.message;
    }
  }
  
  // Handle network errors
  if (error?.networkError) {
    const networkError = error.networkError as ServerError;
    
    // Check response body (result) for error messages first
    if (networkError.result) {
      const result = networkError.result as any;
      
      // Check for errors array in result
      if (Array.isArray(result.errors) && result.errors.length > 0) {
        const firstError = result.errors[0];
        if (firstError.message) {
          return firstError.message;
        }
      }
      
      // Check for single error object
      if (result.error) {
        return String(result.error);
      }
      if (result.message) {
        return String(result.message);
      }
    }
    
    // Check if response is available in the error object itself
    if (error?.response) {
      const response = error.response as any;
      if (response.data?.errors?.[0]?.message) {
        return response.data.errors[0].message;
      }
      if (response.data?.error) {
        return String(response.data.error);
      }
    }
    
    // Check statusCode
    if (networkError.statusCode) {
      return `Response status ${networkError.statusCode}`;
    }
    
    // Fallback to network error message
    if (networkError.message) {
      return networkError.message;
    }
  }
  
  // Handle regular Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle objects with message property
  if (error?.message && typeof error.message === 'string') {
    return error.message;
  }
  
  // Handle string messages
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback
  return 'An unknown error occurred';
}

/**
 * Formats error message for display based on user role
 * @param error - The error object
 * @param isSupportUser - Whether the current user is a support user
 * @returns Formatted error message
 */
export function formatErrorMessageForUser(
  error: ApolloError | Error,
  isSupportUser: boolean
): string {
  const extractedMessage = extractErrorMessage(error);
  
  // Support users see the full error message
  if (isSupportUser) {
    return extractedMessage;
  }
  
  // Regular users see a generic message unless it's a user-friendly error
  // Check if the error message looks like a technical error (e.g., "Response status 400")
  const isTechnicalError = /^(Response status \d+|Network Error|Failed to fetch|Error:)/i.test(extractedMessage);
  
  if (isTechnicalError) {
    return 'An internal error has occurred, please try again or reach to your specialist';
  }
  
  // If it's a meaningful message (not a technical error), show it to regular users too
  return extractedMessage;
}

/**
 * Gets formatted error message using current user's role from the store
 * This can be used outside React components
 */
export function getFormattedErrorMessage(error: ApolloError | Error): string {
  const isSupportUser = useUserStore.getState().isSupportUser;
  return formatErrorMessageForUser(error, isSupportUser);
}
