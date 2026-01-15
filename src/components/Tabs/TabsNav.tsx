import React from 'react';
import styled, { css } from 'styled-components';
import ButtonBase from '../ButtonBase';
import { useTabs } from './useTabs';
import { cn } from '../../lib/utils';

interface Props {
  children: React.ReactNode;
  tab: string;
  component?: any;
  disabled?: boolean;
  size?: 'small' | 'base' | 'medium' | 'large';
  onClick?: (ev: React.SyntheticEvent<HTMLElement>) => void;
  hasNewUpdates?: boolean;
}

const TabNavStyled = styled(ButtonBase)<{ size?: 'small' | 'base' | 'medium' | 'large' }>`
  ${({ size }) => {
    if (size === 'small') {
      return css`
        padding: 8px 12px;
        font-size: 12px;
      `;
    } else if (size === 'medium') {
      return css`
        padding: 16px 20px;
        font-size: 16px;
      `;
    } else if (size === 'base') {
      return css`
        padding: 16px 16px 12px 16px;
        font-size: 14px;
      `;
    } else if (size === 'large') {
      return css`
        padding: 10px 20px;
        margin-right: 15px;
        font-size: 18px;
      `;
    }
  }}
`;

const TabsNav = ({
  children,
  tab,
  component,
  onClick,
  disabled,
  size = 'base',
  hasNewUpdates = false,
  ...rest
}: Props) => {
  const { tab: activeTab, setTab } = useTabs();

  function handleClick(ev: React.SyntheticEvent<HTMLElement>) {
    setTab(tab);
    if (onClick) {
      onClick(ev);
    }
  }

  return (
    <TabNavStyled
      data-cy={`${tab}Tab`}
      as={component}
      isActive={activeTab === tab}
      onClick={handleClick}
      disabled={disabled}
      size={size}
      {...rest}
    >
      {children}
      {/* Red dot indicator for new updates */}
      {hasNewUpdates && (
        <span
          className={cn(
            `absolute rounded-full bg-red-400`,
            size === 'small' ? 'top-[6px] h-1.5 w-1.5' : 'top-[9px] h-2 w-2',
          )}
        />
      )}
    </TabNavStyled>
  );
};

export default TabsNav;
