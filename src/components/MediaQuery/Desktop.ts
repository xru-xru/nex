import { useMediaQuery } from 'react-responsive';

import { sizes } from '../../theme/device';

type Props = {
  children: any;
};

function Desktop({ children }: Props) {
  const isDesktop = useMediaQuery({
    minWidth: sizes.desktop,
  });
  return isDesktop ? children : null;
}

export default Desktop;
