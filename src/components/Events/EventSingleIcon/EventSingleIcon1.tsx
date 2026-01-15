import React from 'react';

import { emojiIndex } from 'emoji-mart';
import styled from 'styled-components';

import { NexoyaEvent } from '../../../types/types';

import usePresenterMode from '../../../hooks/usePresenterMode';
import { format } from '../../../utils/dates';

import theme from '../../../theme/theme';

import MenuList from '../../ArrayMenuList';
import MenuItem from '../../MenuItem';
import Panel from '../../Panel';
import { PencilIcon, TrashIcon } from '../../icons';

type Props = {
  event: NexoyaEvent;
  setSelectedEvent: (arg: NexoyaEvent) => void;
  toggleDeleteDialog: () => void;
  toggleEditSidepanel: () => void;
  position: {
    x: number;
    y: number;
  };
  offset: number;
  hasOverlay: boolean;
};

interface IconWrapperEventSigneIconProps {
  position: {
    x: number;
  };
  offset: number;
  hasOverlay: boolean;
}
const IconWrapperStyled = styled.div<IconWrapperEventSigneIconProps>`
  cursor: pointer;
  fontsize: 20px;
  position: absolute;
  left: ${({ position, offset }) => position.x + offset + 5}px;
  top: -67px;
  font-size: 20px;
  z-index: ${theme.layers.close};
  filter: ${({ hasOverlay }) => (hasOverlay ? 'blur(3px)' : 'blur(0)')};
`;

function EventSingleIcon({
  event,
  setSelectedEvent,
  toggleDeleteDialog,
  toggleEditSidepanel,
  position,
  offset,
  hasOverlay,
}: Props) {
  const anchorEl = React.useRef(null);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const { isPresenterMode: presenterMode } = usePresenterMode();

  function getNativeIcon() {
    // TODO: Maybe there is already API in emoji-mart library for this
    // trigger search by id, filter by id (to find exact match), and return only native emoji
    try {
      const nativeEmoji = emojiIndex
        .search(event.emoji)
        .filter((o) => o.id === event.emoji)
        .map((o) => o.native);
      return nativeEmoji ? nativeEmoji[0] : null;
    } catch (e) {
      return null;
    }
  }

  return (
    <>
      {position?.x && offset ? (
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            position: 'absolute',
            left: position.x + offset,
            top: -68,
            zIndex: 149,
            display: panelOpen ? 'block' : 'none',
          }}
        />
      ) : null}
      <IconWrapperStyled
        position={position}
        hasOverlay={hasOverlay}
        offset={offset}
        ref={anchorEl}
        onClick={() => {
          setPanelOpen((s) => !s);
        }}
      >
        {getNativeIcon()}
      </IconWrapperStyled>
      <Panel
        open={panelOpen}
        anchorEl={anchorEl.current}
        onClose={() => setPanelOpen(false)}
        placement="top"
        style={{
          maxHeight: 250,
          overflowY: 'auto',
        }}
        popperProps={{
          enableScheduleUpdate: true,
          style: {
            zIndex: 1305,
          },
        }}
      >
        <MenuList color="dark">
          <p
            style={{
              textAlign: 'center',
              color: '#b7bac7',
            }}
            key="event-date"
            data-cy="event-date-menu"
          >
            {format(event?.timestamp, 'D MMM')}
          </p>
          <p
            key="event-subject"
            style={{
              textAlign: 'center',
              color: '#fff',
              lineHeight: '28px',
            }}
            data-cy="event-subject-menu"
          >
            {event?.subject}
          </p>
          {!presenterMode ? (
            <MenuItem
              key="edit-event"
              data-cy="edit-event-menu"
              onClick={() => {
                setSelectedEvent(event);
                toggleEditSidepanel();
                setPanelOpen((s) => !s);
              }}
            >
              <PencilIcon
                style={{
                  display: 'inline-block',
                  marginRight: '15px',
                }}
              />
              Edit event
            </MenuItem>
          ) : (
            <span />
          )}
          {!presenterMode ? (
            <MenuItem
              key="delete-event"
              data-cy="delete-event-menu"
              onClick={() => {
                setSelectedEvent(event);
                toggleDeleteDialog();
                setPanelOpen((s) => !s);
              }}
            >
              <span
                style={{
                  color: 'red',
                }}
              >
                <TrashIcon
                  style={{
                    display: 'inline-block',
                    marginRight: '15px',
                  }}
                />
                Delete event
              </span>
            </MenuItem>
          ) : (
            <span />
          )}
        </MenuList>
      </Panel>
    </>
  );
}

export default EventSingleIcon;
