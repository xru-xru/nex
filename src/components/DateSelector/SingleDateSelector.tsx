import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { BeforeAfterModifier } from 'react-day-picker/types/Modifiers';

import dayjs from 'dayjs';

import useDayPickerController from '../../hooks/useDayPickerController';

import { format, READABLE_FORMAT } from '../../utils/dates';

import Button from '../Button';
import ButtonAdornment from '../ButtonAdornment';
import Panel from '../Panel';
import SvgCalendarAlt from '../icons/CalendarAlt';
import SvgCaretDown from '../icons/CaretDown';
import { DateSelectorWrapStyled, WrapActionsStyled, WrapCalendarStyled, WrapStyled } from './styles';
import { convertLocalDateToUTCIgnoringTimezone } from './utils';

type DateSelectorProps = {
  selectedDate: Date;
  onDateChange: (props: { selectedDate: Date }) => void;
  panelProps?: Record<string, any>;
  className?: string;
  style?: Record<string, unknown>;
  isDisabled?: boolean;
  disableBeforeDate?: Date;
  disableAfterDate?: Date;
  renderInputValue?: (date: Date) => JSX.Element | string;
  showAsRange?: boolean;
};

function SingleDateSelector({
  onDateChange,
  selectedDate,
  panelProps,
  isDisabled = false,
  disableAfterDate = dayjs().utc().toDate(),
  disableBeforeDate,
  renderInputValue = (date: Date) => format(date, READABLE_FORMAT),
  showAsRange = true,
  ...rest
}: DateSelectorProps) {
  const { singleDateValue, onSingleDateChange, modifiers } = useDayPickerController({
    singleSelectedDate: selectedDate,
  });

  const anchorEl = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  if (isDisabled && open) {
    setOpen(false);
  }

  const disabledDays = React.useMemo(() => {
    const mods: BeforeAfterModifier[] = [];
    mods.push({
      before: convertLocalDateToUTCIgnoringTimezone(disableBeforeDate),
      after: convertLocalDateToUTCIgnoringTimezone(disableAfterDate),
    });
    return mods;
  }, [disableAfterDate, disableBeforeDate]);

  const applyDateSelectionChanges = (day: Date, modifiers: Record<string, any>) => {
    if (modifiers?.disabled) {
      return;
    }
    onSingleDateChange(day, modifiers);
    onDateChange({
      selectedDate: day,
    });
    setOpen(false);
  };
  // We want to reset the dates only after we open the modal again.
  // Otherwise we'll see range change when animating out the panel
  // React.useEffect(() => {
  //   if (open && !isSame(selectedDate, singleDateValue)) {
  //     reset();
  //   } // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [open]);
  return (
    <DateSelectorWrapStyled className="w-full">
      <Button
        id="dateSelector"
        active={open}
        variant="contained"
        color="secondary"
        flat
        type="button"
        onClick={() => setOpen((s) => !s)}
        style={{ color: '#2A2A32', width: '100%' }}
        ref={anchorEl}
        startAdornment={
          <ButtonAdornment position="start">
            <SvgCalendarAlt style={{ fill: '#A6A7B5' }} />
          </ButtonAdornment>
        }
        endAdornment={
          <ButtonAdornment position="end">
            <SvgCaretDown
              style={{
                transform: `rotate(${open ? '180' : '0'}deg)`,
                fill: '#A6A7B5',
              }}
            />
          </ButtonAdornment>
        }
        {...rest}
      >
        {renderInputValue(singleDateValue)}
      </Button>
      <Panel
        open={open}
        color="dark"
        anchorEl={anchorEl.current}
        placement="bottom-end"
        style={{
          maxHeight: 500,
        }}
        popperProps={{
          style: {
            zIndex: 1301,
          },
        }}
        {...panelProps}
      >
        <WrapStyled>
          <WrapCalendarStyled>
            <DayPicker
              className="NEXYCalendar"
              firstDayOfWeek={modifiers.firstDayOfWeek}
              numberOfMonths={1}
              disabledDays={disabledDays}
              onDayClick={applyDateSelectionChanges}
              selectedDays={showAsRange ? { from: new Date(), to: singleDateValue } : singleDateValue}
              modifiers={showAsRange ? { start: new Date(), end: singleDateValue } : null}
            />
            <WrapActionsStyled>
              <Button variant="contained" size="small" color="dark" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                style={{ boxShadow: 'none' }}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => applyDateSelectionChanges(singleDateValue, modifiers)}
              >
                Apply
              </Button>
            </WrapActionsStyled>
          </WrapCalendarStyled>
        </WrapStyled>
      </Panel>
    </DateSelectorWrapStyled>
  );
}

export { SingleDateSelector };
