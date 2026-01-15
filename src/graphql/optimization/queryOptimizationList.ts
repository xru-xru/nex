import { gql } from '@apollo/client';

import { OPTIMIZATION_FRAGMENT } from './fragments';

const OPTIMIZATION_LIST = gql`
  query OptimizationList($teamId: Int!, $portfolioId: Int!, $status: OptimizationStatus!, $first: Int, $after: String) {
    portfolioV2(portfolioId: $portfolioId, teamId: $teamId) {
      optimizations(status: $status, first: $first, after: $after) {
        edges {
          cursor
          node {
            ...Optimization
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
  ${OPTIMIZATION_FRAGMENT}
`;

export { OPTIMIZATION_LIST };
