import React, { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

import clsx from 'clsx';
import styled from 'styled-components';

import usePresenterMode from '../../hooks/usePresenterMode';

import { sizes } from '../../theme/device';
import theme from '../../theme/theme';
import { getBodyHorizontalPadding } from '../../theme/utils';

import '../../theme';
import { classes } from './classes';
import { useSidebar } from '../../context/SidebarProvider';

type Props = {
  children: ReactNode;
  padding?: string;
  className?: string;
  size?: 'small' | 'large';
};
export interface ContentWrapStyledMainContentProps {
  isBelowLaptopL: boolean;
  isLaptopL: boolean;
  isAboveLaptopL: boolean;
  isPresenterMode: boolean;
  sidebarWidth: string;
  size?: 'small' | 'large';
}
const ContentWrapStyled = styled.main<ContentWrapStyledMainContentProps>`
  margin-left: ${(props) => (props.isPresenterMode ? '0' : props.sidebarWidth)};
  padding-left: ${getBodyHorizontalPadding};
  padding-right: ${getBodyHorizontalPadding};

  padding: ${(props) => (props.size === 'small' ? '32px 31px' : '32px 48px 60px')};
  min-height: 100vh;
  position: relative;
  z-index: ${theme.layers.base};
  background: #ffffff;
  transition: margin-left 0.25s ease-in-out;

  @media print {
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0;
  }
`;
const InnerContentStyled = styled.div`
  /* margin: 0 auto 50px auto; */
  position: relative;

  @media print {
    margin: 0;
    max-width: 100%;
  }
`;

const MainContent = ({ children, padding, className, size = 'large', ...other }: Props) => {
  // Comment: we need to remove 1px from maxWidth, otherwise, we have 1px of media query
  // not being applied to the layout.
  // The same is for the Sidebar component
  // TODO: Rework media query resizing values to not have this hack.
  const isBelowLaptopL = useMediaQuery({
    maxWidth: sizes.laptopL - 1,
  });
  const isLaptopL = useMediaQuery({
    minWidth: sizes.laptopL,
    maxWidth: sizes.desktop,
  });
  const isAboveLaptopL = useMediaQuery({
    minWidth: sizes.desktop,
  });
  const { sidebarWidth } = useSidebar();
  const { isPresenterMode } = usePresenterMode();
  return (
    <ContentWrapStyled
      className={clsx(className, classes.root)}
      isBelowLaptopL={isBelowLaptopL}
      isLaptopL={!isBelowLaptopL && isLaptopL}
      isAboveLaptopL={isAboveLaptopL}
      isPresenterMode={isPresenterMode}
      sidebarWidth={sidebarWidth}
      size={size}
      {...other}
    >
      <InnerContentStyled>{children}</InnerContentStyled>
    </ContentWrapStyled>
  );
};

export default MainContent;
