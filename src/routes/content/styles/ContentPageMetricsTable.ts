import styled from 'styled-components';

import GridHeader from 'components/GridHeader';
import Text from 'components/Text';

export const WrapperStyled = styled.div`
  margin-bottom: 60px;
`;
export const HeaderStyled = styled(GridHeader)`
  display: grid;
  grid-template-columns: 90% 10%;
  overflow: scroll;
  padding-right: 24px;
`;
export const ValueStyled = styled(Text)`
  text-align: right;
`;
