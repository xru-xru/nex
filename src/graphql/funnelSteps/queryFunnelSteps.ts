import { gql, QueryResult, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';
import { NexoyaFunnelStepV2 } from '../../types';

const FUNNEL_STEPS_V2_QUERY = gql`
  query GlobalFunnelSteps($teamId: Int!, $portfolioId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      funnelSteps {
        funnelStepId
        title
        type
        isAttributed
        isMeasured
      }
    }
  }
`;

type GlobalOptions = {
  portfolioId: number;
  onCompleted?: (data: GlobalFunnelStepsResponse) => void;
};

type GlobalFunnelStepsResponse = {
  portfolioV2: {
    funnelSteps: NexoyaFunnelStepV2[];
  };
};

type GlobalFunnelStepsVariables = {
  teamId: number;
  portfolioId: number;
};

function useFunnelStepsV2Query({
  portfolioId,
  onCompleted,
}: GlobalOptions): QueryResult<GlobalFunnelStepsResponse, GlobalFunnelStepsVariables> {
  const { teamId } = useTeam();
  const query = useQuery<GlobalFunnelStepsResponse, GlobalFunnelStepsVariables>(FUNNEL_STEPS_V2_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
    },
    skip: !portfolioId,
    onCompleted,
  });
  return query;
}

export { useFunnelStepsV2Query, FUNNEL_STEPS_V2_QUERY };
