import React from 'react';

import clsx from 'clsx';

import { DarkMenu, LightMenu } from './styles';

type Props = {
  className?: string;
  color: 'light' | 'dark';
  children: any;
};
export const classes = {
  root: 'NEXYMenuList',
  dark: 'dark',
  light: 'light',
};
const themedComponent = {
  light: LightMenu,
  dark: DarkMenu,
};
const ArrayMenuList = React.forwardRef<Props, any>(function MenuList(props, ref) {
  const { className, children, color = 'light', ...rest } = props;
  const ThemedComponent = themedComponent[color] || LightMenu;
  return (
    <ThemedComponent
      role="menu"
      ref={ref}
      className={clsx(className, classes.root, {
        [classes.light]: color === 'light',
        [classes.dark]: color === 'dark',
      })}
      tabIndex={-1}
      {...rest}
    >
      {Array.isArray(children)
        ? children.map((ch) =>
            ch
              ? React.cloneElement(ch, {
                  color,
                })
              : ch
          )
        : children
        ? children
          ? React.cloneElement(children, {
              color,
            })
          : null
        : null}
    </ThemedComponent>
  );
});
export default ArrayMenuList;
