import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

const elevationShadow = [
  'none',
  '0 7px 17px 0 rgba(0,0,0,0.05)',
  '0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)',
];
const PaperStyled = styled.div<{
  readonly overflowY?: string;
  readonly elevation?: number;
}>`
  display: flex;
  position: relative;
  overflow-y: ${({ overflowY = 'none' }) => overflowY};
  flex-direction: column;
  flex: 0 1 auto;
  box-shadow: ${({ elevation = 0 }) => elevationShadow[elevation]};
  border-radius: 4px;
`;
export const LightPaper = styled(PaperStyled)`
  background: ${colorByKey('white')};
`;
export const DarkPaper = styled(PaperStyled)`
  background: ${colorByKey('darkGrey')};
`;
