import React from 'react';

import clsx from 'clsx';

import { PopperPlacement } from '../../types';

import Tooltip from '../Tooltip';
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  Paragraph,
  Subheadline,
  Subtitle,
  SubtitlePill,
  TextBase,
  TitleCard,
  TitleGroup,
} from './styles';
import { TooltipV2 } from '../Tooltip/TooltipV2';

type HTMLTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'paragraph'
  | 'subtitle'
  | 'subheadline'
  | 'titleCard'
  | 'titleGroup'
  | 'subtitlePill';
export type Props = {
  children?: any;
  component?: HTMLTypes;
  variant?: TypographyVariant;
  withEllipsis?: boolean;
  withTooltip?: boolean;
  tooltipValue?: string | JSX.Element;
  tooltipStyle?: CSSStyleRule;
  tooltipContainerStyle?: CSSStyleRule;
  tooltipPlacement?: PopperPlacement;
  className?: string;
  capitalize?: boolean;
  // TODO: I don't think we should have this option in the component. We will use &:first-letter instead
  title?: string;
  id?: string; // Comment: this is for accessibility reasosn
};
export const classes = {
  root: 'NEXYTypography',
  h1: 'NEXYH1',
  h2: 'NEXYH2',
  h3: 'NEXYH3',
  h4: 'NEXYH4',
  h5: 'NEXYH5',
  paragraph: 'NEXYParagraph',
  subtitle: 'NEXYSubtitle',
  subheadline: 'NEXYSubheadline',
  titleCard: 'NEXYTitleCard',
  titleGroup: 'NEXYTitleGroup',
  subtitlePill: 'NEXYSubtitlePill',
};
const themedComponent = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  paragraph: Paragraph,
  subtitle: Subtitle,
  subheadline: Subheadline,
  titleCard: TitleCard,
  titleGroup: TitleGroup,
  subtitlePill: SubtitlePill,
};
const Typography = React.forwardRef<Props, any>(function Typography(props, ref) {
  const {
    capitalize = false,
    className,
    component,
    variant,
    withEllipsis = true,
    withTooltip = false,
    withTooltipV2 = false,
    tooltipValue = props.children,
    tooltipStyle,
    tooltipContainerStyle,
    tooltipPlacement = 'bottom-start',
    ...rest
  } = props;
  const ThemedComponent = themedComponent[variant] || TextBase;

  const tooltipThemedComponent = (
    <ThemedComponent
      as={component}
      capitalize={capitalize}
      withEllipsis={withEllipsis}
      ref={ref}
      className={clsx(className, classes.root, {
        [classes.h1]: variant === 'h1',
        [classes.h2]: variant === 'h2',
        [classes.h3]: variant === 'h3',
        [classes.h4]: variant === 'h4',
        [classes.h5]: variant === 'h5',
        [classes.paragraph]: variant === 'paragraph',
        [classes.subtitle]: variant === 'subtitle',
        [classes.subtitlePill]: variant === 'subtitlePill',
        [classes.titleCard]: variant === 'titleCard',
        [classes.titleGroup]: variant === 'titleGroup',
      })}
      {...rest}
    />
  );
  if (withTooltip) {
    return (
      <Tooltip
        content={tooltipValue}
        variant="dark"
        placement={tooltipPlacement}
        style={tooltipStyle}
        popperProps={{
          style: {
            zIndex: 3300,
            maxWidth: 500,
          },
        }}
      >
        <div
          style={{
            position: 'relative',
            minWidth: 0,
            ...tooltipContainerStyle,
          }}
        >
          {tooltipThemedComponent}
        </div>
      </Tooltip>
    );
  }
  if (withTooltipV2) {
    return (
      <TooltipV2 content={tooltipValue} variant="dark" placement={tooltipPlacement} style={tooltipStyle}>
        <div
          style={{
            position: 'relative',
            minWidth: 0,
            ...tooltipContainerStyle,
          }}
        >
          {tooltipThemedComponent}
        </div>
      </TooltipV2>
    );
  }

  return tooltipThemedComponent;
});
export default Typography;
