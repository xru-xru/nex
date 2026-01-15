import styled from 'styled-components';

import { ThemeStyled } from '../../theme/theme';
import theme from '../../theme/theme';

import { ArrowIcon } from '../icons';

type Props = {
  onClick?: (ev: React.SyntheticEvent<any>) => void;
  to: 'prev' | 'next';
};
const InnerStyled = styled.div`
  width: 26px;
  height: 26px;
  background: white;
  border-radius: 26px;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 7px 17px 0 rgba(0, 0, 0, 0.05);
  transition: width 0.175s ease, box-shadow 0.175s ease;
`;
const WrapStyled = styled.button<{
  readonly theme: ThemeStyled;
  readonly to?: 'next' | 'prev';
}>`
  position: absolute;
  padding: 10px;
  z-index: ${theme.layers.body};
  cursor: pointer;
  background: transparent;
  border: none;
  font: inherit;
  color: inherit;
  display: block;
  color: ${({ theme }) => theme.colors.text.muted};
  right: ${({ to }) => (to === 'next' ? '-15px' : 'auto')};
  left: ${({ to }) => (to === 'prev' ? '-15px' : 'auto')};
  top: calc(100% / 2 - 22px - 12px);

  &:active {
    transform: translateY(1px);
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.primary};

    ${InnerStyled} {
      width: 35px;
      box-shadow: 0 4px 17px 0 rgba(0, 0, 0, 0.12);
    }
  }

  &:focus {
    outline: 0;
  }

  svg {
    height: 20px !important;
    width: 20px !important;
    transform: ${({ to }) => {
      if (to === 'prev') return 'rotate(270deg)';
      if (to === 'next') return 'rotate(90deg)';
      return '';
    }};
  }
`;

const SliderArrow = ({ onClick, to }: Props) => (
  <WrapStyled
    role="button"
    aria-label={to}
    onClick={(ev) => {
      onClick && onClick(ev);
      ev.currentTarget.blur();
    }}
    to={to}
  >
    <InnerStyled>
      <ArrowIcon />
    </InnerStyled>
  </WrapStyled>
);

export default SliderArrow;
