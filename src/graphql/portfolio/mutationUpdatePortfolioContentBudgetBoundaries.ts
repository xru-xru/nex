import { FetchResult, gql, MutationFunctionOptions, MutationResult, useMutation } from '@apollo/client';

import { NexoyaPortfolioContentBudgetInput } from '../../types';

import { useTeam } from '../../context/TeamProvider';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { useContentFilterStore } from '../../store/content-filter';

const UPDATE_PORTFOLIO_CONTENT_BUDGET_BOUNDARIES = gql`
  mutation UpdatePortfolioContentBudgetBoundaries(
    $teamId: Float!
    $portfolioId: Float!
    $contents: [Float!]
    $newBudget: PortfolioContentBudgetInput!
  ) {
    updatePortfolioContentBudgetBoundaries(
      teamId: $teamId
      portfolioId: $portfolioId
      onlyContentIds: $contents
      newBudget: $newBudget
    )
  }
`;
type Options = {
  portfolioId: number;
  contents: number[];
  newBudget: NexoyaPortfolioContentBudgetInput;
};

type IMutationResult = [
  (
    options?: MutationFunctionOptions<
      Options,
      {
        portfolioId: number;
        contents: number[];
        newBudget: NexoyaPortfolioContentBudgetInput;
        teamId: number;
      }
    >,
  ) => Promise<FetchResult<void>>,
  MutationResult,
];

function useUpdatePortfolioContentBudgetBoundaries({ portfolioId, contents, newBudget }: Options): IMutationResult {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();
  const [mutation, state] = useMutation(UPDATE_PORTFOLIO_CONTENT_BUDGET_BOUNDARIES, {
    notifyOnNetworkStatusChange: true,
    awaitRefetchQueries: true,
    variables: {
      teamId,
      portfolioId,
      contents,
      newBudget,
    },
    onCompleted: () => track(EVENT.PORTFOLIO_CONTENT_BUDGET_BOUNDARIES_UPDATE),
    refetchQueries: [
      {
        query: PORTFOLIO_PARENT_CONTENTS_QUERY,
        variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
      },
    ],
  });
  return [mutation, state];
}

export { UPDATE_PORTFOLIO_CONTENT_BUDGET_BOUNDARIES, useUpdatePortfolioContentBudgetBoundaries };
