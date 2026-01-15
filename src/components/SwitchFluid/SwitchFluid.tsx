import React from 'react';

import { PortfolioTimeSpanSwitch } from 'types';

import * as Styles from './styles/SwitchFluid';

interface Props {
  disabled?: boolean;
  switchNotAllowed?: boolean;
  onToggle?: () => void;
  activeText: string;
  inactiveText: string;
  style?: Record<string, unknown>;
}
const SwitchFluid = React.forwardRef<Props, any>(function Switch(props, ref) {
  const { switchNotAllowed, onToggle, activeText, inactiveText, initial, ...rest } = props;
  const [active, setActive] = React.useState<PortfolioTimeSpanSwitch>(initial);
  const toggle = React.useCallback(
    (e: PortfolioTimeSpanSwitch) => {
      setActive(e);
      onToggle(e);
    },
    [onToggle]
  );
  return (
    <Styles.Wrapper notAllowed={switchNotAllowed} {...rest} ref={ref}>
      <Styles.Left onClick={() => toggle('left')}>
        <div className={active === 'left' ? 'content active' : 'content'} />
        <span>{activeText}</span>
      </Styles.Left>
      <Styles.Right onClick={() => toggle('right')}>
        <div className={active === 'right' ? 'content active' : 'content'} />
        <span>{inactiveText}</span>
      </Styles.Right>
    </Styles.Wrapper>
  );
});

export default SwitchFluid;
