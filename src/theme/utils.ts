import { $Values } from 'utility-types';

import theme, { nexyColors as nexyColorMap } from './index';

type PropsWithTheme = {
  theme: {
    nexy: Record<string, string>;
  };
};
export function nexyColors(props: PropsWithTheme, key: $Values<typeof nexyColorMap>, fallback = ''): string {
  // console.log(props.theme, key)
  return props.theme.nexy[key] || fallback || '#000000';
}
export function colorByKey(key: $Values<typeof nexyColorMap>, fallback?: string) {
  return function (props: PropsWithTheme): string {
    return nexyColors(props, key, fallback);
  };
}
export function fontByKey(key: string, fallback = '') {
  return function (props: PropsWithTheme): string {
    return props.theme.nexy[key] || fallback;
  };
}
export function getSidebarWidth(props: { isBelowLaptopL: boolean; isCollapsed: boolean }): string {
  const { isBelowLaptopL, isCollapsed } = props;

  if (import.meta.env.MODE !== 'production') {
    if (isBelowLaptopL === undefined) {
      // eslint-disable-next-line no-console
      console.error('getSidebarWidth: You did not provide "isTablet" to the styled component');
    }
  }

  return isBelowLaptopL || isCollapsed ? theme.nexy.sidebarTablet : theme.nexy.sidebarLaptop;
}
export function getBodyHorizontalPadding(
  props: {
    isBelowLaptopL: boolean;
    isLaptopL: boolean;
    isAboveLaptopL: boolean;
  } & PropsWithTheme,
): string {
  const { isBelowLaptopL, isLaptopL, isAboveLaptopL, theme } = props;

  if (import.meta.env.MODE !== 'production') {
    if (isBelowLaptopL === undefined || isLaptopL === undefined || isAboveLaptopL === undefined) {
      // eslint-disable-next-line no-console
      console.error(
        'getSidebarWidth: You did not provide "isTablet", "isDesktop" and "isDesktopXl" to the styled component',
      );
    }
  }

  return isBelowLaptopL
    ? theme.nexy.bodyHorizontalPaddingTablet
    : isLaptopL
      ? theme.nexy.bodyHorizontalPaddingLaptopL
      : isAboveLaptopL
        ? theme.nexy.bodyHorizontalPaddingDesktop
        : '0px';
}
