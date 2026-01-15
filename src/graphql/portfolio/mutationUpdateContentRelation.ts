import { gql, useMutation } from '@apollo/client';

import { NexoyaPortfolioContentRelationInput } from '../../types/types';

import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { useContentFilterStore } from '../../store/content-filter';

const ADD_MANY_CONTENT_RELATIONS = gql`
  mutation addManyContentRelations(
    $teamId: Int!
    $portfolioId: Int!
    $contentRelations: [PortfolioContentRelationInput!]!
  ) {
    addManyContentRelations(teamId: $teamId, portfolioId: $portfolioId, contentRelations: $contentRelations)
  }
`;

type AddRelationsArgs = {
  portfolioId: number;
  contentRelations: NexoyaPortfolioContentRelationInput[];
};
export function useAddManyContentRelationsMutation({ portfolioId, contentRelations }: AddRelationsArgs) {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();
  return useMutation(ADD_MANY_CONTENT_RELATIONS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
      contentRelations,
    },
    refetchQueries: [
      {
        query: PORTFOLIO_PARENT_CONTENTS_QUERY,
        variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
      },
    ],
  });
}

const REMOVE_CONTENT_RELATION = gql`
  mutation RemoveContentRelation($teamId: Int!, $portfolioId: Int!, $contentId: Float!) {
    removeContentRelation(teamId: $teamId, portfolioId: $portfolioId, contentId: $contentId)
  }
`;

type RemoveRelationArgs = {
  portfolioId: number;
  contentId: number;
};
export function useRemoveContentRelationMutation({ portfolioId, contentId }: RemoveRelationArgs) {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();

  return useMutation(REMOVE_CONTENT_RELATION, {
    notifyOnNetworkStatusChange: true,
    awaitRefetchQueries: true,
    variables: {
      teamId,
      portfolioId,
      contentId,
    },
    refetchQueries: [
      {
        query: PORTFOLIO_PARENT_CONTENTS_QUERY,
        variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
      },
    ],
  });
}
