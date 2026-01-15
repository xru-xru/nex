import React from 'react';

import clsx from 'clsx';

import { AvatarBase, Circle } from './styles';

type Props = {
  alt: string;
  children?: any;
  className?: string;
  component?: any;
  imgProps?: Record<string, any>;
  sizes?: string;
  size?: number;
  src?: string;
  srcSet?: string;
  variant?: 'circle' | 'square';
};
export const classes = {
  root: 'NEXYAvatar',
  img: 'NEXYAvatarImg',
  circle: 'circle',
  square: 'square',
};
const themedComponent = {
  square: AvatarBase,
  circle: Circle,
};
const Avatar = React.forwardRef<Props, any>(function Avatar(props, ref) {
  const {
    alt,
    children: childrenProp,
    className,
    component: componentProp,
    imgProps,
    sizes,
    src,
    srcSet,
    variant = 'circle',
    size = 40,
    ...rest
  } = props;
  let children = null;
  const img = src || srcSet;

  if (img) {
    children = <img alt={alt} src={src} srcSet={srcSet} sizes={sizes} className={classes.img} {...imgProps} />;
  } else {
    children = childrenProp;
  }

  let Component = themedComponent[variant] || AvatarBase;

  if (componentProp) {
    Component = componentProp;
  }

  return (
    <Component
      ref={ref}
      size={size}
      className={clsx(className, classes.root, {
        [classes.circle]: variant === 'circle',
        [classes.square]: variant === 'square',
      })}
      {...rest}
    >
      {children}
    </Component>
  );
});
export default Avatar;
