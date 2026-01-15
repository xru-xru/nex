import { useMediaQuery } from 'react-responsive';

import { sizes } from '../../theme/device';

type Props = {
  children: any;
};

function LaptopL({ children }: Props) {
  const isLaptopL = useMediaQuery({
    minWidth: sizes.laptopL,
    maxWidth: sizes.desktop,
  });
  return isLaptopL ? children : null;
}

export default LaptopL;
