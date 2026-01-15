import { gql, MutationTuple, useMutation } from '@apollo/client';
import { FUNNEL_STEPS_V2_QUERY } from './queryFunnelSteps';
import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_V2_META_QUERY } from '../portfolio/queryPortfolioMeta';
import { toast } from 'sonner';

const DELETE_FUNNEL_STEP_MUTATION = gql`
  mutation DeleteFunnelStep($teamId: Int!, $portfolioId: Int!, $funnelStepId: Int!) {
    deleteFunnelStep(teamId: $teamId, portfolioId: $portfolioId, funnelStepId: $funnelStepId)
  }
`;

const useDeleteFunnelStep = ({
  portfolioId,
}: {
  portfolioId: number;
}): MutationTuple<any, { teamId: number; portfolioId: number; funnelStepId: number }> => {
  const { teamId } = useTeam();

  // Hook to perform mutation
  const [mutation, state] = useMutation<any, { teamId: number; portfolioId: number; funnelStepId: number }>(
    DELETE_FUNNEL_STEP_MUTATION,
    {
      notifyOnNetworkStatusChange: true,
      awaitRefetchQueries: true,
      onError: (error) => toast.error(error.message),
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

export { DELETE_FUNNEL_STEP_MUTATION, useDeleteFunnelStep };
