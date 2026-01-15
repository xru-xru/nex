import { gql } from '@apollo/client';

const REMOVE_PORTFOLIO_CONTENT_MUTATION_WITH_COLLECTION_ID = gql`
  mutation RemovePortfolioContentWithCollectionId($teamId: Int!, $portfolioId: Int!, $collectionIds: [Float!]!) {
    removePortfolioContentWithCollectionId(teamId: $teamId, portfolioId: $portfolioId, collectionIds: $collectionIds)
  }
`;

export { REMOVE_PORTFOLIO_CONTENT_MUTATION_WITH_COLLECTION_ID };
