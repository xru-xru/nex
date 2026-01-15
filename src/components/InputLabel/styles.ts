import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

export const LabelStandard = styled.label`
  display: block;
  margin-bottom: 16px;
  font-size: 18px;
  color: ${colorByKey('darkGrey')};

  &.focused {
    color: ${colorByKey('darkGrey')};
  }

  &.disabled {
    pointer-events: none;
  }
`;
export const LabelLight = styled(LabelStandard)`
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: ${colorByKey('blueyGrey')};
`;
