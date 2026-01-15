import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache, ServerError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import auth from './Auth/Auth';
import { ENV_VARS_WRAPPER } from './configs/envVariables';
import { getFormattedErrorMessage } from './utils/errorFormatting';
import useUserStore from './store/user';

// this session id will be added to all graphql requests, this way we can track
// a full user session across all requests that a user makes while navigating our app
const sessionId = uuidv4();

const httpLink = new HttpLink({
  uri: (operation) => {
    const baseUrl = `${window[ENV_VARS_WRAPPER]?.REACT_APP_API_BASE_URL || ''}`;
    const operationName = operation.operationName;
    // Add operationName as a query parameter.
    // Using encodeURIComponent is a good practice.
    return `${baseUrl}?op=${encodeURIComponent(operationName)}`;
  },
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = auth.getAccessToken();

  // Check if we have a valid token and are authenticated
  if (!token || !auth.isAuthenticated()) {
    // If not authenticated, redirect to login
    // The Auth class already handles scheduled token renewal, so we don't need to call renewToken here
    auth.login({ signup: false, customQueryParams: null });
    return null;
  }

  // Additional safety check: ensure token is not empty or just whitespace
  if (!token.trim()) {
    auth.login({ signup: false, customQueryParams: null });
    return null;
  }

  operation.setContext(({ headers = {} }) => ({
    headers: { ...headers, authorization: token ? `Bearer ${token}` : null, 'x-nexoya-session-id': sessionId },
  }));

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  // Handle unauthorized errors (401) by redirecting to login - do this before showing error
  if (networkError && (networkError as ServerError).statusCode === 401) {
    auth.login({ signup: false, customQueryParams: null });
    return;
  }

  // Collect all errors for logging
  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[Network error]: ${networkError}`, {
      statusCode: (networkError as ServerError).statusCode,
      result: (networkError as ServerError).result,
      response,
    });
  }

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions, path }) => {
      // eslint-disable-next-line no-console
      console.log(`[GraphQL error]: ${message}`, { extensions, path, response });
    });
  }

  // Create a synthetic ApolloError-like object to extract error messages
  const errorToFormat = {
    graphQLErrors: graphQLErrors || [],
    networkError: networkError || null,
    response: response || null,
  } as any;

  // Extract and format error message based on user role
  const isSupportUser = useUserStore.getState().isSupportUser;
  
  // Show toast for all errors (skip 401 as it's handled separately)
  // Support users see the full formatted error message
  // Regular users see a UX-friendly generic message
  // Note: Some mutations have their own onError handlers that also show toasts,
  // which may result in duplicate messages. Those mutations can be updated to use
  // getFormattedErrorMessage from utils/errorFormatting instead of showing raw error.message
  if (networkError || (graphQLErrors && graphQLErrors.length > 0)) {
    if (isSupportUser) {
      // Support users see the full error details
      const formattedMessage = getFormattedErrorMessage(errorToFormat);
      toast.error(formattedMessage);
    } else {
      // Regular users see a UX-friendly generic message
      toast.error('An internal error has occurred, please try again or reach to your specialist');
    }
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          portfolio: { merge: true },
          portfolioV2: { merge: true },
          team: { merge: true },
          content: { merge: true },
          portfolioV2Meta: { keyArgs: ['teamId', 'portfolioId'] },
        },
      },
      BudgetProposal: { keyFields: ['optimizationId'] },
      // Disable normalization for filterListType as they can often be duplicates, leading into weird integration issues
      filterListType: { keyFields: false },
    },
  }),
  link: from([authMiddleware, errorLink, httpLink]),
});

export default client;
