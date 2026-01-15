import { ComponentType } from 'react';
import React, { PureComponent } from 'react';

import clsx from 'clsx';
import { ellipsis } from 'polished';
import styled, { css } from 'styled-components';

type HTMLTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
export type Props = {
  children?: any;
  component?: HTMLTypes;
  variant?: 'title' | 'subtitle' | 'caption';
  iconBefore?: ComponentType<{}> | null;
  iconAfter?: ComponentType<{}> | null;
  iconVariant?: 'caption';
  iconSize?: 'small' | 'normal';
  withEllipsis?: boolean;
  className?: string;
  capitalize?: boolean;
  title?: string;
  display?: 'block' | 'flex' | 'inline-flex' | 'inline-block' | 'inline';
  id?: string;
  style?: Record<string, any>;
};
export const classes = {
  root: 'NEXYText',
};
const TextWrapStyled = styled.div<{
  readonly display?: string;
  readonly iconSize?: 'small' | 'normal';
  readonly iconVariant?: 'caption';
  readonly iconBefore: boolean;
  readonly iconAfter: boolean;
}>`
  display: ${({ display }) => display || 'inline-block'};
  align-items: center;

  svg {
    font-size: ${({ iconSize }) => {
      if (iconSize === 'small') return '12px';
      if (iconSize === 'normal') return '20px';
      return '20px';
    }};
    opacity: ${({ iconVariant }) => {
      if (iconVariant === 'caption') return '0.75';
      return '1';
    }}
    margin-left: ${({ iconAfter }) => (iconAfter ? '7px' : '0px')};
    margin-right: ${({ iconBefore }) => (iconBefore ? '7px' : '0px')};
  }
`;
const TextStyled = styled.span<{
  readonly withEllipsis?: boolean;
  readonly capitalize?: boolean;
  readonly variant: string;
  readonly display?: string;
}>`
  ${({ withEllipsis }) =>
    withEllipsis &&
    css`
      ${ellipsis()};
    `};
  opacity: ${({ variant }) => {
    if (variant === 'caption') return '0.5';
    return '1';
  }};
  /* Important display is after withElippsi. It puts inline block on it */
  display: ${({ display }) => display || 'inline-block'};

  ${({ capitalize }) =>
    capitalize &&
    css`
      &:first-letter {
        text-transform: uppercase;
      }
    `};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span,
  p {
    padding: 0 3px;
  }
`; // COMMENT: This is an experimental component to see how it holds up for the purpose of generalizing simple typography withs tyled components. This might need to be completely ditched or rework to work with best practicies.

class Text extends PureComponent<Props> {
  render() {
    const {
      capitalize = false,
      children,
      className,
      component,
      iconAfter,
      iconBefore,
      iconSize,
      iconVariant,
      id,
      title,
      variant = 'title',
      withEllipsis = true,
      display,
      ...rest
    } = this.props;
    const wrapProps = {
      className: clsx(className, classes.root),
      iconAfter: !!iconAfter,
      iconBefore: !!iconBefore,
      iconSize: iconSize || 'normal',
      iconVariant,
    };
    const textProps = {
      as: component,
      capitalize,
      children,
      className: clsx(className, classes.root),
      iconAfter: !!iconAfter,
      iconBefore: !!iconBefore,
      id,
      iconVariant,
      title,
      withEllipsis,
      variant,
    };

    // COMMENT: In case we want to show icons as well.
    if (iconBefore || iconAfter) {
      return (
        <TextWrapStyled {...wrapProps} display={display} {...rest}>
          {iconBefore ? React.createElement(iconBefore) : null}
          <TextStyled {...textProps} />
          {iconAfter ? React.createElement(iconAfter) : null}
        </TextWrapStyled>
      );
    }

    // COMMENT: Show only the text without any icons.
    return <TextStyled {...textProps} display={display} {...rest} />;
  }
}

export default Text;
