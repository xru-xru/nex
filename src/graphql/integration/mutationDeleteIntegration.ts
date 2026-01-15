import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const DELETE_INTEGRATION_MUTATION = gql`
  mutation deleteIntegration($team_id: Int!, $provider_id: Int!) {
    deleteIntegration(team_id: $team_id, provider_id: $provider_id)
  }
`;
type Options = {
  providerId: number;
};

function useDeleteIntegrationMutation({ providerId }: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(DELETE_INTEGRATION_MUTATION, {
    variables: {
      team_id: teamId,
      provider_id: providerId,
    },
  });
  return [mutation, state];
}

export { DELETE_INTEGRATION_MUTATION, useDeleteIntegrationMutation };
