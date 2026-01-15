import { gql, useMutation } from '@apollo/client';

const BULK_CREATE_PORTFOLIO_EVENTS_MUTATION = gql`
  mutation BulkCreatePortfolioEvents(
    $portfolioId: Float!
    $portfolioEvents: [BulkCreatePortfolioEventInput!]!
    $teamId: Float!
  ) {
    bulkCreatePortfolioEvents(portfolioId: $portfolioId, portfolioEvents: $portfolioEvents, teamId: $teamId) {
      portfolioEvents {
        portfolioEventId
        assetUrl
        name
        description
        impact
        start
        end
        category
        created
        includesAllContents
      }
    }
  }
`;

function useBulkCreatePortfolioEventsMutation() {
  return useMutation(BULK_CREATE_PORTFOLIO_EVENTS_MUTATION, {
    notifyOnNetworkStatusChange: true,
  });
}

export { BULK_CREATE_PORTFOLIO_EVENTS_MUTATION, useBulkCreatePortfolioEventsMutation };
