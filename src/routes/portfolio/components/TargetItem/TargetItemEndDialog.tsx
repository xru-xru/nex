import styled from 'styled-components';

import { NexoyaPortfolioTargetItem } from '../../../../types';

import ButtonAsync from '../../../../components/ButtonAsync';
import Button from 'components/Button';
import Dialog from 'components/Dialog';
import Fade from 'components/Fade';
import Typography from 'components/Typography';

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;
const SuccessDialogActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 32px;
  margin-top: 40px;
  margin-bottom: 20px;
`;

type Props = {
  targetItem: NexoyaPortfolioTargetItem;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  handleEnd: () => void;
};

export function TargetItemEndDialog({ targetItem, isOpen, onClose, handleEnd, loading }: Props) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-cy="portfolioSuccessDialog"
      paperProps={{
        style: {
          width: 550,
        },
      }}
    >
      <Fade in={isOpen} onExited={onClose} delay={150}>
        <div style={{ padding: '32px 32px 0 32px' }}>
          <DialogContent data-cy="portfolioSuccessContent">
            <Typography variant="h1" component="h2" withEllipsis={false}>
              End the {targetItem?.name} target item?
            </Typography>
            <Typography variant="subtitle" withEllipsis={false}>
              Ending the target item will align the planned target with the current spend and adjust the end date to
              yesterday.
            </Typography>
            <Typography style={{ fontSize: 13 }} variant="subtitle" withEllipsis={false}>
              Note: This does not affect the actual spending on your advertising channels.
            </Typography>
          </DialogContent>
        </div>
      </Fade>

      <Fade in={isOpen} onExited={onClose} delay={350}>
        <SuccessDialogActions>
          <Button onClick={onClose} variant="contained" id="portfolioCreateAnother">
            Cancel
          </Button>
          <ButtonAsync loading={loading} disabled={loading} onClick={handleEnd} color="danger" variant="contained">
            Yes, end target item
          </ButtonAsync>
        </SuccessDialogActions>
      </Fade>
    </Dialog>
  );
}
