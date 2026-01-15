import { gql, useMutation } from '@apollo/client';

const BULK_UPDATE_PORTFOLIO_EVENTS_MUTATION = gql`
  mutation BulkUpdatePortfolioEvents(
    $portfolioId: Float!
    $portfolioEvents: [BulkUpdatePortfolioEventInput!]!
    $teamId: Float!
  ) {
    bulkUpdatePortfolioEvents(portfolioId: $portfolioId, portfolioEvents: $portfolioEvents, teamId: $teamId) {
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

function useBulkUpdatePortfolioEventsMutation() {
  return useMutation(BULK_UPDATE_PORTFOLIO_EVENTS_MUTATION, {
    notifyOnNetworkStatusChange: true,
  });
}

export { BULK_UPDATE_PORTFOLIO_EVENTS_MUTATION, useBulkUpdatePortfolioEventsMutation };
