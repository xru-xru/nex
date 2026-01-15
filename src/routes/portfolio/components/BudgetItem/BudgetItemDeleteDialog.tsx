import React from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaBudgetItem } from '../../../../types';

import ButtonAsync from '../../../../components/ButtonAsync';
import FormattedCurrency from '../../../../components/FormattedCurrency';
import SvgWarningTwo from '../../../../components/icons/WarningTwo';
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
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  handleDelete: () => void;
};

function BudgetItemDeleteDialog({ budgetItem, isOpen, onClose, handleDelete, loading }: Props) {
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
      <Fade in={isOpen} onExited={onClose} delay={150}>
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
              <SvgWarningTwo />
            </span>
            <Typography
              variant="h1"
              component="h2"
              withEllipsis={false}
              style={{
                textAlign: 'center',
              }}
            >
              Are you sure you want to delete the budget item?
            </Typography>
            <Typography
              variant="subtitle"
              style={{
                textAlign: 'center',
              }}
              withEllipsis={false}
            >
              You will delete{' '}
              <span
                style={{
                  color: nexyColors.orangeyRed,
                }}
              >
                {budgetItem?.name}
              </span>{' '}
              from the budget items table.
            </Typography>
          </SuccessDialogContent>
          <BudgetItemOverviewContainer>
            <Typography variant="h4">Budget item overview</Typography>
            <SpaceBetween>
              <Typography variant="subtitle">Timeframe:</Typography>
              <Typography
                variant="subtitle"
                style={{
                  color: nexyColors.orangeyRed,
                }}
              >
                {dayjs(budgetItem?.startDate).format('DD MMM YYYY')} -{' '}
                {dayjs(budgetItem?.endDate).format('DD MMM YYYY')}
              </Typography>
            </SpaceBetween>
            <SpaceBetween>
              <Typography variant="subtitle">Budget:</Typography>
              <Typography
                variant="subtitle"
                style={{
                  color: nexyColors.orangeyRed,
                }}
              >
                <FormattedCurrency amount={budgetItem?.budgetAmount} />
              </Typography>
            </SpaceBetween>
          </BudgetItemOverviewContainer>
        </div>
      </Fade>
      <Fade in={isOpen} onExited={onClose} delay={250}>
        <NoteStyled data-cy="dialogNote">
          ⚠️{'  '} Warning: This action is irreversible and your data will be lost.
        </NoteStyled>
      </Fade>
      <Fade in={isOpen} onExited={onClose} delay={350}>
        <SuccessDialogActions>
          <ButtonAsync
            loading={loading}
            disabled={loading}
            onClick={onClose}
            variant="contained"
            id="portfolioCreateAnother"
          >
            Cancel
          </ButtonAsync>
          <ButtonAsync loading={loading} disabled={loading} onClick={handleDelete} color="danger" variant="contained">
            Delete
          </ButtonAsync>
        </SuccessDialogActions>
      </Fade>
    </Dialog>
  );
}

export { BudgetItemDeleteDialog };
