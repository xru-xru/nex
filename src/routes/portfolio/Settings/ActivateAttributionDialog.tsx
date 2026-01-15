import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components-ui/Select';
import { Input } from '../../../components-ui/Input';
import useFunnelStepsStore from '../../../store/funnel-steps';
import { NexoyaFunnelStepType } from '../../../types';
import { toNumber } from 'lodash';
import Button from '../../../components/Button';
import SvgPortfolioDuotone from '../../../components/icons/PortfolioDuotone';
import { Copy } from 'lucide-react';
import ButtonAsync from '../../../components/ButtonAsync';
import { cn } from '../../../lib/utils';

const ATTRIBUTION_OPTIONS = [
  {
    id: 'duplicate_portfolio',
    title: 'Duplicated portfolio',
    disabled: false,
    description: (
      <div>
        This operation will duplicate the current portfolio to a new portfolio.
        <br />
        <br />A new attributed funnel step will be created on the duplicated portfolio, which will be set as the
        portfolio target.
      </div>
    ),
    icon: (
      <div className="relative">
        <SvgPortfolioDuotone className="size-10" />
        <Copy className="absolute right-[-2px] top-[-2px] size-3.5 overflow-visible rounded-full bg-[#F0EDFD] p-0.5 text-[#674CED]" />
      </div>
    ),
  },
];

export const ActivateAttributionDialog = ({
  open,
  close,
  loading,
  handleCancel,
  handleConfirm,
}: {
  open: boolean;
  close: (open: boolean) => void;
  loading: boolean;
  handleCancel: () => void;
  handleConfirm: ({
    createCopy,
    measuredFunnelStepId,
    attributedFunnelStepTitle,
  }: {
    createCopy: boolean;
    measuredFunnelStepId: number;
    attributedFunnelStepTitle: string;
  }) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedFunnelStep, setSelectedFunnelStep] = useState<number | null>(null);
  const [newFunnelStepName, setNewFunnelStepName] = useState<string | null>(null);
  const { funnelSteps } = useFunnelStepsStore();

  return (
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent className="max-w-3xl bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-neutral-800">Configure and activate attribution model</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="font-normal">
          Select where to activate the attribution model and the funnel step to measure.
        </AlertDialogDescription>

        <div className="flex flex-col gap-8 py-4">
          <div className="flex items-stretch gap-4">
            {ATTRIBUTION_OPTIONS.map((option) => (
              <div
                key={option.id}
                onClick={() => {
                  if (option.disabled) return;

                  setSelectedOption(option.id);
                }}
                style={{
                  flex: '1 1 150px',
                  boxShadow: selectedOption === option.id ? 'none' : '0 1px 3px 0 rgba(42, 43, 46, 0.10)',
                }}
                className={cn(
                  'flex w-full cursor-pointer flex-col items-center gap-4 rounded-[5px] border border-[#ECEDF0] pb-6 pl-[14px] pr-[14px] pt-6 text-center transition-all duration-200 ease-in-out',
                  selectedOption === option.id ? 'bg-neutral-50' : 'bg-white hover:bg-neutral-50',
                  option.disabled ? 'cursor-not-allowed opacity-50' : '',
                )}
              >
                {option.icon}
                <div className="text-center text-lg font-medium text-neutral-900">{option.title}</div>
                <div className="text-sm font-normal text-neutral-300">{option.description}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="text-md text-sm font-medium text-neutral-800">Measured funnel step</div>
              <Select onValueChange={(funnelStepId) => setSelectedFunnelStep(toNumber(funnelStepId))}>
                <SelectTrigger className="mt-1 border-neutral-100 bg-white text-neutral-800">
                  <SelectValue placeholder="Select funnel step" />
                </SelectTrigger>
                <SelectContent>
                  {funnelSteps
                    .filter((funnelStep) => funnelStep.type !== NexoyaFunnelStepType.Cost)
                    .map((funnelStep) => (
                      <SelectItem key={funnelStep?.funnelStepId} value={funnelStep?.funnelStepId?.toString()}>
                        {funnelStep?.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-md text-sm font-medium text-neutral-800">New attributed funnel step name</div>

              <Input
                id="new-funnel-step-name"
                value={newFunnelStepName}
                onChange={(event) => setNewFunnelStepName(event.target.value)}
                placeholder={
                  selectedFunnelStep
                    ? `Enter the name for the new funnel step, e.g. “Attributed ${funnelSteps?.find((fs) => fs.funnelStepId === selectedFunnelStep)?.title}"`
                    : 'Enter the name for the new funnel step.'
                }
                className="mt-1 border-neutral-100 bg-white text-neutral-800"
              />
              <p className="mt-2 text-sm text-neutral-400">
                This step will be generated and added to the portfolio funnel.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <Button size="small" variant="contained" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <ButtonAsync
            disabled={!newFunnelStepName || !selectedFunnelStep || !selectedOption || loading}
            color="primary"
            variant="contained"
            size="small"
            loading={loading}
            onClick={() =>
              handleConfirm({
                createCopy: selectedOption === 'duplicate_portfolio',
                measuredFunnelStepId: selectedFunnelStep,
                attributedFunnelStepTitle: newFunnelStepName,
              })
            }
          >
            Confirm activation
          </ButtonAsync>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
