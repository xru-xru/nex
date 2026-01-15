import { ReactNode } from 'react';

import clsx from 'clsx';
import styled, { css } from 'styled-components';

import '../../../theme/theme';

import Spinner from '../../Spinner';
import { classes } from './classes';

type Props = {
  children: ReactNode;
  minHeight?: string;
  padding?: string;
  margin?: string;
  showLoader?: boolean;
  className?: string;
  tabIndex?: string;
  onClick?: any;
  style?: Record<string, any>;
};

interface CardWrapStyledCardProps {
  padding?: string;
  minHeight?: string;
  margin?: string;
  isLoading?: boolean;
}

const CardWrapStyled = styled.div<CardWrapStyledCardProps>`
  min-height: ${({ minHeight }) => (minHeight ? minHeight : 'auto')};
  margin: ${({ margin }) => (margin ? margin : '0 0 25px 0')};

  ${({ isLoading }) =>
    isLoading &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;

const Card = ({ children, className, minHeight, showLoader, ...rest }: Props) => (
  // @ts-ignore
  <CardWrapStyled className={clsx(className, classes.root)} minHeight={minHeight} isLoading={showLoader} {...rest}>
    {showLoader ? <Spinner /> : children}
  </CardWrapStyled>
);

export default Card;
