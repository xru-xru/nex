import styled from 'styled-components';

import Checkbox from 'components/Checkbox';

import { colorByKey } from 'theme/utils';

export const WrapStyled = styled.div`
  display: flex;
  margin-top: 24px;
  flex-wrap: wrap;

  & > * {
    margin-right: 24px;
    margin-bottom: 24px;
  }
`;
export const LabelStyled = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  letter-spacing: 0.6px;
  line-height: 1;
  color: ${colorByKey('blueyGrey')};

  & > *:first-child {
    margin-right: 8px;
  }
`;

export const CheckboxStyled = styled(Checkbox)`
  color: ${colorByKey('blueGrey')};
`;
