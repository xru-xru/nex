import styled from 'styled-components';

import theme from '../../theme/theme';
import { colorByKey } from '../../theme/utils';

const WrapStyled = styled.div`
  display: flex;

  .NEXYAvatar {
    margin-left: -14px;
    border-width: 2px;
    border-style: solid;
    border-color: ${colorByKey('white')};
    z-index: ${theme.layers.body};

    &:first-child {
      margin-left: -2px; /* want to start on edge but we have 2px border */
    }
  }
`;

function AvatarRow({ children, ...rest }) {
  return <WrapStyled {...rest}>{children}</WrapStyled>;
}

export default AvatarRow;
