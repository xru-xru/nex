import { gql, MutationTuple, useMutation } from '@apollo/client';
import { FUNNEL_STEPS_V2_QUERY } from './queryFunnelSteps';
import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';

const UPDATE_FUNNEL_STEP_TARGET_MUTATION = gql`
  mutation UpdateFunnelStepTarget($teamId: Int!, $portfolioId: Int!, $funnelStepId: Int!) {
    updateDefaultOptimizationTarget(teamId: $teamId, portfolioId: $portfolioId, funnelStepId: $funnelStepId)
  }
`;

const useUpdateFunnelStepTarget = ({
  portfolioId,
}: {
  portfolioId: number;
}): MutationTuple<any, { teamId: number; portfolioId: number; funnelStepId: number }> => {
  const { teamId } = useTeam();

  // Hook to perform mutation
  const [mutation, state] = useMutation<any, { teamId: number; portfolioId: number; funnelStepId: number }>(
    UPDATE_FUNNEL_STEP_TARGET_MUTATION,
    {
      notifyOnNetworkStatusChange: true,
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: FUNNEL_STEPS_V2_QUERY,
          variables: {
            teamId,
            portfolioId,
          },
        },
        {
          query: PORTFOLIO_V2_META_QUERY,
          variables: {
            teamId,
            portfolioId,
          },
        },
      ],
    },
  );

  return [mutation, state];
};

export { UPDATE_FUNNEL_STEP_TARGET_MUTATION, useUpdateFunnelStepTarget };
