import styled from 'styled-components';

import Button from 'components/Button';
import SvgChevronDown from 'components/icons/ChevronDown';

import { colorByKey } from 'theme/utils';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  height: 30px;
  align-items: center;
  color: ${colorByKey('blueGrey')};
`;
export const Dropdown = styled.div`
  position: absolute;
  left: 0;
`;
export const Arrows = styled.div`
  display: flex;
  align-items: center;
`;
export const SvgChevronDownStyled = styled(SvgChevronDown)<{
  right?: boolean;
  disabled?: boolean;
  onClick: (e: 'increment' | 'decrement') => void;
}>`
  margin-left: 12px;
  transform: ${({ right }) => (right ? 'rotate(270deg)' : 'rotate(90deg)')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled }) => (disabled ? '#D2D3D6' : 'inherit')};
`;
export const ButtonStyled = styled(Button)`
  padding: 6px;
  margin-left: 12px;
`;
