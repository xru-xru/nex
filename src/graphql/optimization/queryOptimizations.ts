import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { separateLoading } from '../../utils/graphql';

const OPTIMIZATIONS_QUERY = gql`
  query Optimizations($team_id: Int!, $campaign_id: Int) {
    intermediate_results(team_id: $team_id, campaign_id: $campaign_id) {
      has_results
      analysis_results {
        campaign_id
        title
        presentation_result
        detail_result
        #        created_at
      }
    }
  }
`;

type Options = {
  campaign_id?: number;
};

function useOptimizationsQuery({ campaign_id }: Options = {}) {
  const { teamId } = useTeam();
  const query = useQuery(OPTIMIZATIONS_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      team_id: teamId,
      campaign_id,
    },
  });
  return { ...separateLoading(query) };
}

export { OPTIMIZATIONS_QUERY, useOptimizationsQuery };
