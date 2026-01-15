import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaBudgetItem, NexoyaBudgetItemStatus } from 'types';

import Button from 'components/Button';
import Dialog from 'components/Dialog';
import Fade from 'components/Fade';
import Typography from 'components/Typography';

import { nexyColors } from '../../../../theme';

const SuccessDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const SuccessDialogActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 32px;
  margin-top: 15px;
  margin-bottom: 20px;
`;

const BudgetItemOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px;
  gap: 10px;
  background: ${nexyColors.seasalt};
  border: 1px solid #e3e4e8;
  border-radius: 5px;
  margin: 24px 0;
`;

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

type Props = {
  editedBudgetItem: NexoyaBudgetItem;
  isOpen: any;
  onClose: any;
};

export function BudgetItemSuccessEditDialog({ editedBudgetItem, isOpen, onClose }: Props) {
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
      <Fade in={isOpen} delay={350}>
        <div style={{ padding: '32px 32px 0 32px' }}>
          <SuccessDialogContent data-cy="portfolioSuccessContent">
            <Typography variant="h1" component="h2" withEllipsis={false}>
              Budget item has been edited
            </Typography>
            <Typography variant="subtitle" withEllipsis={false}>
              The budget item has been updated with the following:
            </Typography>
          </SuccessDialogContent>
          <BudgetItemOverviewContainer>
            <SpaceBetween>
              <Typography variant="subtitle">Budget item name:</Typography>
              <Typography
                variant="subtitle"
                style={{
                  color: nexyColors.greenTeal,
                }}
              >
                {editedBudgetItem?.name}
              </Typography>
            </SpaceBetween>

            {editedBudgetItem.status === NexoyaBudgetItemStatus.Planned ? (
              <SpaceBetween>
                <Typography variant="subtitle">Timeframe:</Typography>
                <Typography
                  variant="subtitle"
                  style={{
                    color: nexyColors.greenTeal,
                  }}
                >
                  {dayjs(editedBudgetItem?.startDate).format('DD MMM YYYY')} -{' '}
                  {dayjs(editedBudgetItem?.endDate).format('DD MMM YYYY')}
                </Typography>
              </SpaceBetween>
            ) : null}
            {editedBudgetItem.status !== NexoyaBudgetItemStatus.Past ? (
              <SpaceBetween>
                <Typography variant="subtitle">Planned budget:</Typography>
                <Typography
                  variant="subtitle"
                  style={{
                    color: nexyColors.greenTeal,
                  }}
                >
                  {editedBudgetItem?.budgetAmount}
                </Typography>
              </SpaceBetween>
            ) : null}
          </BudgetItemOverviewContainer>
        </div>
      </Fade>

      <Fade in={isOpen} delay={600}>
        <SuccessDialogActions>
          <Button style={{ width: '100%' }} onClick={onClose} color="primary" variant="contained" autoFocus>
            Got it
          </Button>
        </SuccessDialogActions>
      </Fade>
    </Dialog>
  );
}
