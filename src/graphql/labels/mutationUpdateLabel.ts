import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';

const UPDATE_LABEL_MUTATION = gql`
  mutation updateLabel($teamId: Int!, $portfolioId: Int!, $name: String!, $labelId: Int!) {
    updateLabel(teamId: $teamId, portfolioId: $portfolioId, name: $name, labelId: $labelId) {
      labelId
      name
    }
  }
`;

function useUpdateLabel({ portfolioId, name, labelId }) {
  const { teamId } = useTeam();
  return useMutation(UPDATE_LABEL_MUTATION, {
    variables: {
      teamId,
      portfolioId,
      labelId,
      name,
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

export { UPDATE_LABEL_MUTATION, useUpdateLabel };
