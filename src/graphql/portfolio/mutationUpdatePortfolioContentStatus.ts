import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { useContentFilterStore } from '../../store/content-filter';

const UPDATE_PORTFOLIO_CONTENT_STATUS_MUTATION = gql`
  mutation UpdatePortfolioContentsIncludedInOptimization(
    $teamId: Float!
    $portfolioId: Float!
    $portfolioContentIds: [Float!]!
    $isIncludedInOptimization: Boolean!
  ) {
    updatePortfolioContentsIncludedInOptimization(
      teamId: $teamId
      portfolioId: $portfolioId
      portfolioContentIds: $portfolioContentIds
      isIncludedInOptimization: $isIncludedInOptimization
    ) {
      portfolioContentId
    }
  }
`;

type Options = {
  portfolioId: number;
  portfolioContentIds: number[];
  isIncludedInOptimization?: boolean;
};

function useUpdatePortfolioContentsIncludedInOptimizationMutation({
  portfolioId,
  portfolioContentIds,
  isIncludedInOptimization,
}: Options): any {
  const filterStore = useContentFilterStore();

  const { teamId } = useTeam();
  const [mutation, state] = useMutation(UPDATE_PORTFOLIO_CONTENT_STATUS_MUTATION, {
    notifyOnNetworkStatusChange: true,
    awaitRefetchQueries: true,
    variables: {
      teamId,
      portfolioId,
      portfolioContentIds,
      isIncludedInOptimization,
    },
    refetchQueries: [
      {
        query: PORTFOLIO_PARENT_CONTENTS_QUERY,
        variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
      },
    ],
    onCompleted: () => {
      track(isIncludedInOptimization ? EVENT.ENABLE_CONTENT_OPTIMIZATION : EVENT.DISABLE_CONTENT_OPTIMIZATION);
    },
  });
  return [mutation, state];
}

export { UPDATE_PORTFOLIO_CONTENT_STATUS_MUTATION, useUpdatePortfolioContentsIncludedInOptimizationMutation };
