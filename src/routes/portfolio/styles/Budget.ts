import styled from 'styled-components';

import FormattedCurrency from 'components/FormattedCurrency';
import GridRow from 'components/GridRow';

import { colorByKey } from 'theme/utils';

export const WrapperStyled = styled.div`
  display: flex;
  overflow-y: hidden;
`;
export const StaticTableStyled = styled.div`
  min-width: 200px;
  max-width: 450px;
`;
export const GridHeaderStyled = styled.div`
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  text-transform: uppercase;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f0f2fa;

  & .NEXYTypography {
    padding: 0 32px 0 24px;
    text-align: right;
  }
`;
export const ChannelRowStyled = styled.div`
  display: flex
  align-items: center;
  padding-left: 24px;
`;
export const GridRowStyled = styled(GridRow)`
  padding: 0;
  text-align: right;
`;
export const GridRowTotalStyled = styled(GridRow)`
  background: #f0f2fa;
  border-bottom: none;
  padding: 0;
`;
export const GridRowTotalsStyled = styled(GridRowTotalStyled)<{
  readonly columnRepeat: number;
}>`
  grid-template-columns: ${({ columnRepeat }) => `repeat(${columnRepeat}, minmax(190px, 1fr))`};
`;
export const GridRowHeaderStyled = styled(GridRowTotalStyled)`
  padding-left: 24px;
  color: ${colorByKey('cloudyBlue')};
`;
export const GridRowUnderlined = styled.div<{
  readonly columnRepeat: number;
}>`
  height: 54px;
  display: grid;
  text-align: center;
  grid-template-columns: ${({ columnRepeat }) => `repeat(${columnRepeat}, minmax(190px, 1fr))`};
`;
export const ColorMark = styled.div<{
  readonly color?: string;
}>`
  display: inline-block;
  width: 8px;
  min-width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  opacity: 1;
  line-height: 1;
  background: ${({ color }) => color || 'transparent'};
`;
export const StyledWeeklyBudget = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f0f2fa;
  padding-right: 32px;
  position: relative;
  font-variant-numeric: tabular-nums;

  .NEXYFormattedCurrency {
    font-weight: 400;
  }

  .NEXYEditBudgetPanel {
    visibility: hidden;
    position: absolute;
    right: 0;
  }

  &:hover {
    .NEXYEditBudgetPanel {
      visibility: visible;
    }
  }

  .NEXYEditBudgetPanel.active {
    visibility: visible;
  }
`;
export const ValuesTableStyled = styled.div<{
  readonly ref: any;
}>`
  overflow-x: auto;
  position: relative;
  width: 100%;
`;
export const FormattedCurrencyStyled = styled(FormattedCurrency)<{
  readonly isColored?: boolean;
  readonly isBold?: boolean;
}>`
  color: ${({ isColored }) => (isColored ? colorByKey('blueGrey') : 'inherit')};
  font-weight: ${({ isBold }) => (isBold ? '600' : '500')};
`;
export const FormattedCurrencyColored = styled(FormattedCurrency)<{
  readonly isColored?: boolean;
  readonly isBold?: boolean;
}>`
  color: ${({ isColored }) => (isColored ? colorByKey('blueGrey') : 'inherit')};
  font-weight: ${({ isBold }) => (isBold ? '600' : '500')};
  padding-right: 32px; //to push the edit icon
  display: flex;
  background: #f0f2fa;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
`;
export const BudgetColumnStyled = styled.div`
  z-index: 1;

  &.BudgetColumnShadow {
    box-shadow: 5px 0 10px -5px #ccc;
  }

  .NEXYFormattedCurrency {
    padding-right: 24px;
  }

  .NEXYTypography {
    padding-right: 24px;
  }
`;
export const ValuesTableHeader = styled.div<{
  readonly columnRepeat: number;
}>`
  display: grid;
  grid-template-columns: ${({ columnRepeat }) => `repeat(${columnRepeat}, minmax(190px, 1fr))`};
`;

export const ActionsWrapper = styled.div``;
