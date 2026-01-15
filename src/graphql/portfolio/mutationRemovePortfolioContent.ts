import { gql, useMutation } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';

import { useTeam } from 'context/TeamProvider';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { useContentFilterStore } from '../../store/content-filter';

const REMOVE_PORTFOLIO_CONTENT_MUTATION = gql`
  mutation RemovePortfolioContent($teamId: Int!, $portfolioId: Int!, $portfolioContentIds: [Int!]!) {
    removePortfolioContent(teamId: $teamId, portfolioId: $portfolioId, portfolioContentIds: $portfolioContentIds) {
      portfolioContentId
    }
  }
`;

type Props = {
  portfolioId: number;
  portfolioContentIds: number[];
  additionalOptions?: OperationVariables;
};
const useRemovePortfolioContentMutation = ({ portfolioId, portfolioContentIds, additionalOptions }: Props) => {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();

  const [mutation, state] = useMutation(REMOVE_PORTFOLIO_CONTENT_MUTATION, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
      portfolioContentIds,
    },
    refetchQueries: [
      {
        query: PORTFOLIO_PARENT_CONTENTS_QUERY,
        variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
      },
    ],
    ...additionalOptions,
  });

  return [mutation, state];
};

export { REMOVE_PORTFOLIO_CONTENT_MUTATION, useRemovePortfolioContentMutation };
