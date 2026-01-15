import dayjs from 'dayjs';
import styled from 'styled-components';

import { usePortfolio } from '../../../../context/PortfolioProvider';

import FormattedCurrency from '../../../../components/FormattedCurrency';
import Button from 'components/Button';
import Dialog from 'components/Dialog';
import Fade from 'components/Fade';
import Typography from 'components/Typography';

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

const LaunchOptimizationOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
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
  timeframe: { start: Date; end: Date };
  plannedBudget: number;
  isOpen: boolean;
  onClose: () => void;
  isTargetPortfolio: boolean;
};

export const LaunchOptimizationSuccessDialog = ({
  timeframe,
  isOpen,
  onClose,
  plannedBudget,
  isTargetPortfolio,
}: Props) => {
  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

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
          borderRadius: 12,
        },
      }}
    >
      <Fade in={isOpen} onExited={onClose} delay={350}>
        <div style={{ padding: '32px 32px 0 32px' }}>
          <SuccessDialogContent data-cy="portfolioSuccessContent">
            <span
              role="img"
              aria-label="success confetti emoji"
              style={{
                fontSize: 48,
                marginBottom: 8,
              }}
            >
              🎉
            </span>
            <Typography
              variant="h1"
              component="h2"
              withEllipsis={false}
              style={{
                textAlign: 'center',
                width: '80%',
              }}
            >
              Your optimization has been launched
            </Typography>
            <Typography
              variant="subtitle"
              style={{
                textAlign: 'center',
                width: '75%',
              }}
              withEllipsis={false}
            >
              We’ll notify you as soon as the optimization is ready, which might take up to{' '}
              <span style={{ color: '#0EC76A' }}>~4hours</span>
            </Typography>
          </SuccessDialogContent>
          <LaunchOptimizationOverviewContainer>
            <Typography variant="h4">Optimization overview</Typography>
            <SpaceBetween>
              <Typography variant="subtitle">Timeframe:</Typography>
              <Typography
                variant="subtitle"
                style={{
                  color: nexyColors.greenTeal,
                }}
              >
                {dayjs(timeframe.start).startOf('d').format('DD MMM YYYY')} -{' '}
                {dayjs(timeframe.end).endOf('d').format('DD MMM YYYY')}
              </Typography>
            </SpaceBetween>
            <SpaceBetween>
              <Typography variant="subtitle">Optimizing for:</Typography>
              <Typography
                variant="subtitle"
                style={{
                  color: nexyColors.greenTeal,
                }}
              >
                {portfolioMeta?.defaultOptimizationTarget?.title || ''}
              </Typography>
            </SpaceBetween>
            {!isTargetPortfolio ? (
              <SpaceBetween>
                <Typography variant="subtitle">Planned budget:</Typography>
                <Typography
                  variant="subtitle"
                  style={{
                    color: nexyColors.greenTeal,
                  }}
                >
                  <FormattedCurrency amount={plannedBudget} />
                </Typography>
              </SpaceBetween>
            ) : null}
          </LaunchOptimizationOverviewContainer>
        </div>
      </Fade>

      <Fade in={isOpen} onExited={onClose} delay={600}>
        <SuccessDialogActions>
          <Button onClick={onClose} variant="contained" id="portfolioCreateAnother">
            Dismiss
          </Button>
          <Button onClick={onClose} color="primary" variant="contained">
            Got it
          </Button>
        </SuccessDialogActions>
      </Fade>
    </Dialog>
  );
};
