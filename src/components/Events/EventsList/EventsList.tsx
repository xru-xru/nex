import React from 'react';

import { NexoyaEvent } from '../../../types/types';

import { useDialogState } from '../../Dialog';
import useSidePanelState from '../../SidePanel/useSidePanelState';
import EventDeleteDialog from '../EventDeleteDialog/EventDeleteDialog';
import EventEditSidepanel from '../EventEditSidepanel/EventEditSidepanel';
import EventSingleIcon from '../EventSingleIcon/EventSingleIcon1';

type Props = {
  events: NexoyaEvent[];
  refetchEvents: () => void;
  eventsPositions: any;
  offset: number;
  hasOverlay?: boolean;
};

function EventsList({ events, refetchEvents, eventsPositions, offset, hasOverlay = false }: Props) {
  const {
    isOpen: isDeleteDialogOpen,
    toggleDialog: toggleDeleteDialog,
    //@ts-ignore
  } = useDialogState();
  const { isOpen: isEditSidepanelOpen, toggleSidePanel: toggleEditSidepanel } = useSidePanelState();
  const [selectedEvent, setSelectedEvent] = React.useState({});

  return (
    <>
      <div
        style={{
          position: 'relative',
        }}
      >
        {eventsPositions?.map((eventPosition) => {
          return (
            <div
              key={eventPosition.eventId}
              style={{
                zIndex: 1999,
              }}
            >
              <EventSingleIcon
                setSelectedEvent={setSelectedEvent}
                toggleDeleteDialog={toggleDeleteDialog}
                toggleEditSidepanel={toggleEditSidepanel}
                event={events.find((ev) => eventPosition.eventId === ev.event_id)}
                position={eventPosition}
                offset={offset}
                hasOverlay={hasOverlay}
              />
            </div>
          );
        })}
      </div>
      <EventEditSidepanel
        event={selectedEvent}
        refetchEvents={refetchEvents}
        isDrawerOpen={isEditSidepanelOpen}
        handleCloseDrawer={() => {
          toggleEditSidepanel();
          setSelectedEvent({});
        }}
      />
      <EventDeleteDialog
        event={selectedEvent}
        refetchEvents={refetchEvents}
        isDialogOpen={isDeleteDialogOpen}
        handleCloseDialog={() => {
          toggleDeleteDialog();
          setSelectedEvent({});
        }}
      />
    </>
  );
}

export default EventsList;
