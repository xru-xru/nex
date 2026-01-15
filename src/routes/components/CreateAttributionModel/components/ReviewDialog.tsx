import React from 'react';
import dayjs from 'dayjs';
import ButtonAsync from '../../../../components/ButtonAsync';
import AvatarProvider from '../../../../components/AvatarProvider';
import { BasicRunState, ChannelSelection, Ga4State, TargetMetricState } from '../types';
import { NexoyaMeasurement } from '../../../../types';
import translate from '../../../../utils/translate';
import useTranslationStore from '../../../../store/translations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components-ui/AlertDialog';

type ReviewDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveForLater: () => void;
  onRunAttributionModel: () => void;
  onGoBack: () => void;
  basicRun: BasicRunState;
  ga4State: Ga4State;
  targetMetric: TargetMetricState;
  measurements: NexoyaMeasurement[];
  selectedChannels: ChannelSelection[];
  loading: boolean;
};

export function ReviewDialog({
  isOpen,
  onClose,
  onSaveForLater,
  onRunAttributionModel,
  onGoBack,
  basicRun,
  ga4State,
  targetMetric,
  measurements,
  selectedChannels,
  loading,
}: ReviewDialogProps) {
  const { translations } = useTranslationStore();
  const selectedMeasurement = measurements.find((m) => m.measurement_id === targetMetric.metricId);
  const metricName = selectedMeasurement ? translate(translations, selectedMeasurement.name) : 'Not selected';

  const visibleChannels = selectedChannels.slice(0, 3);
  const remainingChannelsCount = Math.max(0, selectedChannels.length - 3);

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <AlertDialogContent className="w-[482px] max-w-[482px] gap-0 p-0">
        <div className="px-6 py-5">
          <AlertDialogHeader className="p-0">
            <AlertDialogTitle className="text-left">Review and run attribution model</AlertDialogTitle>
          </AlertDialogHeader>
        </div>
        <div className="h-px w-full bg-[#E5E5E6]" />
        <div className="px-6 py-5 text-sm font-normal leading-[145%] text-[#131313b2]">
          The attribution model will run with the following selection:
        </div>
        <div className="mx-6 mb-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 rounded-[5px] border border-[#e3e4e8] bg-[#f8f9fa] p-3">
          <span className="text-sm font-normal leading-[145%] tracking-[0.28px] text-neutral-900">Model name:</span>
          <span className="text-sm font-medium leading-[145%] tracking-[0.28px] text-neutral-600">
            {basicRun.name}
          </span>
          <span className="text-sm font-normal leading-[145%] tracking-[0.28px] text-neutral-900">Created:</span>
          <span className="text-sm font-medium leading-[145%] tracking-[0.28px] text-neutral-600">
            {dayjs().format('D MMM, YYYY')}
          </span>
          <span className="text-sm font-normal leading-[145%] tracking-[0.28px] text-neutral-900">Timeframe:</span>
          <span className="text-sm font-medium leading-[145%] tracking-[0.28px] text-neutral-600">
            {dayjs(basicRun.start).format('D MMM YYYY')} - present
          </span>
          <div className="col-span-2 my-1.5 h-px w-full bg-[#E5E5E6]" />
          <span className="text-sm font-normal leading-[145%] tracking-[0.28px] text-neutral-900">
            Selected channels:
          </span>
          <div className="flex items-center gap-1">
            {visibleChannels.map((channel) => (
              <AvatarProvider key={channel.providerId} providerId={channel.providerId} size={20} />
            ))}
            {remainingChannelsCount > 0 && (
              <span className="text-sm font-medium text-neutral-600">+{remainingChannelsCount}</span>
            )}
          </div>
          <span className="text-sm font-normal leading-[145%] tracking-[0.28px] text-neutral-900">
            Target metric:
          </span>
          <span className="text-sm font-medium leading-[145%] tracking-[0.28px] text-neutral-600">{metricName}</span>
          {!targetMetric.skipFile && targetMetric.file && (
            <>
              <span className="text-sm font-normal leading-[145%] tracking-[0.28px] text-neutral-900">CRM upload:</span>
              <span className="text-sm font-medium leading-[145%] tracking-[0.28px] text-neutral-400">
                {targetMetric.file.name}
              </span>
            </>
          )}
          <span className="text-sm font-normal leading-[145%] tracking-[0.28px] text-neutral-900">GA4 Tracking:</span>
          <span className="text-sm font-medium leading-[145%] tracking-[0.28px] text-neutral-600">
            {ga4State.propertyId ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="mb-5 h-px w-full bg-[#E5E5E6]" />
        <AlertDialogFooter className="flex-col gap-3 px-6 pb-6 pt-0 sm:flex-col">
          <AlertDialogCancel asChild>
            <ButtonAsync
              loading={loading}
              disabled={loading}
              onClick={onSaveForLater}
              variant="contained"
              color="tertiary"
              className="w-full"
            >
              Save for later
            </ButtonAsync>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <ButtonAsync
              loading={loading}
              disabled={loading}
              onClick={onRunAttributionModel}
              color="primary"
              variant="contained"
              className="w-full"
            >
              Run attribution model
            </ButtonAsync>
          </AlertDialogAction>
          <ButtonAsync loading={loading} disabled={loading} onClick={onGoBack} variant="text" className="w-full">
            Go back
          </ButtonAsync>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
