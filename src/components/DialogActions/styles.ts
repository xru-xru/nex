import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

export const BaseStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 32px;
  align-items: center;
`;
export const Primary = styled(BaseStyled)`
  // background: ${colorByKey('ghostWhite')};
`;
export const Secondary = styled(BaseStyled)`
  background: white;
  justify-content: space-evenly;
  padding: 0px 20px 64px 20px;
`;
