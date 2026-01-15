import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaPortfolioTargetItem, NexoyaTargetItemStatus } from 'types';

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

const TargetItemOverviewContainer = styled.div`
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
  editedTargetItem: NexoyaPortfolioTargetItem;
  isOpen: any;
  onClose: any;
};

export function TargetItemSuccessEditDialog({ editedTargetItem, isOpen, onClose }: Props) {
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
              Target item has been edited
            </Typography>
            <Typography variant="subtitle" withEllipsis={false}>
              The target item has been updated with the following:
            </Typography>
          </SuccessDialogContent>
          <TargetItemOverviewContainer>
            <SpaceBetween>
              <Typography variant="subtitle">Target item name:</Typography>
              <Typography
                variant="subtitle"
                style={{
                  color: nexyColors.greenTeal,
                }}
              >
                {editedTargetItem?.name}
              </Typography>
            </SpaceBetween>

            {editedTargetItem.status === NexoyaTargetItemStatus.Planned ? (
              <SpaceBetween>
                <Typography variant="subtitle">Timeframe:</Typography>
                <Typography
                  variant="subtitle"
                  style={{
                    color: nexyColors.greenTeal,
                  }}
                >
                  {dayjs(editedTargetItem?.start).format('DD MMM YYYY')} -{' '}
                  {dayjs(editedTargetItem?.end).utc().format('DD MMM YYYY')}
                </Typography>
              </SpaceBetween>
            ) : null}
            {editedTargetItem.status !== NexoyaTargetItemStatus.Past ? (
              <SpaceBetween>
                <Typography variant="subtitle">Planned target:</Typography>
                <Typography
                  variant="subtitle"
                  style={{
                    color: nexyColors.greenTeal,
                  }}
                >
                  {editedTargetItem?.value}
                </Typography>
              </SpaceBetween>
            ) : null}
            <SpaceBetween>
              <Typography variant="subtitle">Budget limit:</Typography>
              <Typography
                variant="subtitle"
                style={{
                  color: nexyColors.greenTeal,
                }}
              >
                {editedTargetItem?.maxBudget}
              </Typography>
            </SpaceBetween>
          </TargetItemOverviewContainer>
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
