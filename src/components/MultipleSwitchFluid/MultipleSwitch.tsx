import React, { forwardRef } from 'react';

import * as Styles from './styles';
import { TooltipV2 } from '../Tooltip/TooltipV2';
import { cn } from '../../lib/utils';

export const classes = {
  root: 'NEXYMultipleSwitch',
  section: 'NEXYMultipleSwitchSection',
};

interface Props {
  disabled?: boolean;
  switchNotAllowed?: boolean;
  onToggle?: (e: string) => void;
  sections: { id: string; text: string }[];
  style?: Record<string, unknown>;
  withTooltip?: boolean;
  current?: string;
  switchClassname?: string;
  sectionClassname?: string;
}

const MultipleSwitch = forwardRef<Props, any>(function Switch(props, ref) {
  const {
    switchNotAllowed,
    onToggle,
    sections,
    current,
    initial,
    withTooltip = false,
    switchClassname,
    sectionClassname,
    ...rest
  } = props;

  const toggle = React.useCallback(
    (id: string) => {
      onToggle && onToggle(id);
    },
    [onToggle],
  );

  return (
    <Styles.Wrapper className={cn(classes.root, switchClassname)} notAllowed={switchNotAllowed} {...rest} ref={ref}>
      {sections.map(({ id, text }) => (
        <Styles.Section
          className={cn(classes.section, sectionClassname)}
          key={id}
          active={current ? current === id : initial}
          onClick={() => toggle(id)}
        >
          <span className={withTooltip ? 'max-w-64 truncate overflow-ellipsis' : ''}>
            {withTooltip ? (
              <TooltipV2 content={text} variant="dark">
                <div>{text}</div>
              </TooltipV2>
            ) : (
              text
            )}
          </span>
        </Styles.Section>
      ))}
    </Styles.Wrapper>
  );
});

export default MultipleSwitch;
