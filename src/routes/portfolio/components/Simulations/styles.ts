import styled from 'styled-components';

import GridRow from '../../../../components/GridRow';
import Typography from '../../../../components/Typography';

import { nexyColors } from '../../../../theme';

export const SuccessDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;
export const Separator = styled.div`
  box-shadow: 0px 1px 0px 0px rgba(42, 42, 50, 0.08);
  width: 100%;
  height: 1px;
`;
export const SuccessDialogActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  padding: 0 24px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const StyledTypography = styled(Typography)`
  color: ${nexyColors.raisinBlack};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 145%; /* 20.3px */
  letter-spacing: 0.28px;
`;

export const StyledTypographyConfirmation = styled(Typography)`
  color: #131313b2;

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 145%;

  padding: 20px 24px;
`;

export const ItemOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 12px;
  gap: 10px;
  background: ${nexyColors.seasalt};
  border: 1px solid #e3e4e8;
  border-radius: 5px;
  margin: 6px 24px;

  ${StyledTypography} {
    color: ${nexyColors.neutral900}
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 145%; /* 20.3px */
    letter-spacing: 0.28px;
  }
`;

export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ClickableGridRow = styled(GridRow)`
  &:hover {
    cursor: pointer;
    background: ${nexyColors.seasalt};
  }
  transition: background 0.2s;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 72px;
`;

export const MetricsContainer = styled.div`
  display: flex;
  gap: 24px;
`;
export const ChartContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-top: 24px;
  margin-bottom: 94px;
`;
