import { gql, useMutation } from '@apollo/client';

import { $Values } from 'utility-types';

import { useTeam } from '../../context/TeamProvider';

import { userState } from '../../constants/userState';

import { USER_QUERY } from './queryUser';

const SET_USER_STATE_MUTATION = gql`
  mutation SetUserState($state: UserStateEnum!) {
    setUserState(state: $state)
  }
`;
type Options = {
  userState: $Values<typeof userState>;
};

function useSetUserStateMutation({ userState }: Options) {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(SET_USER_STATE_MUTATION, {
    variables: {
      state: userState,
    },
    refetchQueries: () => [
      {
        query: USER_QUERY,
        variables: {
          withTeams: false,
          withOrg: false,
          team_id: teamId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });
  return [mutation, state];
}

export { SET_USER_STATE_MUTATION, useSetUserStateMutation };
