import styled from 'styled-components';

import ButtonBase from '../ButtonBase';

export const ButtonSortStyled = styled(ButtonBase)<{
  readonly asc: boolean;
  readonly desc: boolean;
}>`
  padding: 4px;
  justify-self: center;

  svg {
    color: ${({ asc, desc }) => (asc ? '#744CED' : desc ? '#744CED' : 'rgba(166, 167, 181, 1)')};
    transform: ${({ asc, desc }) => (asc ? 'rotate(0)' : desc ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;
