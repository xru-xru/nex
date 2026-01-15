import { gql } from '@apollo/client';

const ASSIGN_IMPACT_GROUP_TO_PORTFOLIO_CONTENT_MUTATION = gql`
  mutation AssignImpactGroupToPortfolioContents(
    $contentIds: [Float!]!
    $impactGroupId: Int
    $portfolioId: Int!
    $teamId: Int!
  ) {
    assignImpactGroupToPortfolioContents(
      contentIds: $contentIds
      impactGroupId: $impactGroupId
      portfolioId: $portfolioId
      teamId: $teamId
    ) {
      portfolioContentId
    }
  }
`;

export { ASSIGN_IMPACT_GROUP_TO_PORTFOLIO_CONTENT_MUTATION };
