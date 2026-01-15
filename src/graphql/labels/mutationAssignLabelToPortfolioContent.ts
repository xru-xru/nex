import { gql } from '@apollo/client';

const ASSIGN_LABEL_TO_PORTFOLIO_CONTENT_MUTATION = gql`
  mutation AssignLabelToPortfolioContents($contentIds: [Float!]!, $labelId: Int, $portfolioId: Int!, $teamId: Int!) {
    bulkAssignLabels(contentIds: $contentIds, labelId: $labelId, portfolioId: $portfolioId, teamId: $teamId)
  }
`;

export { ASSIGN_LABEL_TO_PORTFOLIO_CONTENT_MUTATION };
