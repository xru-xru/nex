import styled from 'styled-components';

import { mainColors } from '../../../theme/theme';

import { nexyColors } from '../../../theme';

export const EmptyChart = styled.div`
  width: 100%;
  height: 275px;
  background: ${nexyColors.seasalt};
  border: 1px solid ${mainColors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-bottom: 21px;
`;
