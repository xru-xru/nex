import React, { useState } from 'react';
import DayPicker from 'react-day-picker';

import { Emoji, Picker } from 'emoji-mart';
import styled from 'styled-components';

import { NexoyaEvent } from '../../../types/types';
import { DatePickerDateRange } from 'types';

import useEventMetaController from '../../../controllers/EventMetaController';
import { useUpdateEventMutation } from '../../../graphql/event/mutationUpdateEvent';

import { format } from '../../../utils/dates';

import Button from '../../Button';
import ButtonAdornment from '../../ButtonAdornment';
import { WrapStyled } from '../../DateSelector/styles';
import DialogTitle from '../../DialogTitle';
import Menu, { DropdownMenuAnchor, useDropdownMenu } from '../../DropdownMenu';
import Panel from '../../Panel';
import SidePanel from '../../SidePanel';
import Text from '../../Text';
import TextField from '../../TextField';
import SvgCaretDown from '../../icons/CaretDown';

const SidePanelContentStyled = styled.div`
  min-width: 600px;
  padding: 25px;
  position: relative;
`;
const MenuAnchorStyled = styled(DropdownMenuAnchor)`
  display: inline-block;
  .NEXYPopper {
    max-width: 362px;
  }
`;
const ButtonStyled = styled(Button)`
  width: 155px;
  overflow: hidden;
  display: flex;
  height: 45px;
  margin: 15px 0 0 15px;
`;
const ButtonWrapperStyled = styled.div`
  background: #fafbff;
  padding: 28px 32px 20px 32px;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  width: 100%;
`;
type Props = {
  event: NexoyaEvent | any;
  refetchEvents: () => void;
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
};

function EventEditSidepanel({ event, refetchEvents, isDrawerOpen, handleCloseDrawer }: Props) {
  const dateAnchorEl = React.useRef(null);
  const [isDatePickerExpanded, setIsDatePickerExpanded] = useState(false);
  const {
    form: { name, date, description, emoji },
    handleFormChange,
    setForm,
    resetForm,
  } = useEventMetaController();
  const { anchorEl, open, toggleMenu, closeMenu } = useDropdownMenu();
  // pre-populate form
  React.useEffect(() => {
    if (isDrawerOpen) {
      const { subject, description, emoji, timestamp } = event;
      setForm({
        name: subject,
        description: description || '',
        emoji: emoji || '',
        date: timestamp,
      });
    } else {
      resetForm();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen]);

  function handleDayClick(day: DatePickerDateRange) {
    handleFormChange({
      target: {
        name: 'date',
        value: day,
      },
    });
    setIsDatePickerExpanded(false);
  }

  async function onEditEvent() {
    try {
      //@ts-ignore
      await editEvent();
      refetchEvents();
      resetForm();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const [editEvent] = useUpdateEventMutation({
    event_id: event.event_id,
    subject: name,
    description,
    emoji,
    timestamp: date,
  });
  return (
    <SidePanel isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
      <DialogTitle data-cy="editDrawerTitle">
        <Text component="h3">Edit event</Text>
      </DialogTitle>
      <SidePanelContentStyled>
        <div
          style={{
            display: 'flex',
          }}
        >
          <MenuAnchorStyled ref={anchorEl}>
            <Button
              onClick={toggleMenu}
              iconAfter={SvgCaretDown}
              style={{
                margin: '15px 15px 0 0',
              }}
              endAdornment={
                <ButtonAdornment position="end">
                  <SvgCaretDown
                    style={{
                      transform: `rotate(${open ? '180' : '0'}deg)`,
                    }}
                  />
                </ButtonAdornment>
              }
            >
              <Emoji
                emoji={{
                  id: emoji,
                  skin: 3,
                }}
                size={32}
              />
            </Button>
          </MenuAnchorStyled>
          <Menu
            open={open}
            placement="bottom-start"
            anchorEl={anchorEl.current}
            container={anchorEl.current}
            onClose={closeMenu}
            style={{
              maxHeight: 450,
            }}
          >
            <Picker
              onSelect={(emoji) => {
                handleFormChange({
                  target: {
                    name: 'emoji',
                    value: emoji.id,
                  },
                });
                toggleMenu();
              }}
            />
          </Menu>
          <TextField
            placeholder="i.e Product Launch, Conference"
            value={name}
            label="Event Name*"
            name="name"
            id="name"
            labelVariant="light"
            onChange={handleFormChange}
            style={{
              width: '57%',
              marginBottom: 25,
            }}
          />
          <ButtonStyled
            ref={dateAnchorEl}
            shape="outlined"
            onClick={() => setIsDatePickerExpanded(!isDatePickerExpanded)}
            endAdornment={
              <ButtonAdornment position="end">
                <SvgCaretDown
                  style={{
                    transform: `rotate(${isDatePickerExpanded ? '180' : '0'}deg)`,
                  }}
                />
              </ButtonAdornment>
            }
          >
            {date ? format(date, 'D MMM') : 'Event date'}
          </ButtonStyled>
          <Panel
            open={isDatePickerExpanded}
            color="dark"
            anchorEl={dateAnchorEl.current}
            placement="bottom-end"
            style={{
              maxHeight: 500,
            }}
            popperProps={{
              style: {
                zIndex: 1301,
              },
            }}
          >
            <WrapStyled>
              <DayPicker
                className="NEXYCalendar"
                //@ts-ignore
                onDayClick={handleDayClick}
              />
            </WrapStyled>
          </Panel>
        </div>
        <TextField
          placeholder="Enter some description"
          value={description}
          type="textarea"
          rows={3}
          label="Description"
          name="description"
          id="description"
          labelVariant="light"
          onChange={handleFormChange}
          style={{
            width: '100%',
            marginBottom: 25,
          }}
        />
      </SidePanelContentStyled>
      <ButtonWrapperStyled>
        <Button id="cancelEditEvent" shape="contained" onClick={handleCloseDrawer}>
          Cancel
        </Button>
        <Button
          id="editEvent"
          color="primary"
          variant="contained"
          onClick={() => {
            onEditEvent();
            handleCloseDrawer();
          }}
        >
          Edit event
        </Button>
      </ButtonWrapperStyled>
    </SidePanel>
  );
}

export default EventEditSidepanel;
