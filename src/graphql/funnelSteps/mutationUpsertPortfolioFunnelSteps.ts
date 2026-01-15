import { gql, MutationTuple, useMutation } from '@apollo/client';
import { NexoyaMutationUpsertPortfolioFunnelStepsArgs } from '../../types';
import { FUNNEL_STEPS_V2_QUERY } from './queryFunnelSteps';
import { useTeam } from '../../context/TeamProvider';

const UPSERT_PORTFOLIO_FUNNEL_STEPS_MUTATION = gql`
  mutation UpsertPortfolioFunnelSteps(
    $teamId: Int!
    $portfolioId: Int!
    $funnelSteps: [UpsertPortfolioFunnelStepsMutationFunnelStepInput!]!
  ) {
    upsertPortfolioFunnelSteps(teamId: $teamId, portfolioId: $portfolioId, funnelSteps: $funnelSteps) {
      funnelStepId
    }
  }
`;

const useUpsertPortfolioFunnelSteps = ({
  portfolioId,
}): MutationTuple<any, NexoyaMutationUpsertPortfolioFunnelStepsArgs> => {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation<any, NexoyaMutationUpsertPortfolioFunnelStepsArgs>(
    UPSERT_PORTFOLIO_FUNNEL_STEPS_MUTATION,
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
      ],
    },
  );

  return [mutation, state];
};

export { UPSERT_PORTFOLIO_FUNNEL_STEPS_MUTATION, useUpsertPortfolioFunnelSteps };
