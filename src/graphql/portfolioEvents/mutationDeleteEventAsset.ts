import { gql, useMutation } from '@apollo/client';

const DELETE_PORTFOLIO_EVENT_ASSET_MUTATION = gql`
  mutation DeletePortfolioEventAsset($portfolioId: Float!, $portfolioEventId: Float!, $teamId: Float!) {
    deletePortfolioEventAsset(portfolioId: $portfolioId, portfolioEventId: $portfolioEventId, teamId: $teamId)
  }
`;

function useDeletePortfolioEventAsset() {
  return useMutation(DELETE_PORTFOLIO_EVENT_ASSET_MUTATION, {
    notifyOnNetworkStatusChange: true,
  });
}

export { DELETE_PORTFOLIO_EVENT_ASSET_MUTATION, useDeletePortfolioEventAsset };
