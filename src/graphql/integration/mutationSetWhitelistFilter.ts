import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const SET_WHITELIST_FILTER_MUTATION = gql`
  mutation SetWhitelistFilter(
    $team_id: Int!
    $provider_id: Int!
    $filterName: String!
    $addList: [String!]
    $removeList: [String!]
    $lastFilter: Boolean
  ) {
    setWhitelistFilter(
      team_id: $team_id
      provider_id: $provider_id
      filterName: $filterName
      addList: $addList
      removeList: $removeList
      lastFilter: $lastFilter
    )
  }
`;
type Options = {
  providerId: number;
  filterName: string;
  addList: string[];
  removeList: string[];
  lastFilter?: boolean;
};
type ExtendMutOptions = {
  filterName: string;
  addList: string[];
  removeList: string[];
  lastFilter?: boolean;
};

function useSetWhitelistFilterMutation({
  providerId,
  filterName,
  addList,
  removeList,
  lastFilter = false,
}: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(SET_WHITELIST_FILTER_MUTATION, {
    variables: {
      team_id: teamId,
      provider_id: providerId,
      filterName: filterName,
      addList,
      removeList,
      lastFilter,
    },
  });

  function extendMutation({ lastFilter, addList, removeList, filterName }: ExtendMutOptions) {
    return mutation({
      variables: {
        team_id: teamId,
        provider_id: providerId,
        addList,
        removeList,
        filterName,
        lastFilter,
      },
    });
  }

  return [mutation, state, extendMutation];
}

export { SET_WHITELIST_FILTER_MUTATION, useSetWhitelistFilterMutation };
