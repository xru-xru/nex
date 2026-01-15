import { gql } from '@apollo/client';

const UPDATE_FEATURE_FLAG_MUTATION = gql`
  mutation updateFeatureFlag($teamId: Int!, $portfolioId: Int!, $name: PortfolioFeatureFlag!, $status: Boolean!) {
    updateFeatureFlag(teamId: $teamId, portfolioId: $portfolioId, name: $name, status: $status)
  }
`;

export { UPDATE_FEATURE_FLAG_MUTATION };
