import dayjs from 'dayjs';

import { DateSelector } from 'components/DateSelector';
import Dialog, { useDialogState } from 'components/Dialog';
import { RefreshCcw } from 'lucide-react';
import ButtonIcon from 'components/ButtonIcon';
import { CancelIcon } from 'components/icons';
import Button from 'components/Button';
import ButtonAsync from 'components/ButtonAsync';
import ButtonBase from 'components/ButtonBase';
import { useState } from 'react';
import Tooltip from 'components/Tooltip';
import { useSyncTeamChannelMutation } from 'graphql/portfolio/mutationSyncTeamChannel';
import { toast } from 'sonner';

export function SyncIntegrationButton({
  channelName,
  providerId,
  onSyncStarted,
}: {
  channelName: string;
  providerId: number;
  onSyncStarted: () => void;
}) {
  const { isOpen, toggleDialog } = useDialogState({
    initialState: false,
  });

  const [startDate, setStartDate] = useState(dayjs().subtract(8, 'day').toDate());
  const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day').toDate());

  const { syncTeamChannel, loading } = useSyncTeamChannelMutation({ providerId, from: startDate, to: endDate });

  const onSync = async () => {
    try {
      await syncTeamChannel();
      toggleDialog();
      toast.success('Sync started successfully');
      onSyncStarted();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Tooltip placement="bottom" size="small" variant="dark" content="Fetch latest channel data" data-cy="editToolTip">
        <div>
          <ButtonBase
            onClick={() => {
              toggleDialog();
            }}
          >
            <div className="inline-flex h-5 w-5 items-center justify-between"></div>
            <RefreshCcw className="h-4 w-4 text-neutral-300" />
          </ButtonBase>
        </div>
      </Tooltip>

      <Dialog
        isOpen={isOpen}
        position="center"
        onClose={toggleDialog}
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
          <div className="text-xl font-medium">Sync {channelName} channel</div>
          <ButtonIcon onClick={toggleDialog}>
            <CancelIcon />
          </ButtonIcon>
        </div>

        {/* content */}
        <div className="flex flex-col gap-6 p-6">
          <div className="text-sm font-normal">
            Select a date range to fetch data from {channelName}. The sync process may take a few minutes depending on
            the amount of data. You can continue using the application while the sync is in progress.
          </div>
          <DateSelector
            dateFrom={startDate}
            dateTo={endDate}
            onDateChange={(dateRange) => {
              setStartDate(dateRange.from);
              setEndDate(dateRange.to);
            }}
            disableAfterDate={new Date()}
            hideFutureQuickSelection
            panelProps={{
              side: 'bottom',
            }}
            style={{
              width: '100%',
            }}
          />

          <div className="text-sm font-normal">
            Once the sync is complete, you’ll receive a Slack notification and be able to view the updated data in your
            dashboard.
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-4 border-t-[1px] px-5 py-6">
          <Button disabled={loading} className="w-1/2" color="tertiary" variant="contained" onClick={toggleDialog}>
            Cancel
          </Button>
          <ButtonAsync
            className="w-1/2"
            color="primary"
            variant="contained"
            disabled={loading}
            loading={loading}
            onClick={onSync}
          >
            Start syncing
          </ButtonAsync>
        </div>
      </Dialog>
    </>
  );
}
