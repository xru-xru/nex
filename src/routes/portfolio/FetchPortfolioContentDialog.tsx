import dayjs from 'dayjs';
import { useState } from 'react';
import { toast } from 'sonner';

import { DateSelector, getPortfolioDateRangesForMeasurements } from 'components/DateSelector';
import Dialog from 'components/Dialog';
import ButtonIcon from 'components/ButtonIcon';
import { CancelIcon } from 'components/icons';
import Button from 'components/Button';
import ButtonAsync from 'components/ButtonAsync';
import { useRefreshPortfolioContentMeasurementsMutation } from '../../graphql/portfolio/mutationRefreshPortfolioContentMeasurements';
import { NexoyaPortfolioV2 } from 'types';
import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

interface FetchPortfolioContentDialogProps {
  portfolio: NexoyaPortfolioV2;
  isOpen: boolean;
  onClose: () => void;
}

export function FetchPortfolioContentDialog({ portfolio, isOpen, onClose }: FetchPortfolioContentDialogProps) {
  // Set default dates based on portfolio dates, falling back to last 30 days
  const getDefaultStartDate = () => {
    const thirtyDaysAgo = dayjs().subtract(30, 'day').toDate();
    const portfolioStart = portfolio?.start ? new Date(portfolio.start) : null;

    // Use the later of portfolio start or 30 days ago
    if (portfolioStart && dayjs(portfolioStart).isAfter(thirtyDaysAgo)) {
      return portfolioStart;
    }
    return thirtyDaysAgo;
  };

  const getDefaultEndDate = () => {
    const yesterday = dayjs().subtract(1, 'day').toDate();
    const portfolioEnd = portfolio?.end ? new Date(portfolio.end) : null;

    // Use the earlier of portfolio end or yesterday
    if (portfolioEnd && dayjs(portfolioEnd).isBefore(yesterday)) {
      return portfolioEnd;
    }
    return yesterday;
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  const { refreshPortfolioContentMeasurements, loading } = useRefreshPortfolioContentMeasurementsMutation({
    portfolioId: portfolio?.portfolioId,
    startDate: dayjs(startDate).format(GLOBAL_DATE_FORMAT),
    endDate: dayjs(endDate).format(GLOBAL_DATE_FORMAT),
  });

  const onFetch = async () => {
    try {
      toast.success('Started fetching portfolio content measurements');
      await refreshPortfolioContentMeasurements();
      onClose();
    } catch (error) {
      toast.error(`Failed to fetch measurements: ${error.message}`);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      position="center"
      onClose={onClose}
      paperProps={{
        style: {
          maxWidth: '662px',
          borderRadius: '12px',
        },
      }}
      backdropProps={{
        variant: 'dark',
      }}
      hideCloseButton={true}
    >
      {/* header */}
      <div className="flex justify-between border-b-[1px] px-5 py-6">
        <div className="text-xl font-medium">Fetch portfolio measurements</div>
        <ButtonIcon onClick={onClose}>
          <CancelIcon />
        </ButtonIcon>
      </div>

      {/* content */}
      <div className="flex flex-col gap-6 p-6">
        <div className="text-sm font-normal">
          Select a date range to fetch portfolio content measurements. The process may take a few minutes depending on
          the amount of data. You can continue using the application while the fetch is in progress.
        </div>
        <DateSelector
          dateFrom={startDate}
          dateTo={endDate}
          onDateChange={(dateRange) => {
            setStartDate(dateRange.from);
            setEndDate(dateRange.to);
          }}
          disableAfterDate={portfolio?.end ? new Date(portfolio.end) : new Date()}
          disableBeforeDate={portfolio?.start ? new Date(portfolio.start) : undefined}
          hideFutureQuickSelection
          dateRanges={
            portfolio?.start && portfolio?.end
              ? getPortfolioDateRangesForMeasurements(new Date(portfolio.start), new Date(portfolio.end))
              : undefined
          }
          panelProps={{
            side: 'bottom',
          }}
          style={{
            width: '100%',
          }}
        />

        <div className="text-sm font-normal">
          Once the fetch is complete, you'll be able to view the updated in the performance view.
        </div>
      </div>

      {/* actions */}
      <div className="flex gap-4 border-t-[1px] px-5 py-6">
        <Button disabled={loading} className="w-1/2" color="tertiary" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <ButtonAsync
          className="w-1/2"
          color="primary"
          variant="contained"
          disabled={loading}
          loading={loading}
          onClick={onFetch}
        >
          Start fetching
        </ButtonAsync>
      </div>
    </Dialog>
  );
}
