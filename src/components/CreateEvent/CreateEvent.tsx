import React, { useState } from 'react';
import DayPicker from 'react-day-picker';

import { Emoji, Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import styled from 'styled-components';

import { DatePickerDateRange } from 'types';

import useEventMetaController from '../../controllers/EventMetaController';
import { useCreateEventMutation } from '../../graphql/event/mutationCreateEvent';
import DOMPurify from 'dompurify';

import { format } from '../../utils/dates';

import Button from '../Button';
import ButtonAdornment from '../ButtonAdornment';
import { WrapStyled } from '../DateSelector/styles';
import Menu, { DropdownMenuAnchor, useDropdownMenu } from '../DropdownMenu';
import Panel from '../Panel';
import SidePanel from '../SidePanel';
import TextField from '../TextField';
import SvgCaretDown from '../icons/CaretDown';

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
  refetchEvents: () => void;
  handleCloseCreateEventDialog: () => void;
  isCreateEventDialogOpen: boolean;
  eventDate: Date | null;
};
const EMOJI_DEFAULT = 'smile';

function CreateEvent({ refetchEvents, isCreateEventDialogOpen, handleCloseCreateEventDialog, eventDate }: Props) {
  const [isDatePickerExpanded, setIsDatePickerExpanded] = useState(false);
  const {
    form: { name, date, description, emoji },
    handleFormChange,
    resetForm,
  } = useEventMetaController();
  const { anchorEl, open, toggleMenu, closeMenu } = useDropdownMenu();
  const dateAnchorEl = React.useRef(null);
  React.useEffect(() => {
    handleFormChange({
      target: {
        name: 'date',
        value: eventDate,
      },
    });
  }, [eventDate, handleFormChange]);

  function handleDayClick(day: DatePickerDateRange) {
    handleFormChange({
      target: {
        name: 'date',
        value: day,
      },
    });
    setIsDatePickerExpanded(false);
  }

  async function onCreateEvent() {
    try {
      //@ts-ignore
      await createEvent();
      refetchEvents();
      resetForm();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const [createEvent] = useCreateEventMutation({
    subject: DOMPurify.sanitize(name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    description: DOMPurify.sanitize(description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    emoji: emoji || EMOJI_DEFAULT,
    timestamp: date ? format(date, 'utcMidday') : null,
  });
  return (
    <SidePanel isOpen={isCreateEventDialogOpen} onClose={handleCloseCreateEventDialog}>
      <SidePanelContentStyled>
        <h3
          style={{
            marginBottom: 25,
          }}
        >
          Add event
        </h3>
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
                  id: emoji || EMOJI_DEFAULT,
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
            label="EVENT NAME*"
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
          label="DESCRIPTION"
          name="description"
          id="description"
          labelVariant="light"
          onChange={handleFormChange}
          //@ts-ignore
          style={{
            width: '100%',
            marginBottom: 25,
          }}
        />
      </SidePanelContentStyled>
      <ButtonWrapperStyled>
        <Button id="cancelEvent" shape="contained" onClick={handleCloseCreateEventDialog}>
          Cancel
        </Button>
        <Button
          id="createEvent"
          color="primary"
          variant="contained"
          onClick={() => {
            onCreateEvent();
            handleCloseCreateEventDialog();
          }}
        >
          Create event
        </Button>
      </ButtonWrapperStyled>
    </SidePanel>
  );
}

export default CreateEvent;
