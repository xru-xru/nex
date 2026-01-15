import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';

const DELETE_PORTFOLIO_LABEL_MUTATION = gql`
  mutation deleteLabel($teamId: Int!, $portfolioId: Int!, $labelId: Int!) {
    deleteLabel(teamId: $teamId, portfolioId: $portfolioId, labelId: $labelId)
  }
`;

function useDeleteLabel({ portfolioId, labelId }) {
  const { teamId } = useTeam();
  return useMutation(DELETE_PORTFOLIO_LABEL_MUTATION, {
    variables: {
      teamId,
      portfolioId,
      labelId,
    },
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: PORTFOLIO_V2_META_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });
}

export { DELETE_PORTFOLIO_LABEL_MUTATION, useDeleteLabel };
