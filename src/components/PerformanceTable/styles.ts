import styled, { css } from 'styled-components';

import FormattedCurrency from 'components/FormattedCurrency';
import NumberValue from '../NumberValue';

const CurrencyStyled = css`
  text-align: right;
  padding-right: 20px;
  font-variant-numeric: tabular-nums;
`;

export const ContentRowStyled = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 1520px) {
    max-width: 96px;
  }
`;
export const ProviderNameStyled = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;

  .NEXYText {
    font-size: 12px;
    color: #a6a7b5;
  }
`;

export const ChevronWrap = styled.div<{
  readonly expanded?: boolean;
}>`
  display: flex;
  cursor: pointer;
  justify-content: flex-end;
  color: #a6a7b5;
  & > svg {
    transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 250ms ease-in-out;
    transform-origin: center;
  }
`;

export const FormattedCurrencyStyled = styled(FormattedCurrency)<{ color?: string }>`
  color: ${(props) => props.color};
  ${CurrencyStyled}
`;

export const NumberValueStyled = styled(NumberValue)<{ color?: string }>`
  color: ${(props) => props.color};
  ${CurrencyStyled}
`;

export const IconContent = styled.div`
  padding-left: 20px;
`;

export const FilterBullet = styled.div<{
  readonly backgroundColor?: string;
}>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ backgroundColor }) => backgroundColor};
  margin-right: 8px;
`;
