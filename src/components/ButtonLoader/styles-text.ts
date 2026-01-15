import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import '../../theme';

// #0ec76a
export const PrimaryText = styled.span`
  i {
    background: ${colorByKey('greenTeal')};
  }
`;
// #ffffff
export const SecondaryText = styled.span`
  i {
    background: ${colorByKey('blueyGrey')};
  }
`;
export const TertiaryText = styled.span`
  i {
    background: ${colorByKey('cloudyBlue')};
  }
`;
export const DarkText = styled.span`
  i {
    background: ${colorByKey('cloudyBlue')};
  }
`;
