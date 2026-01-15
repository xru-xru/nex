import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaBudgetItem } from '../../../../types';

import Button from 'components/Button';
import Dialog from 'components/Dialog';
import Fade from 'components/Fade';
import Typography from 'components/Typography';

import { colorByKey } from '../../../../theme/utils';

import { nexyColors } from '../../../../theme';

const SuccessDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const SuccessDialogActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 32px;
  margin-top: 40px;
  margin-bottom: 20px;
`;
const NoteStyled = styled.div`
  color: ${colorByKey('secondaryText')};
  letter-spacing: 0.6px;
  line-height: 20px;
  font-weight: 400;
  font-size: 16px;
  padding: 0 32px;
  display: flex;
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
  budgetItem: NexoyaBudgetItem;
  isOpen: any;
  onClose: any;
  onStartNewProcess: any;
};

function BudgetItemSuccessCreateDialog({ budgetItem, isOpen, onClose, onStartNewProcess }: Props) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-cy="portfolioSuccessDialog"
      paperProps={{
        style: {
          width: 482,
        },
      }}
    >
      <Fade in={isOpen} onExited={onClose} delay={350}>
        <div style={{ padding: '32px 32px 0 32px' }}>
          <SuccessDialogContent data-cy="portfolioSuccessContent">
            <span
              role="img"
              aria-label="success random emoji"
              style={{
                fontSize: 48,
                marginBottom: 8,
              }}
            >
              💰
            </span>
            <Typography
              variant="h1"
              component="h2"
              withEllipsis={false}
              style={{
                textAlign: 'center',
              }}
            >
              Your new budget item has been added
            </Typography>
            <Typography
              variant="subtitle"
              style={{
                textAlign: 'center',
              }}
              withEllipsis={false}
            >
              You can find{' '}
              <span
                style={{
                  color: nexyColors.greenTeal,
                }}
              >
                {budgetItem?.name}
              </span>{' '}
              in the budget items table.
            </Typography>
          </SuccessDialogContent>
          <BudgetItemOverviewContainer>
            <Typography variant="h4">Budget item overview</Typography>
            <SpaceBetween>
              <Typography variant="subtitle">Timeframe:</Typography>
              <Typography
                variant="subtitle"
                style={{
                  color: nexyColors.greenTeal,
                }}
              >
                {dayjs(budgetItem.startDate).format('DD MMM YYYY')} -{' '}
                {dayjs(budgetItem.endDate).utc().format('DD MMM YYYY')}
              </Typography>
            </SpaceBetween>
            <SpaceBetween>
              <Typography variant="subtitle">Budget:</Typography>
              <Typography
                variant="subtitle"
                style={{
                  color: nexyColors.greenTeal,
                }}
              >
                {budgetItem.budgetAmount}
              </Typography>
            </SpaceBetween>
          </BudgetItemOverviewContainer>
        </div>
      </Fade>
      <Fade in={isOpen} onExited={onClose} delay={500}>
        <NoteStyled data-cy="dialogNote">
          💭{'  '} Hint: You can delete your budget item in the table with the delete icon.
        </NoteStyled>
      </Fade>
      <Fade in={isOpen} onExited={onClose} delay={600}>
        <SuccessDialogActions>
          <Button onClick={onStartNewProcess} variant="contained" id="portfolioCreateAnother">
            Create another
          </Button>
          <Button onClick={onClose} color="primary" variant="contained" autoFocus>
            Got it
          </Button>
        </SuccessDialogActions>
      </Fade>
    </Dialog>
  );
}

export default BudgetItemSuccessCreateDialog;
