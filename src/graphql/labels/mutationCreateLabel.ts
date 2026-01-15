import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';
import { NexoyaPortfolioLabel } from 'types';

const CREATE_OR_UPDATE_LABEL_MUTATION = gql`
  mutation createOrUpdateLabel($teamId: Int!, $portfolioId: Int!, $name: String!, $labelId: Int) {
    createOrUpdateLabel(teamId: $teamId, portfolioId: $portfolioId, name: $name, labelId: $labelId) {
      labelId
      name
    }
  }
`;

function useCreateOrUpdateLabel({ portfolioId, name, labelId }) {
  const { teamId } = useTeam();
  return useMutation<{ createOrUpdateLabel: NexoyaPortfolioLabel }>(CREATE_OR_UPDATE_LABEL_MUTATION, {
    variables: {
      teamId,
      portfolioId,
      name,
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

export { CREATE_OR_UPDATE_LABEL_MUTATION, useCreateOrUpdateLabel };
