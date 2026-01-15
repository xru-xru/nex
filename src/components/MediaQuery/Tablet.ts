import { useMediaQuery } from 'react-responsive';

import { sizes } from '../../theme/device';

type Props = {
  children: any;
};

function Tablet({ children }: Props) {
  const isTablet = useMediaQuery({
    minWidth: sizes.tablet,
    maxWidth: sizes.laptop,
  });
  return isTablet ? children : null;
}

export default Tablet;
