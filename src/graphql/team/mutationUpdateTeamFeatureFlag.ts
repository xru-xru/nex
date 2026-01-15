import { gql, useMutation } from '@apollo/client';
import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

const UPDATE_TEAM_FEATURE_FLAG_MUTATION = gql`
  mutation UpdateTeamFeatureFlag($team_id: Int!, $name: String!, $status: Boolean!) {
    updateTeamFeatureFlag(team_id: $team_id, name: $name, status: $status) {
      team_id
    }
  }
`;

type Options = {
  onCompleted?: () => void;
  onError?: (error: any) => void;
};

type UpdateTeamFeatureFlagVariables = {
  team_id: number;
  name: string;
  status: boolean;
};

function useUpdateTeamFeatureFlagMutation(options?: Options) {
  const [mutation, state] = useMutation<{ updateTeamFeatureFlag: { team_id: number } }, UpdateTeamFeatureFlagVariables>(
    UPDATE_TEAM_FEATURE_FLAG_MUTATION,
    {
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        track(EVENT.TEAM_FEATURE_FLAG_UPDATE);
        options?.onCompleted?.();
      },
      onError: options?.onError,
    },
  );

  return [mutation, state] as const;
}

export { UPDATE_TEAM_FEATURE_FLAG_MUTATION, useUpdateTeamFeatureFlagMutation };
