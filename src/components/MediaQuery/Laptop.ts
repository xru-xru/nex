import { useMediaQuery } from 'react-responsive';

import { sizes } from '../../theme/device';

type Props = {
  children: any;
};

function Laptop({ children }: Props) {
  const isLaptop = useMediaQuery({
    minWidth: sizes.laptop,
    maxWidth: sizes.laptopL,
  });
  return isLaptop ? children : null;
}

export default Laptop;
