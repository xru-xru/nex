import styled from 'styled-components';

import Button from '../../../../components/Button';
import DialogActions from '../../../../components/DialogActions';
import DialogContent from '../../../../components/DialogContent';
import MenuItem from '../../../../components/MenuItem';
import { SymbolStyled } from '../../../../components/NumberValue/NumberValue';
import Typography from '../../../../components/Typography';

import { colorByKey } from '../../../../theme/utils';
import { NumberValueStyled } from '../../../content/styles/ContentPageTableRow';

import { nexyColors } from '../../../../theme';
import { DEFAULT_FUNNEL_WIDTH } from './utils/funnel';

export const FunnelChannelStyled = styled.div`
  height: 100%;
  transition: all 0.3s ease;
`;

interface FunnelStepStyledProps {
  width: number;
  roundedBasedOnPosition?: boolean;
  disabled?: boolean;
}

export const FunnelStepStyled = styled.div<FunnelStepStyledProps>`
  width: ${({ width }) => width}px;
  height: 110px;
  display: flex;
  transform: ${({ width }) => `perspective(${width / 10}em) rotateX(-30deg)`};
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  ${({ roundedBasedOnPosition }) =>
    roundedBasedOnPosition &&
    `
      &:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      &:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    `}
`;

// Set default props
FunnelStepStyled.defaultProps = {
  roundedBasedOnPosition: true,
};

export const FunnelStepsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
`;

export const LabelsContainerStyled = styled.div`
  transition: all 0.3s ease;
`;

export const PotentialStyled = styled.span<{
  type: 'positive' | 'negative' | 'default';
}>`
  font-weight: 500;
  margin-left: 5px;
  color: ${({ type }) =>
    colorByKey(type === 'positive' ? 'greenTeal' : type === 'negative' ? 'orangeyRed' : 'default')};
`;

export const PotentialWrapStyled = styled.span`
  ${NumberValueStyled} ${SymbolStyled} {
    margin-left: 0;
  }
`;

export const FunnelStepTitleContainerStyled = styled.div`
  display: flex;
  margin-bottom: 12px;
  align-items: center;
`;

export const ConversionPercentageStyled = styled.div`
  font-size: 12px;
  color: #6f7185;
  position: absolute;
  top: 0;
`;

export const LabelTitleStyled = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 0.45px;
  margin-bottom: 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 275px;
`;

export const ValueTitleStyled = styled.div`
  font-size: 24px;
  font-weight: 400;
`;

export const NumbersWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FunnelStepLabelButtonStyled = styled(Button)<{ minWidth?: number; disabled?: boolean }>`
  justify-content: flex-start;
  align-items: flex-start;
  min-width: ${({ minWidth }) => (minWidth ? minWidth : DEFAULT_FUNNEL_WIDTH)}px;
  height: 98px;
  border-radius: 5px;
  position: relative;

  display: flex;
  flex-direction: column;
  pointer-events: all;
  padding: 12px;

  .NEXYButtonLabel {
    width: 100%;
  }

  &:hover {
    background: ${({ disabled }) => (disabled ? 'none' : nexyColors.seasalt)};
  }

  &.active {
    background: ${nexyColors.seasalt};
    .NEXYButtonLabel {
      color: #2a2b2e;
      opacity: 1;
    }
    ${PotentialStyled}, ${NumberValueStyled} {
      opacity: 1;
    }
  }

  ${PotentialStyled}, ${NumberValueStyled}, .NEXYButtonLabel {
    opacity: 0.5;
  }

  span {
    text-align: left;
  }
`;

export const FunnelContainerStyled = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  flex-direction: row;
  gap: 32px;
  margin-top: 12px;
  transition: all 0.3s ease;
`;

export const LabelsStyled = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 6px;
`;

export const SwitchContainerStyled = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  width: 100%;

  .NEXYButtonLabel {
    width: 100%;
  }
`;

export const MenuItemStyled = styled(MenuItem)`
  .NEXYButtonLabel {
    width: 100%;
  }
`;

export const AddSpendContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 12px;
  align-items: center;
  justify-content: flex-start;
`;

export const AdSpendSegmentStyled = styled.div<FunnelStepStyledProps>`
  width: ${({ width }) => width}px;
  display: flex;
  margin-bottom: 8px;
  box-shadow: rgba(0, 0, 0, 0.25) 0 20px 20px 0;
  border-radius: 5px;

  ${FunnelChannelStyled}:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  ${FunnelChannelStyled}:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

export const AdLabelContainerStyled = styled.div<{ minWidth: number }>`
  min-width: ${({ minWidth }) => minWidth}px;
  padding: 12px;
  border-radius: 5px;

  cursor: pointer;

  &:hover {
    background: ${nexyColors.seasalt};
  }

  &.active {
    background: ${nexyColors.seasalt};

    ${LabelTitleStyled}, ${ValueTitleStyled},     ${PotentialStyled}, ${NumberValueStyled} {
      color: #2a2b2e;
      opacity: 1;
    }
  }

  ${PotentialStyled}, ${NumberValueStyled}, ${LabelTitleStyled}, ${ValueTitleStyled} {
    opacity: 0.5;
    color: #b7bac7;
  }
`;

export const TooltipContentFunnelTitle = styled.p`
  margin-top: 4px;
`;

export const TooltipContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

export const AvatarContainer = styled.div`
  img {
    position: relative;
    display: inline-block;
    border: 3px solid #fff;
    border-radius: 50%;
    overflow: hidden;
    width: 100%;
    background: white;
  }
  &:not(:first-child) {
    transition: margin 0.15s ease-out;
    margin-left: -5px;
  }
`;

export const AvatarWrapperStyled = styled.div`
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
  transition: margin 0.1s linear;

  &:hover {
    ${AvatarContainer} {
      &:not(:first-child) {
        margin-left: 0;
        transition: margin 0.1s linear;
      }
    }
  }
`;

export const StepWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

export const StyledStep = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: ${nexyColors.lilac};
  font-size: 14px;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
`;

export const StepDescription = styled.div`
  color: #9fa2ad;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px; /* 137.5% */
  letter-spacing: 0.6px;
`;

export const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 32px;
  text-align: left;
`;

export const StyledDialogActions = styled(DialogActions)`
  justify-content: center;
`;

export const DetailsDialogTitle = styled(Typography)`
  color: ${nexyColors.darkGrey};
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.1px;
  text-align: left;
`;

export const DynamicText = styled.span`
  color: ${nexyColors.azure};
`;

export const TotalPredictionWrapper = styled.div<{ active: boolean; disabled: boolean }>`
  border-radius: 5px;

  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  border: ${(props) => (props.disabled ? 'none' : '1px solid rgba(227, 228, 232, 0.67)')};
  box-shadow: ${(props) => (props.disabled ? 'none' : '0 2px 3px -1px rgba(42, 43, 46, 0.1)')};
  padding: ${(props) => (props.disabled ? '12px' : '24px')};

  background: ${nexyColors.white};
  margin-right: -14px;
  transition:
    background-color,
    padding 0.2s linear;

  background: ${(props) => (props.active ? nexyColors.seasalt : nexyColors.white)};
  ${(props) =>
    !props.disabled &&
    `
    &:hover {
      background: ${nexyColors.seasalt};
    }
  `}
`;

export const PredictionTitle = styled.div`
  color: #2a2a32;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 19.6px */
  letter-spacing: 0.28px;
  margin-bottom: 16px;
`;

export const PredictionScorePercentage = styled.div`
  color: ${colorByKey('greenTeal')};
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 125%; /* 40px */
  letter-spacing: -0.64px;
`;

export const TotalPredictionSubtitle = styled.div`
  color: #8a8c9e;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 13.5px */
  letter-spacing: 0.27px;
  max-width: 230px;
`;

export const ShowDetailsButton = styled(Button)`
  color: ${colorByKey('lilac')};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 18px */
  letter-spacing: 0.36px;
  text-decoration-line: underline;
`;

export const ScoreDescriptionContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: flex-end;
  justify-content: space-between;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  border: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
`;

export const EmptyChartMessage = styled.div`
  width: 100%;
  height: 700px;
  margin: 24px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: ${nexyColors.seasalt};
  color: ${nexyColors.coolGray};
  font-weight: 400;
  font-size: 16px;
`;
