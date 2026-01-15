import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaManualContentFunnelStepMappingInput } from '../../types';
import { PROVIDER_METRIC_OPTIONS_QUERY } from './queryContentMetricOptions';
import usePortfolioMetaStore from '../../store/portfolio-meta';
import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from './queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { useContentFilterStore } from '../../store/content-filter';

const ASSIGN_FUNNEL_STEP_METRICS_MUTATION = gql`
  mutation AssignFunnelStepMetricsToPortfolioContents(
    $teamId: Int!
    $portfolioId: Int!
    $contentIds: [Float!]!
    $funnelStepMappings: [ManualContentFunnelStepMappingInput!]!
  ) {
    assignFunnelStepMetricsToPortfolioContents(
      teamId: $teamId
      portfolioId: $portfolioId
      contentIds: $contentIds
      funnelStepMappings: $funnelStepMappings
    ) {
      portfolioContentId
    }
  }
`;

type AssignFunnelStepMetricsProps = {
  teamId: number;
  portfolioId: number;
  contentIds: number[];
  funnelStepMappings: NexoyaManualContentFunnelStepMappingInput[];
};

export function useAssignFunnelStepMetricsToPortfolioContentsMutation({ onCompleted }) {
  const { teamId } = useTeam();
  const { portfolioId } = usePortfolioMetaStore().portfolioMeta;

  const filterStore = useContentFilterStore();

  return useMutation<{ assignFunnelStepMetricsToPortfolioContents: any }, AssignFunnelStepMetricsProps>(
    ASSIGN_FUNNEL_STEP_METRICS_MUTATION,
    {
      onCompleted,
      onError: (error) => {
        console.error('Error assigning funnel step metrics:', error);
        toast.error(error.message || 'Failed to assign metrics to contents');
      },
      refetchQueries: [
        {
          query: PORTFOLIO_PARENT_CONTENTS_QUERY,
          variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
        },
        {
          query: PROVIDER_METRIC_OPTIONS_QUERY,
          variables: {
            teamId,
            portfolioId,
          },
        },
      ],
    },
  );
}
