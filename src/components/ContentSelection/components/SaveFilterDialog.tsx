import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';

import ButtonAsync from '../../ButtonAsync';
import TextField from '../../TextField';
import { LabelLight } from '../../InputLabel/styles';
import { useStepper } from '../../Stepper';
import Checkbox from '../../Checkbox';
import { NexoyaImpactGroup } from '../../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components-ui/Select';
import { toNumber } from 'lodash';
import { CommonRuleConfig } from '../../../routes/portfolio/components/Content/PortfolioRule/CreateOrUpdatePortfolioRule';

interface Props {
  closeDialog: () => void;
  open: boolean;
  loading: boolean;
  handleSave: (name: string) => void;
  contentsToAddLength: number;
  initialName?: string;
  config: CommonRuleConfig;
  impactGroups?: NexoyaImpactGroup[];
  setSelectedImpactGroupId?: (id: number) => void;
  selectedImpactGroupId?: number | null;
}

export const SaveFilterDialog = ({
  closeDialog,
  open,
  loading,
  handleSave,
  contentsToAddLength,
  initialName,
  config,
  impactGroups = [],
  setSelectedImpactGroupId,
  selectedImpactGroupId,
}: Props) => {
  const [name, setName] = useState(initialName);
  const [hideMessage, setHideMessage] = useState(false);

  const { step, nextStep, previousStep, resetStep } = useStepper({
    initialValue: 1,
    end: 2,
  });

  // Load the checkbox state from local storage on component mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('hideContentRuleMessage');
    if (savedPreference) {
      setHideMessage(JSON.parse(savedPreference));
    }
  }, []);

  const handleCheckboxChange = (checked: boolean) => {
    setHideMessage(checked);
    localStorage.setItem('hideContentRuleMessage', JSON.stringify(checked));
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div>
          <LabelLight>{config?.labels?.name} name</LabelLight>
          <TextField
            placeholder="Type filter name..."
            className="my-2 !w-full"
            value={name}
            name="name"
            id="content-filter-name"
            labelVariant="light"
            onChange={(e) => setName(e?.target?.value)}
          />
          {config?.type === 'impact-group-rule' && (
            <div className="mt-4">
              <LabelLight>Select Impact Group</LabelLight>
              <Select
                value={selectedImpactGroupId?.toString()}
                onValueChange={(impactGroupId) => setSelectedImpactGroupId(toNumber(impactGroupId))}
              >
                <SelectTrigger className="w-full border-neutral-100 bg-white p-2 shadow-sm">
                  <SelectValue placeholder="Select impact group" />
                </SelectTrigger>
                <SelectContent>
                  {impactGroups?.map((impactGroup) => (
                    <SelectItem key={impactGroup.impactGroupId} value={impactGroup.impactGroupId?.toString()}>
                      <span>{impactGroup.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* This could be a way to show the option to add the informational (step 2) back if the user wants it */}
          {hideMessage && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="font-normal text-neutral-400">Informational step is currently disabled</span>
              <div
                onClick={() => {
                  setHideMessage(false);
                  localStorage.removeItem('hideContentRuleMessage');
                }}
                className="cursor-pointer text-xs text-purple-400 underline opacity-50"
              >
                Enable message
              </div>
            </div>
          )}
        </div>
      );
    }

    if (step === 2) {
      return (
        <div>
          <AlertDialogDescription>
            <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
              This {config.type.replaceAll('-', ' ')} will automatically detect new discovered contents matching the
              selected channel and filters. You’ll be able to review them in{' '}
              <span className="font-medium">Portfolio settings {'>'} Discovered contents</span>.
            </span>

            <Checkbox
              label="Don't show this message again"
              className="!pl-0 !font-normal"
              checked={hideMessage}
              onChange={(_, beingChecked: boolean) => handleCheckboxChange(beingChecked)}
            />
          </AlertDialogDescription>
        </div>
      );
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {step === 1
              ? `Finish off your ${config?.labels?.name}`
              : `Save ${config?.labels?.name} and add to portfolio`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
              {step === 1
                ? 'Give your content rule a name.'
                : config.type !== 'impact-group-rule' &&
                  `${contentsToAddLength} contents will be added to the portfolio.`}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {renderStep()}
        <AlertDialogFooter>
          <AlertDialogAction>
            <ButtonAsync
              onClick={() => {
                if (step === 1) {
                  resetStep();
                  setName('');
                  closeDialog();
                } else {
                  previousStep();
                }
              }}
              disabled={loading}
              loading={loading}
              variant="contained"
              color="secondary"
              size="small"
            >
              {step === 1 ? 'Cancel' : 'Go back'}
            </ButtonAsync>
          </AlertDialogAction>

          <AlertDialogAction>
            <AlertDialogAction>
              <ButtonAsync
                data-testid="save-rule-button"
                onClick={() => {
                  if (step === 1) {
                    if (hideMessage) {
                      handleSave(name);
                      setName('');
                    } else {
                      nextStep();
                    }
                  } else {
                    handleSave(name);
                    setName('');
                  }
                }}
                disabled={
                  loading ||
                  !name ||
                  (step === 1 && name && name.length < 3) ||
                  (config.type === 'impact-group-rule' && !selectedImpactGroupId)
                }
                loading={loading}
                variant="contained"
                color="primary"
                size="small"
              >
                {config?.labels?.saveButton}
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
