import { gql, useMutation } from '@apollo/client';

import { NexoyaPortfolioContentFunnelStepMetricInput } from 'types';

import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { useContentFilterStore } from '../../store/content-filter';

const UPDATE_CONTENT_TARGET_METRIC_MUTATION = gql`
  mutation updateContentTargetMetric(
    $teamId: Int!
    $portfolioId: Int!
    $contentFunnelStepMetric: PortfolioContentFunnelStepMetricInput!
  ) {
    updateContentTargetMetric(
      teamId: $teamId
      portfolioId: $portfolioId
      contentFunnelStepMetric: $contentFunnelStepMetric
    )
  }
`;
type Options = {
  portfolioId: number;
  isChildContent?: boolean;
};
type ExtendedOptions = {
  contentFunnelStepMetric: NexoyaPortfolioContentFunnelStepMetricInput;
};

function useUpdateContentTargetMetric({ portfolioId, isChildContent }: Options): any {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();

  const [mutation, state] = useMutation(UPDATE_CONTENT_TARGET_METRIC_MUTATION, {
    variables: {
      teamId,
      portfolioId,
    },
  });

  function extendMutation({ contentFunnelStepMetric }: ExtendedOptions) {
    return mutation({
      variables: {
        teamId,
        portfolioId,
        contentFunnelStepMetric,
      },
      refetchQueries: isChildContent
        ? [
            {
              query: PORTFOLIO_PARENT_CONTENTS_QUERY,
              variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
            },
          ]
        : null,
    });
  }

  return [mutation, state, extendMutation];
}

export { UPDATE_CONTENT_TARGET_METRIC_MUTATION, useUpdateContentTargetMetric };
