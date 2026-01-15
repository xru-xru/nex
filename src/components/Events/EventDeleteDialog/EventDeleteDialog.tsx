import styled from 'styled-components';

import { NexoyaEvent } from '../../../types/types';

import { useDeleteEventMutation } from '../../../graphql/event/mutationDeleteEvent';

import { formatShortDate } from '../../../utils/formater';

import Button from '../../Button';
import Dialog from '../../Dialog';

const DialogContentStyled = styled.div`
  padding: 25px;
`;
const ButtonWrapperStyled = styled.div`
  padding: 18px 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
`;
type Props = {
  event: NexoyaEvent | any;
  refetchEvents: () => void;
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
};

function EventDeleteDialog({ event = {}, refetchEvents, isDialogOpen, handleCloseDialog }: Props) {
  async function onDeleteEvent() {
    try {
      //@ts-ignore
      await deleteEvent();
      refetchEvents();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const [deleteEvent] = useDeleteEventMutation({
    event_id: event.event_id,
  });
  return (
    <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog}>
      <DialogContentStyled data-cy="deleteEventDlgContent">
        {`Are you sure you want to delete the event ${event.subject} that's happening on ${formatShortDate(
          event.timestamp,
          {
            year: 'numeric',
            weekday: 'short',
          }
        )}`}

        <ButtonWrapperStyled>
          <Button id="cancelDeleteDlgBtn" shape="contained" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            id="deleteEventDlgBtn"
            color="primary"
            variant="contained"
            onClick={() => {
              onDeleteEvent();
              handleCloseDialog();
            }}
          >
            Delete event
          </Button>
        </ButtonWrapperStyled>
      </DialogContentStyled>
    </Dialog>
  );
}

export default EventDeleteDialog;
