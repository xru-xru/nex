import { ReactNode } from 'react';
import React, { PureComponent } from 'react';

import styled from 'styled-components';

import theme from '../../../theme/theme';

interface WrapStyledSectionHeaderProps {
  margin?: string;
}
const WrapStyled = styled.div<WrapStyledSectionHeaderProps>`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  margin: ${({ margin }) => margin || '0 0 15px 0'};
`;
const ItemLeftStyled = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
const ItemMiddleStyled = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: ${theme.layers.tooltip};
`;
const ItemRightStyled = styled.div`
  flex: 1;
  text-align: right;
  align-items: center;
  display: flex;
  justify-content: flex-end;
`;
type Props = {
  children: ReactNode;
  margin?: string;
};
type ItemProps = {
  children: ReactNode;
};

class SectionHeader extends PureComponent<Props> {
  static Left = ({ children }: ItemProps) => <ItemLeftStyled>{children}</ItemLeftStyled>;
  static Middle = ({ children }: ItemProps) => <ItemMiddleStyled>{children}</ItemMiddleStyled>;
  static Right = ({ children }: ItemProps) => <ItemRightStyled>{children}</ItemRightStyled>;

  render() {
    const { children, margin } = this.props;
    return <WrapStyled margin={margin}>{children}</WrapStyled>;
  }
}

export default SectionHeader;
