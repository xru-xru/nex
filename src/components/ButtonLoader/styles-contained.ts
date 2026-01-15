import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import '../../theme';

// #0ec76a
export const PrimaryContained = styled.span`
  i {
    background: ${colorByKey('white')};
  }
`;
// #ffffff
export const SecondaryContained = styled.span`
  i {
    background: ${colorByKey('blueyGrey')};
  }
`;
export const TertiaryContained = styled.span`
  i {
    background: ${colorByKey('cloudyBlue')};
  }
`;
export const DarkContained = styled.span`
  i {
    background: ${colorByKey('cloudyBlue')};
  }
`;
