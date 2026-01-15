import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import ButtonBase from '../ButtonBase';

export const ButtonLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const ExpandButtonStyled = styled(ButtonBase)`
  margin-left: 8px;
  padding: 8px;

  color: ${colorByKey('cloudyBlue')};

  &:hover {
    color: ${colorByKey('battleshipGrey')};
  }
`;
