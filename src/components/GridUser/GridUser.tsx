import clsx from 'clsx';
import styled from 'styled-components';

import { NexoyaUser } from '../../types/types';

import { userInitials, userName } from '../../utils/user';

import AvatarUser from '../AvatarUser';
import Text from '../Text';

type Props = {
  user?: NexoyaUser;
  className?: string;
  size?: number;
};
export const classes = {
  root: 'NEXYGridUser',
};
const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;

  .NEXYAvatar {
    margin-right: 8px;
  }
`;

function GridUser({ user, size = 32, className, ...rest }: Props) {
  return user ? (
    <WrapStyled className={clsx(className, classes.root)} {...rest}>
      <AvatarUser size={size} email={user.email} fallback={userInitials(user)} />
      <Text>{userName(user)}</Text>
    </WrapStyled>
  ) : (
    <span>- -</span>
  );
}

export default GridUser;
