import { useMediaQuery } from 'react-responsive';
import { sizes } from '../theme/device';

export const getDevice = () => {
  const isDesktop = useMediaQuery({
    minWidth: sizes.desktop,
  });

  const isTablet = useMediaQuery({
    minWidth: sizes.tablet,
    maxWidth: sizes.laptop,
  });

  const isLaptopL = useMediaQuery({
    minWidth: sizes.laptopL,
    maxWidth: sizes.desktop,
  });

  const isLaptop = useMediaQuery({
    minWidth: sizes.laptop,
    maxWidth: sizes.laptopL,
  });

  const isDesktopL = useMediaQuery({
    minWidth: sizes.desktopL,
  });

  return {
    isDesktop,
    isTablet,
    isLaptopL,
    isLaptop,
    isDesktopL,
  };
};
