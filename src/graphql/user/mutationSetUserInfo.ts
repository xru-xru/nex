import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

const SET_USER_INFO_MUTATION = gql`
  mutation SetUserInfo($userInfo: UserInfo!) {
    setUserInfo(userInfo: $userInfo)
  }
`;
type Options = {
  firstname: string;
  lastname: string;
};

function useSetUserInfoMutation({ firstname, lastname }: Options): any {
  const [mutation, state] = useMutation(SET_USER_INFO_MUTATION, {
    variables: {
      userInfo: {
        firstname,
        lastname,
      },
    },
  });
  return [mutation, state];
}

export { SET_USER_INFO_MUTATION, useSetUserInfoMutation };
