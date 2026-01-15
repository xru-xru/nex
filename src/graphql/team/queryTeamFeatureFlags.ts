import { gql, useQuery } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaTeamFeatureFlagName } from '../../types';

const TEAM_FEATURE_FLAGS_QUERY = gql`
  query TeamFeatureFlags($team_id: Int!) {
    teamFeatureFlags(team_id: $team_id) {
      name
      status
    }
  }
`;

type TeamFeatureFlagsQueryResult = {
  teamFeatureFlags: Array<{
    name: NexoyaTeamFeatureFlagName;
    status: boolean;
  }>;
};

type Options = {
  skip?: boolean;
};

function useTeamFeatureFlagsQuery({ skip = false }: Options = {}) {
  const { teamId } = useTeam();

  return useQuery<TeamFeatureFlagsQueryResult, { team_id: number }>(TEAM_FEATURE_FLAGS_QUERY, {
    skip: !teamId || skip,
    variables: {
      team_id: teamId,
    },
  });
}

export { TEAM_FEATURE_FLAGS_QUERY, useTeamFeatureFlagsQuery };
