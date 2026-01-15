import styled from 'styled-components';

import ButtonBase from '../ButtonBase';

const BaseTextStyled = styled(ButtonBase)`
  font-weight: 500;
  letter-spacing: 0.8px;
`;
const BaseContainedStyled = styled(ButtonBase)`
  padding: 12px 24px;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1;
`;
export const ContainedNormal = styled(BaseContainedStyled)``;
export const ContainedSmall = styled(BaseContainedStyled)`
  padding: 8px 20px;
  letter-spacing: 0.6px;
`;
export const TextNormal = styled(BaseTextStyled)``;
export const TextSmall = styled(BaseTextStyled)``;
