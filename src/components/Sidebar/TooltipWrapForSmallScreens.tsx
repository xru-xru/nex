import { useMediaQuery } from 'react-responsive';

import { sizes } from '../../theme/device';

import Tooltip from '../Tooltip';

type Props = {
  children: any;
  [x: string]: any;
};

function TooltipWrapForSmallScreens({ children, ...rest }: Props) {
  // Comment: we need to remove 1px from maxWidth, otherwise, we have 1px of media query
  // not being applied to the layout.
  // The same is for the MainContent component.
  // TODO: Rework media query resizing values to not have this hack.
  const isBelowLaptopL = useMediaQuery({
    maxWidth: sizes.laptopL - 1,
  });

  if (isBelowLaptopL) {
    return <Tooltip {...rest}>{children}</Tooltip>;
  }

  return children;
}

export default TooltipWrapForSmallScreens;
