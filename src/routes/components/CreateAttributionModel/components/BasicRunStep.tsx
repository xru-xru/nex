import React from 'react';
import { DateSelector } from '../../../../components/DateSelector';
import { Input } from '../../../../components-ui/Input';
import { BasicRunState } from '../types';
import { READABLE_FORMAT } from '../../../../utils/dates';

type BasicRunStepProps = {
  basicRun: BasicRunState;
  onNameChange: (value: string) => void;
  onDateRangeChange: ({ start }: { start?: Date }) => void;
};

export function BasicRunStep({ basicRun, onNameChange, onDateRangeChange }: BasicRunStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium text-neutral-800">Name</label>
          <Input
            placeholder="Name your model run"
            value={basicRun.name}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-lg font-medium text-neutral-800">Application timeframe</span>
            <p className="text-sm font-normal text-neutral-400">
              Choose when the attribution model should run. The end date stays on “present” to keep the run
              auto-updated.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase text-neutral-500">Start date</span>
              <DateSelector
                hidePastQuickSelection
                hideFutureQuickSelection
                isSingleDate
                placeholder="Select start date"
                dateFrom={basicRun.start}
                dateTo={null}
                disableAfterDate={new Date()}
                format={READABLE_FORMAT}
                showSingleDateSwitcher={false}
                panelProps={{
                  side: 'bottom',
                  align: 'start',
                }}
                style={{ width: '100%' }}
                onDateChange={({ singleDate }) => {
                  onDateRangeChange({ start: singleDate });
                }}
              />
              <span className="ml-1 text-xs font-normal text-neutral-300">
                The start date must be before the current date.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase text-neutral-500">End date</span>
              <div className="flex h-10 items-center rounded-md border border-neutral-100 bg-neutral-50 px-3 text-sm text-neutral-400">
                Present (auto-updated)
              </div>
              <span className="ml-1 text-xs font-normal text-neutral-300">
                The end date is set to “today” and updates automatically.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
