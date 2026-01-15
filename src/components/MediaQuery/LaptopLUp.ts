import { useMediaQuery } from 'react-responsive';

import { sizes } from '../../theme/device';
import { useSidebar } from '../../context/SidebarProvider';

type Props = {
  children: any;
};

function LaptopLUp({ children }: Props) {
  const { isCollapsed } = useSidebar();
  const isLaptopLUp = useMediaQuery({
    minWidth: sizes.laptopL,
  });
  return isCollapsed ? null : isLaptopLUp ? children : null;
}

export default LaptopLUp;
