import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import '../../theme';
import List from '../List';

const ListStyled = styled(List)`
  padding: 12px;
`;
export const LightMenu = styled(ListStyled)`
  background: ${colorByKey('white')};
`;
export const DarkMenu = styled(ListStyled)`
  background: ${colorByKey('darkGrey')};
`;
