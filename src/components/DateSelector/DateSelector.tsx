import React, { ReactNode, SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import DayPicker, { Modifier } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { DayModifiers, RangeModifier } from 'react-day-picker/types/Modifiers';

import dayjs from 'dayjs';

import useDayPickerController from '../../hooks/useDayPickerController';

import { DATE_SELECTOR_DEFAULT_FORMAT, djsAnchors, getLaterDay, READABLE_FORMAT } from '../../utils/dates';

import Button from '../Button';
import ButtonAdornment from '../ButtonAdornment';
import Tooltip from '../Tooltip';
import SvgCalendarAlt from '../icons/CalendarAlt';
import SvgCaretDown from '../icons/CaretDown';
import { convertToNexoyaDateRanges } from './dateRangeConversions';
import {
  ArrowIconStyled,
  DateSelectorWrapStyled,
  StyledTypography,
  WrapActionsStyled,
  WrapCalendarStyled,
  WrapFormattedDatesStyled,
  WrapStyled,
} from './styles';
import { convertLocalDateToUTCIgnoringTimezone, DATE_RANGES, DateRangeOptions } from './utils';
import Switch from '../Switch';
import { Popover, PopoverContent, PopoverTrigger } from 'components-ui/Popover';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../../components-ui/ScrollArea';
import { TooltipV2 } from '../Tooltip/TooltipV2';

export interface ExtendedDayModifiers extends DayModifiers {
  disabled?: boolean;
  selected?: boolean;
  end?: boolean;
}

export interface IDateRangeShort {
  from: Date;
  to: Date;
  singleDate?: Date;
}

type DateSelectorProps = {
  dateFrom: Date;
  dateTo: Date;
  onDateChange: (props: IDateRangeShort) => void;
  panelProps?: {
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
  };
  hidePastQuickSelection?: boolean;
  hideFutureQuickSelection?: boolean;
  className?: string;
  style?: Record<string, unknown>;
  dateRanges?: DateRangeOptions;
  isDisabled?: boolean;
  useNexoyaDateRanges?: boolean;
  disableBeforeDate?: Date;
  disableAfterDate?: Date;
  disabledRange?: RangeModifier[];
  renderDay?: (day: Date, modifiers: ExtendedDayModifiers) => ReactNode;
  applyButtonTooltipDisabledContent?: string;
  disabled?: boolean;
  minimumDaysSelection?: number;
  defaultDateFrom?: Date;
  defaultDateTo?: Date;
  format?: string;
  renderStartAdornment?: () => ReactNode;
  defaultDatePickerOpen?: boolean;
  showSingleDateSwitcher?: boolean;
  isSingleDate?: boolean; // Renamed prop
  onEndDateOnlyChange?: (isEndDateOnly: boolean) => void; // Renamed callback
  numberOfMonths?: number;
  renderAdditionalContent?: () => ReactNode;
  onDiscard?: () => void;
  // Called when a user clicks a specific day in single-date mode (before Apply)
  onPreviewSingleDate?: (date: Date) => void;
  placeholder?: string;
};

/**
 * @param onDateChange
 * @param dateFrom
 * @param dateTo
 * @param panelProps
 * @param hidePastQuickSelection
 * @param hideFutureQuickSelection
 * @param dateRanges
 * @param isDisabled
 * @param useNexoyaDateRanges Selector uses the local time to determine which day the Date is.
 * Nexoya uses utcStartMidnight and utcEndMidnight as the start and end of a date range.
 * A conversion wrapper can be used with useNexoyaDateRanges flag.
 * @param disableAfterDate Date() object to disable all dates after it
 * @param disableBeforeDate Date() object to disable all dates before it
 * @param renderDay Custom render function for the day
 * @param disabledRange Custom range of dates to disable instead of just having a before/after
 * @param applyButtonTooltipDisabledContent Tooltip content for the apply button when it's disabled
 * @param disabled Disable the date selector completely
 * @param minimumDaysSelection Minimum amount of days that can be selected
 * @param defaultDateFrom Default date from
 * @param defaultDateTo Default date to
 * @param format Format of the displayed date
 * @param renderStartAdornment Custom method to render the start adornment of the button that opens up the date selector
 * @param defaultDatePickerOpen Default state of the date picker
 * @param showSingleDateSwitcher Show the switch to add an end date
 * @param isEndDateOnly Show the switch to add an end date and only select an end date
 * @param onEndDateOnlyChange Callback function to handle the end date switch
 * @param numberOfMonths Number of months to show in the date picker simultaneously
 * @param renderAdditionalContent Render additional content near the date picker
 * @param rest Rest of the props
 */
function DateSelector({
  onDateChange,
  dateFrom,
  dateTo,
  panelProps,
  hidePastQuickSelection = false,
  hideFutureQuickSelection = false,
  dateRanges = DATE_RANGES,
  isDisabled = false,
  useNexoyaDateRanges = false,
  disableAfterDate = dayjs().utc().toDate(),
  disableBeforeDate,
  renderDay,
  disabledRange,
  applyButtonTooltipDisabledContent = '',
  disabled,
  minimumDaysSelection,
  defaultDateFrom = djsAnchors.startOf7DaysAgo.toDate(),
  defaultDateTo = djsAnchors.today.toDate(),
  renderStartAdornment,
  format = DATE_SELECTOR_DEFAULT_FORMAT,
  defaultDatePickerOpen = false,
  showSingleDateSwitcher = false,
  isSingleDate = false,
  numberOfMonths = 2,
  renderAdditionalContent = null,
  onEndDateOnlyChange,
  onDiscard,
  onPreviewSingleDate,
  placeholder = 'Select date range',
  ...rest
}: DateSelectorProps) {
  if (useNexoyaDateRanges) {
    const withConversions = convertToNexoyaDateRanges(dateFrom, dateTo, onDateChange);
    dateFrom = withConversions.dateFrom;
    dateTo = withConversions.dateTo;
    onDateChange = withConversions.onDateChange;
  }

  const { from, to, onChange, onRangeChange, reset, modifiers, singleDateValue, onSingleDateChange } =
    useDayPickerController({
      from: dayjs(dateFrom).isValid() ? dateFrom : defaultDateFrom,
      to: dayjs(dateTo).isValid() ? dateTo : defaultDateFrom,
    });

  const anchorEl = useRef(null);
  const tooltipRef = useRef(null);
  const [open, setOpen] = useState(defaultDatePickerOpen);
  const [isValidRange, setIsValidRange] = useState(false);
  const [disabledTooltipOpen, setDisabledTooltipOpen] = useState(false);
  const [isSingleDateState, setIsSingleDateState] = useState(isSingleDate);

  if (isDisabled && open) {
    setOpen(false);
  }

  function applyDateRange() {
    setOpen(false);
    onDateChange({
      from: from.value,
      to: to.value,
      singleDate: singleDateValue,
    });
  }

  function discardDateRange() {
    setOpen(false);
    onDiscard?.();
  }

  function handleRangeChange(ev: SyntheticEvent<HTMLButtonElement>) {
    const { selection } = ev.currentTarget.dataset;
    const selectedRange = dateRanges[selection];
    if (!selectedRange) throw new Error('You have provided incorrect selection values');
    const dateRange = selectedRange.getDateRange();
    if (disableBeforeDate) dateRange.from = getLaterDay(dateRange.from, disableBeforeDate);

    onRangeChange(dateRange);
  }

  const disabledDays = useMemo(() => {
    const mods: Modifier[] = [];
    // Handle the before and after dates
    if (disableBeforeDate || disableAfterDate) {
      mods.push({
        before: disableBeforeDate ? convertLocalDateToUTCIgnoringTimezone(disableBeforeDate) : undefined,
        after: disableAfterDate ? convertLocalDateToUTCIgnoringTimezone(disableAfterDate) : undefined,
      });
    }
    // Handle the disabled ranges
    if (disabledRange && disabledRange.length) {
      disabledRange.forEach((range) => {
        if (range.from && range.to) {
          mods.push({
            from: convertLocalDateToUTCIgnoringTimezone(range.from),
            to: convertLocalDateToUTCIgnoringTimezone(range.to),
          });
        }
      });
    }
    return mods;
  }, [disableAfterDate, disableBeforeDate, disabledRange]);

  const areSelectedDatesDisabled = useMemo(() => {
    // For single date mode, check if singleDate is undefined
    if (isSingleDateState) {
      if (!singleDateValue) {
        return true;
      }
    } else {
      // Check if 'from' or 'to' is undefined, return true to disable selection
      if (!from.value || !to.value) {
        return true;
      }
    }

    // Check if selected dates are within the disabled range
    if (disabledRange && disabledRange.length) {
      for (const range of disabledRange) {
        if (!range.from || !range.to) continue;

        if (isSingleDateState) {
          // For single date mode, check if the single date falls within any disabled range
          const singleDay = dayjs(singleDateValue);
          const rangeStart = dayjs(range.from);
          const rangeEnd = dayjs(range.to);

          if (singleDay.isBetween(rangeStart, rangeEnd, 'day', '[]')) {
            return true;
          }
        } else {
          // For range mode, check intersection with disabled ranges
          const fromDay = dayjs(from.value);
          const toDay = dayjs(to.value);
          const rangeStart = dayjs(range.from);
          const rangeEnd = dayjs(range.to);

          // Check if there's an intersection with the disabled range
          if (
            fromDay.isBetween(rangeStart, rangeEnd, 'day', '[]') ||
            toDay.isBetween(rangeStart, rangeEnd, 'day', '[]') ||
            rangeStart.isBetween(fromDay, toDay, 'day', '[]') ||
            rangeEnd.isBetween(fromDay, toDay, 'day', '[]')
          ) {
            return true;
          }
        }
      }
    }

    // Check against disableBeforeDate and disableAfterDate
    if (isSingleDateState) {
      if (
        (disableBeforeDate && dayjs(singleDateValue).isBefore(dayjs(disableBeforeDate), 'day')) ||
        (disableAfterDate && dayjs(singleDateValue).isAfter(dayjs(disableAfterDate), 'day'))
      ) {
        return true;
      }
    } else {
      if (
        (disableBeforeDate && dayjs(from.value).isBefore(dayjs(disableBeforeDate), 'day')) ||
        (disableAfterDate && dayjs(to.value).isAfter(dayjs(disableAfterDate), 'day'))
      ) {
        return true;
      }
    }

    // Validate against minimum selection (only for range mode)
    if (
      !isSingleDateState &&
      minimumDaysSelection &&
      dayjs(to.value).startOf('day').diff(dayjs(from.value).startOf('day'), 'day') < minimumDaysSelection - 1
    ) {
      return true;
    }

    return false;
  }, [
    from.value,
    to.value,
    singleDateValue,
    disabledRange,
    disableBeforeDate,
    disableAfterDate,
    minimumDaysSelection,
    isSingleDateState,
  ]);

  useEffect(() => {
    if (!open) {
      setDisabledTooltipOpen(false);
    }
  }, [open]);

  useEffect(() => {
    setIsValidRange(!areSelectedDatesDisabled);
  }, [areSelectedDatesDisabled]);

  useEffect(() => {
    if (!isValidRange && open) {
      setTimeout(() => {
        setDisabledTooltipOpen(true);
      }, 500);
    }
  }, [isValidRange, open]);

  useEffect(() => {
    if (open && dateFrom && dateTo && (!dayjs(dateFrom).isSame(from.value) || !dayjs(dateTo).isSame(to.value))) {
      reset();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const datesExist = isSingleDate
    ? dateFrom && dayjs(dateFrom).isValid()
    : dateFrom && dateTo && dayjs(dateFrom).isValid() && dayjs(dateTo).isValid();

  const handleSwitchSingleDate = () => {
    setIsSingleDateState((prev) => !prev);
    reset();
  };

  const renderPopoverContent = () => (
    <PopoverContent
      side={panelProps?.side || 'bottom'}
      align={panelProps?.align || 'end'}
      className="flex max-h-[500px] w-full bg-darkGrey-100 p-0"
    >
      <WrapStyled>
        <div>
          {!hidePastQuickSelection || !hideFutureQuickSelection ? (
            <ScrollArea className="bg-darkGrey flex max-h-96 w-52 flex-col justify-start p-3">
              {Object.keys(dateRanges).map((dateRangeKey, index) => {
                const range = dateRanges[dateRangeKey];
                const selectedRange = range.getDateRange();

                // Compare the currently selected dates with the dates of the range
                const isSelected =
                  dayjs(from.value).isSame(selectedRange.from, 'day') &&
                  dayjs(to.value).isSame(selectedRange.to, 'day');

                if (hidePastQuickSelection && range.isPast) return <span key={`no-past-${index}`} />;
                if (hideFutureQuickSelection && !range.isPast) return <span key={`no-future-${index}`} />;

                return (
                  <button
                    className={cn(
                      isSelected ? 'bg-davyGray text-cloudyBlue' : 'text-darkGrey',
                      'line-height-[18px] flex w-full justify-start whitespace-nowrap rounded px-3 py-2 font-normal hover:bg-davyGray hover:text-[#DFE1ED]',
                    )}
                    key={dateRangeKey}
                    onClick={handleRangeChange}
                    data-selection={dateRangeKey}
                  >
                    {range.name}
                  </button>
                );
              })}
            </ScrollArea>
          ) : null}
        </div>
        <WrapCalendarStyled>
          {!isSingleDateState ? (
            <WrapFormattedDatesStyled>
              <StyledTypography>{dayjs(modifiers.selected.from).format(READABLE_FORMAT)}</StyledTypography>
              <ArrowIconStyled />
              <StyledTypography style={{ textAlign: 'right' }}>
                {dayjs(modifiers.selected.to).format(READABLE_FORMAT)}
              </StyledTypography>
            </WrapFormattedDatesStyled>
          ) : null}
          <DayPicker
            renderDay={renderDay}
            initialMonth={modifiers.initialMonth}
            className="NEXYCalendar"
            firstDayOfWeek={modifiers.firstDayOfWeek}
            numberOfMonths={numberOfMonths}
            selectedDays={isSingleDateState ? singleDateValue : modifiers.selected}
            disabledDays={disabledDays}
            modifiers={isSingleDateState ? { selected: singleDateValue } : modifiers.startEnd}
            onDayClick={(day) => {
              if (isSingleDateState) {
                onSingleDateChange(day, modifiers);
                onPreviewSingleDate?.(day);
              } else {
                onChange(day, modifiers);
              }
            }}
            month={singleDateValue ? dayjs(singleDateValue).toDate() : dayjs(modifiers.selected.to).toDate()}
          />
          <WrapActionsStyled>
            {showSingleDateSwitcher && (
              <div className="flex w-full items-center justify-start gap-2 text-white">
                <p>End date</p>
                <Switch onToggle={handleSwitchSingleDate} isOn={!isSingleDateState} />
              </div>
            )}
            <Button variant="contained" size="small" color="dark" onClick={discardDateRange}>
              Cancel
            </Button>
            <Tooltip
              open={disabledTooltipOpen}
              placement="bottom"
              style={{ wordBreak: 'break-word', maxWidth: 350 }}
              popperProps={{
                style: { zIndex: 3100 },
              }}
              content={!isValidRange ? applyButtonTooltipDisabledContent : ''}
            >
              <Button
                ref={tooltipRef}
                style={{ boxShadow: 'none', pointerEvents: 'all' }}
                variant="contained"
                color="primary"
                size="small"
                disabled={!isValidRange}
                onClick={applyDateRange}
              >
                Apply
              </Button>
            </Tooltip>
          </WrapActionsStyled>
        </WrapCalendarStyled>
      </WrapStyled>
    </PopoverContent>
  );

  return (
    <DateSelectorWrapStyled>
      <Popover modal defaultOpen={defaultDatePickerOpen} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="dateSelector"
            active={open}
            variant="contained"
            color="secondary"
            flat
            type="button"
            onClick={() => setOpen((...prevState) => !prevState)}
            ref={anchorEl}
            disabled={disabled}
            className={!datesExist ? '!font-normal' : ''}
            startAdornment={
              renderStartAdornment ? (
                renderStartAdornment()
              ) : (
                <ButtonAdornment position="start">
                  <SvgCalendarAlt />
                </ButtonAdornment>
              )
            }
            endAdornment={
              <ButtonAdornment position="end">
                <SvgCaretDown
                  style={{
                    transform: `rotate(${open ? '180' : '0'}deg)`,
                  }}
                />
              </ButtonAdornment>
            }
            {...rest}
          >
            {datesExist && isSingleDate
              ? `${dayjs(dateFrom).format(format)}`
              : datesExist
                ? `${dayjs(dateFrom).format(format)} - ${dayjs(dateTo).format(format)}`
                : placeholder}
          </Button>
        </PopoverTrigger>

        {renderAdditionalContent?.() ? (
          <TooltipV2 content={renderAdditionalContent()} open={open} variant="dark" placement="right-start">
            {renderPopoverContent()}
          </TooltipV2>
        ) : (
          renderPopoverContent()
        )}
      </Popover>
    </DateSelectorWrapStyled>
  );
}

export { DateSelector };
export type { DateSelectorProps };
