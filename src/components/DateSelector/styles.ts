import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import { nexyColors } from '../../theme';
import MenuList from '../ArrayMenuList/ArrayMenuList';
import Typography from '../Typography';
import SvgGreenArrow from '../icons/GreenArrow';

export const DateSelectorWrapStyled = styled.div`
  .NEXYButtonBase {
    padding: 12px 16px;
    justify-content: flex-start;

    &:disabled {
      background: ${nexyColors.seasalt};
      box-shadow: none;
      opacity: 1;
      color: ${nexyColors.coolGray};
    }
  }
  .NEXYButtonAdornment.start,
  .NEXYButtonLabel {
    margin-right: 8px;
  }
  .NEXYButtonAdornment.end {
    margin-left: auto;
  }
`;
export const MenuListStyled = styled(MenuList)`
  max-height: 23rem;
  overflow-y: auto;
  width: 13.25rem;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: ${nexyColors.paleLilac07};
  }

  &::-webkit-scrollbar-thumb {
    background: #585a6a80;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #585a6a9d;
  }
`;

export const ArrowIconStyled = styled(SvgGreenArrow)`
  transform: rotate(90deg);
  path {
    stroke: white;
  }
`;
export const StyledTypography = styled(Typography)`
  color: ${nexyColors.white};
  width: 150px;
`;
export const WrapStyled = styled.div`
  display: flex;

  .NEXYCalendar {
    &.DayPicker {
      color: ${colorByKey('white')};
    }

    /* Setting general styles for every day cell */
    .DayPicker-Day {
      width: 32px;
      height: 32px;
      padding: 0;
      border-radius: 0;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.6px;
    }

    /* Disabled days. Mostly in the future */
    .DayPicker-Day--disabled {
      opacity: 0.25;
    }

    /* TODAY */
    .DayPicker-Day--today {
      color: ${colorByKey('greenTeal')};
    }

    /* The inner range styles */
    .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
      background-color: rgba(14, 199, 106, 0.11);
      color: ${colorByKey('greenTeal')};
    }

    /* Start and end points */
    .DayPicker-Day--start:not(.DayPicker-Day--outside),
    .DayPicker-Day--end:not(.DayPicker-Day--outside) {
      border-radius: 5px;
      color: ${colorByKey('white')};
      background-color: ${colorByKey('greenTeal')}!important;
    }

    /* Hover styles for days */
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
      background-color: rgba(14, 199, 106, 0.11) !important;
      color: ${colorByKey('greenTeal')};

      box-shadow: none;
      border-radius: 5px;
    }
  }
`;
export const WrapCalendarStyled = styled.div`
  border-left: 1px solid rgba(66, 67, 71, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const WrapFormattedDatesStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(66, 67, 71, 0.5);
`;
export const WrapActionsStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid rgba(66, 67, 71, 0.5);

  .NEXYButton:first-child {
    margin-right: 12px;
  }
`;
