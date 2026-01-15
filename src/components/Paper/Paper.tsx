import React from 'react';

import clsx from 'clsx';
import warning from 'warning';

import { DarkPaper, LightPaper } from './styles';

type Props = {
  className?: string;
  component?: any;
  children: React.ReactNode;
  elevation?: number;
  color?: 'light' | 'dark';
};
export const classes = {
  root: 'NEXYPaper',
  elevation: 'elevation',
};
const themedComponent = {
  light: LightPaper,
  dark: DarkPaper,
};
const Paper = React.forwardRef<Props, any>((props, ref) => {
  const { className, component: ComponentProp, elevation = 1, color = 'light', ...rest } = props;
  const ThemedComponent = themedComponent[color] || LightPaper;
  warning(elevation >= 0 && elevation < 3, `Nexoya: this elevation ${elevation} is not implemented`);
  return (
    <ThemedComponent
      as={ComponentProp}
      ref={ref}
      className={clsx(className, classes.root, `${classes.elevation}-${elevation}`)}
      elevation={elevation}
      {...rest}
    />
  );
});
export default Paper;
