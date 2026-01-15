import React, { useEffect, useState } from 'react';
import SidePanel from '../../../../../components/SidePanel';
import { DataTableFilterOption } from '../PortfolioRule/types';
import {
  NexoyaContentFilter,
  NexoyaFunnelStepMappingType,
  NexoyaManualContentFunnelStepMappingInput,
} from '../../../../../types';
import StepAddContents from './StepAddContents';
import StepAssignMetrics from './StepAssignMetrics';
import Button from '../../../../../components/Button';
import { useTeam } from '../../../../../context/TeamProvider';
import { useAddManualContentsToPortfolioMutation } from '../../../../../graphql/content/mutationAddManualContentsToPorfolio';
import { toast } from 'sonner';
import { useRouteMatch } from 'react-router';
import StepAssignImpactGroup from './StepAssignImpactGroup';
import SvgCheckCircle from '../../../../../components/icons/CheckCircle';
import { nexyColors } from '../../../../../theme';
import useFunnelStepsStore from '../../../../../store/funnel-steps';

enum WizardStep {
  ADD_CONTENTS = 1,
  ASSIGN_METRICS = 2,
  ASSIGN_IMPACT_GROUP = 3,
}

export function ContentEditWizard() {
  // Shared state across steps
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.ADD_CONTENTS);

  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<DataTableFilterOption[]>([]);
  const [pendingFilters, setPendingFilters] = useState<NexoyaContentFilter[]>([]);

  const [selectedImpactGroupId, setSelectedImpactGroupId] = useState<number | null>(null);
  const [funnelStepMappings, setFunnelStepMappings] = useState<
    Array<NexoyaManualContentFunnelStepMappingInput & { type: NexoyaFunnelStepMappingType }>
  >([]);

  // Side panel state
  const [isOpen, setIsOpen] = useState(false);

  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { teamId } = useTeam();
  const { funnelSteps } = useFunnelStepsStore();

  const [addManualContentsToPortfolio] = useAddManualContentsToPortfolioMutation({
    onCompleted: () => {
      toast.success('Contents added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add contents', { description: error?.message || error });
    },
  });

  useEffect(() => {
    if (!funnelStepMappings.length) {
      setFunnelStepMappings(
        funnelSteps.map((funnelStep) => ({ funnelStepId: funnelStep.funnelStepId, metricId: null, type: null })),
      );
    }
  }, [funnelSteps, isOpen]);

  const openSidePanel = () => setIsOpen(true);

  const closeSidePanel = () => {
    setIsOpen(false);
    // Reset state
    setCurrentStep(WizardStep.ADD_CONTENTS);

    setSelectedContentIds([]);
    setSelectedProviderIds([]);
    setSelectedAccountIds([]);
    setSelectedOptions([]);
    setPendingFilters([]);
    setFunnelStepMappings([]);
    setSelectedImpactGroupId(null);
  };

  // Step navigation
  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  };

  const handleComplete = () => {
    addManualContentsToPortfolio({
      variables: {
        teamId,
        portfolioId,
        collectionIds: selectedContentIds,
        impactGroupId: selectedImpactGroupId,
        funnelStepMappings: funnelStepMappings?.map((fsm) => ({
          funnelStepId: fsm.funnelStepId,
          metricId: fsm.metricId,
        })),
      },
    }).then(() => {
      closeSidePanel();
    });
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case WizardStep.ADD_CONTENTS:
        return (
          <StepAddContents
            selectedContentIds={selectedContentIds}
            setSelectedContentIds={setSelectedContentIds}
            selectedProviderIds={selectedProviderIds}
            setSelectedProviderIds={setSelectedProviderIds}
            selectedAccountIds={selectedAccountIds}
            setSelectedAccountIds={setSelectedAccountIds}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            pendingFilters={pendingFilters}
            setPendingFilters={setPendingFilters}
            onNextStep={handleNextStep}
          />
        );

      case WizardStep.ASSIGN_METRICS:
        return (
          <StepAssignMetrics
            providerIds={selectedProviderIds}
            funnelStepMappings={funnelStepMappings}
            setFunnelStepMappings={setFunnelStepMappings}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
          />
        );

      case WizardStep.ASSIGN_IMPACT_GROUP:
        return (
          <StepAssignImpactGroup
            selectedImpactGroupId={selectedImpactGroupId}
            setSelectedImpactGroupId={setSelectedImpactGroupId}
            onPreviousStep={handlePreviousStep}
            onComplete={handleComplete}
          />
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case WizardStep.ADD_CONTENTS:
        return 'Manage manual contents';
      case WizardStep.ASSIGN_METRICS:
        return 'Assign metrics to funnel steps';
      case WizardStep.ASSIGN_IMPACT_GROUP:
        return 'Assign impact group';
      default:
        return 'Manage manual contents';
    }
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={openSidePanel}>
        Add contents in manual mode
      </Button>

      <SidePanel
        isOpen={isOpen}
        onClose={closeSidePanel}
        paperProps={{ style: { width: 'calc(100% - 218px)', paddingBottom: '78px' } }}
      >
        <div className="flex w-full justify-between border border-b-[#eaeaea]">
          <div className="px-6 py-5">
            <h3 className="text-xl font-medium text-neutral-900">{getStepTitle()}</h3>
          </div>
          <div className="mr-14 flex items-center justify-end">
            <div className="flex items-center justify-center">
              {[
                { id: WizardStep.ADD_CONTENTS, title: 'Select contents' },
                { id: WizardStep.ASSIGN_METRICS, title: 'Assign metrics' },
                { id: WizardStep.ASSIGN_IMPACT_GROUP, title: 'Assign impact group' },
              ].map((step, idx) => {
                // Simple status determination
                const status = currentStep > step.id ? 'successful' : currentStep === step.id ? 'running' : 'pending';

                return (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center">
                      {status === 'successful' ? (
                        <SvgCheckCircle className="size-6" style={{ color: nexyColors.greenTeal }} />
                      ) : (
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[15px] leading-none ${status === 'running' ? 'bg-[#0EC76A] text-white' : ''} ${status === 'pending' ? 'border-2 border-solid border-[#CBCBCB] bg-white text-[#CBCBCB]' : ''} `}
                        >
                          {step.id}
                        </div>
                      )}
                      <span className="mt-2 text-center text-[9px] font-medium">{step.title}</span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`mb-[18px] h-[3.5px] w-[60px] rounded-[20px] ${status === 'successful' ? 'bg-[#0EC76A]' : ''} ${status === 'running' ? 'bg-[#0EC76A]' : ''} ${status === 'pending' ? 'bg-[#CBCBCB]' : ''} `}
                      ></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {renderCurrentStep()}
      </SidePanel>
    </>
  );
}
