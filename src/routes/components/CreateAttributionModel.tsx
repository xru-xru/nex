import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useDropzone } from 'react-dropzone';
import { useLazyQuery } from '@apollo/client';
import { startCase, toNumber } from 'lodash';
import { toast } from 'sonner';

import SidePanel, { SidePanelContent } from '../../components/SidePanel';
import SidePanelActions from '../../components/SidePanel/SidePanelActions';
import { StepperWrapper, StepWrapper } from '../portfolios/CreatePortfolio';
import VerticalStepper from '../../components/VerticalStepper';
import Button from '../../components/Button';
import ButtonAsync from '../../components/ButtonAsync';
import { useIntegrationQuery } from '../../graphql/integration/queryIntegration';
import { useIntegrationsQuery } from '../../graphql/integration/queryIntegrations';
import { useFunnelStepUtmMapping } from '../../graphql/portfolio/queryFunnelStepUtmMapping';
import { useMeasurementsPgQuery } from '../../graphql/measurement/queryMeasurementsPg';
import { useTeam } from '../../context/TeamProvider';
import { uploadFileToAttributionModel } from '../../utils/attributionModelFileUpload';
import { DataTableFilterOption } from '../portfolio/components/Content/PortfolioRule/types';
import { AVAILABLE_FIELDS_AND_OPERATIONS_QUERY } from '../../graphql/portfolioRules/queryAvailableFieldsAndOperations';
import {
  formatFileSize,
  transformChannelSelectionsToFilters,
  transformFieldOptions,
  transformGa4StateToFilters,
  transformIntegrationsToChannels,
} from '../../utils/attributionModel';
import {
  NexoyaFieldOperation,
  NexoyaFunnelStepUtmMappingParams,
  NexoyaMeasurement,
  NexoyaMeasurementEdges,
} from '../../types';
import { GLOBAL_DATE_FORMAT } from '../../utils/dates';
import {
  BasicRunState,
  ChannelAccount,
  ChannelSelection,
  Ga4State,
  TargetMetricState,
} from './CreateAttributionModel/types';
import { BasicRunStep } from './CreateAttributionModel/components/BasicRunStep';
import { AvailableChannel, ChannelSelectionStep } from './CreateAttributionModel/components/ChannelSelectionStep';
import { Ga4Step } from './CreateAttributionModel/components/Ga4Step';
import { TargetStep } from './CreateAttributionModel/components/TargetStep';
import { ReviewDialog } from './CreateAttributionModel/components/ReviewDialog';
import { EXPORT_LEVEL_OPTIONS, GA4_INTEGRATION_ID, WIZARD_STEPS } from '../../constants/createAttributionModel';
import { useCreateAttributionModelMutation } from '../../graphql/attributionModel/mutationCreateAttributionModel';

export interface CreateAttributionModelProps {
  isOpen: boolean;
  onClose: () => void;
  onReopen?: () => void;
  onCreated?: () => void;
}

export const CreateAttributionModel: React.FC<CreateAttributionModelProps> = ({
  isOpen,
  onClose,
  onReopen,
  onCreated,
}) => {
  const { teamId } = useTeam();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [basicRun, setBasicRun] = useState<BasicRunState>({
    name: '',
    start: null,
  });
  const [channelSelections, setChannelSelections] = useState<Record<number, ChannelSelection>>({});
  const [openFilterPopoverProviderId, setOpenFilterPopoverProviderId] = useState<number | null>(null);
  const [ga4State, setGa4State] = useState<Ga4State>({
    propertyId: '',
    propertyLabel: '',
    dimensions: [],
    metricIds: [],
  });
  const [targetMetric, setTargetMetric] = useState<TargetMetricState>({ metricId: null, file: null, skipFile: false });
  const [isUploading, setIsUploading] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const isReturningFromReviewRef = useRef(false);
  const hasAutoSelectedChannelsRef = useRef(false);

  const { data: ga4IntegrationData } = useIntegrationQuery({
    integrationId: GA4_INTEGRATION_ID,
    withFilters: true,
    withConnection: true,
    skip: !isOpen,
  });

  const { data: utmMappingData } = useFunnelStepUtmMapping();
  const { data: integrationsData, loading: integrationsLoading } = useIntegrationsQuery({
    withConnection: true,
    withFilters: true,
  });

  const { data: measurementsData } = useMeasurementsPgQuery({
    first: 500,
  });
  const measurements = useMemo(() => {
    const edges = measurementsData?.measurements?.edges;
    if (!edges) return [];
    return edges.map((edge: NexoyaMeasurementEdges) => edge.node).filter((node): node is NexoyaMeasurement => Boolean(node));
  }, [measurementsData]);

  const [loadAvailableFieldsAndOperations, { loading: loadingAvailableFields }] = useLazyQuery(
    AVAILABLE_FIELDS_AND_OPERATIONS_QUERY,
    {
      onError: (error) => {
        toast.error('Failed to load available filters. Please try again.');
        // eslint-disable-next-line no-console
        console.error(error);
      },
    },
  );

  const [createAttributionModel, { loading: creating }] = useCreateAttributionModelMutation();

  useEffect(() => {
    if (isOpen && !isReturningFromReviewRef.current) {
      setBasicRun({
        name: '',
        start: null,
      });
      setChannelSelections({});
      setOpenFilterPopoverProviderId(null);
      setGa4State({
        propertyId: '',
        propertyLabel: '',
        dimensions: [],
        metricIds: [],
      });
      setTargetMetric({ metricId: null, file: null, skipFile: false });
      setCurrentStepIndex(0);
      setIsUploading(false);
      hasAutoSelectedChannelsRef.current = false;
    }
    // Reset the flag after handling
    if (isReturningFromReviewRef.current) {
      isReturningFromReviewRef.current = false;
    }
  }, [isOpen]);

  const availableChannels = useMemo<AvailableChannel[]>(() => {
    return transformIntegrationsToChannels(integrationsData);
  }, [integrationsData]);

  const channelsMapByProviderId = useMemo(() => {
    return availableChannels.reduce<Record<number, (typeof availableChannels)[number]>>((acc, channel) => {
      acc[channel.providerId] = channel;
      return acc;
    }, {});
  }, [availableChannels]);

  // Auto-select all channels and all their accounts by default when component opens
  // Only auto-select once per dialog session to prevent overwriting user selections
  useEffect(() => {
    if (
      isOpen &&
      availableChannels.length > 0 &&
      Object.keys(channelSelections).length === 0 &&
      !hasAutoSelectedChannelsRef.current
    ) {
      const initialSelections: Record<number, ChannelSelection> = {};

      availableChannels.forEach((channel) => {
        const allAccountIds = channel.accounts.map((account) => account.id);
        initialSelections[channel.providerId] = {
          providerId: channel.providerId,
          providerName: channel.providerName,
          providerLogo: channel.providerLogo,
          integrationId: channel.integrationId,
          accounts: channel.accounts,
          selectedAccountIds: allAccountIds,
          exportLevel: EXPORT_LEVEL_OPTIONS[0].value,
          filters: [],
          fields: [],
          shouldFetch: false,
        };
      });

      setChannelSelections(initialSelections);
      hasAutoSelectedChannelsRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, availableChannels]);

  const selectedChannelsList = useMemo<ChannelSelection[]>(() => Object.values(channelSelections), [channelSelections]);

  const ensureFieldsLoaded = useCallback(
    (providerId: number) => {
      // Use functional update to check current state
      let shouldLoad = false;
      setChannelSelections((prev) => {
        const current = prev[providerId];
        if (!current || current.fields.length > 0) {
          shouldLoad = false;
          return prev;
        }
        shouldLoad = true;
        return prev;
      });

      if (!shouldLoad) return;

      loadAvailableFieldsAndOperations({
        variables: { providerId },
      })
        .then((response) => {
          const availableFields: NexoyaFieldOperation[] = response.data?.availableFieldOperations ?? [];
          const transformed = transformFieldOptions(availableFields) ?? [];
          setChannelSelections((prevState) => {
            const existing = prevState[providerId];
            if (!existing || existing.fields.length > 0) return prevState;
            return {
              ...prevState,
              [providerId]: {
                ...existing,
                fields: transformed,
              },
            };
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [loadAvailableFieldsAndOperations],
  );

  // Load fields for any channel that doesn't have fields loaded yet
  useEffect(() => {
    Object.values(channelSelections).forEach((channel) => {
      if (channel && channel.fields.length === 0) {
        ensureFieldsLoaded(channel.providerId);
      }
    });
  }, [channelSelections, ensureFieldsLoaded]);

  const setChannelFiltersForProvider = useCallback(
    (providerId: number): Dispatch<SetStateAction<DataTableFilterOption[]>> =>
      (valueOrUpdater) => {
        setChannelSelections((prev) => {
          const existing = prev[providerId];
          if (!existing) return prev;
          const nextFilters =
            typeof valueOrUpdater === 'function' ? valueOrUpdater(existing.filters) : valueOrUpdater;
          return {
            ...prev,
            [providerId]: {
              ...existing,
              filters: nextFilters,
            },
          };
        });
      },
    [],
  );

  const handleAddChannelAccount = useCallback(
    (providerId: number, accountId: string) => {
      setChannelSelections((prev) => {
        const channel = channelsMapByProviderId[providerId];
        if (!channel) return prev;

        const existing = prev[providerId];
        const selectedAccountIds = existing ? existing.selectedAccountIds : [];
        const hasAccount = selectedAccountIds.includes(accountId);
        const nextSelected = hasAccount
          ? selectedAccountIds.filter((id) => id !== accountId)
          : [...selectedAccountIds, accountId];

        if (nextSelected.length === 0) {
          const { [providerId]: _, ...rest } = prev;
          return rest;
        }

        const baseSelection: ChannelSelection = existing ?? {
          providerId: channel.providerId,
          providerName: channel.providerName,
          providerLogo: channel.providerLogo,
          integrationId: channel.integrationId,
          accounts: channel.accounts,
          selectedAccountIds: [],
          exportLevel: EXPORT_LEVEL_OPTIONS[0].value,
          filters: [],
          fields: [],
          shouldFetch: false,
        };

        return {
          ...prev,
          [providerId]: {
            ...baseSelection,
            selectedAccountIds: nextSelected,
          },
        };
      });
    },
    [channelsMapByProviderId],
  );

  const handleRemoveProvider = useCallback((providerId: number) => {
    setChannelSelections((prev) => {
      const { [providerId]: _, ...rest } = prev;
      return rest;
    });
    setOpenFilterPopoverProviderId((prev) => (prev === providerId ? null : prev));
  }, []);

  const handleSelectAllAccounts = useCallback((providerId: number) => {
    setChannelSelections((prev) => {
      const existing = prev[providerId];
      if (!existing) return prev;

      const allAccountIds = existing.accounts.map((account) => account.id);
      const isAllSelected = existing.selectedAccountIds.length === allAccountIds.length;

      return {
        ...prev,
        [providerId]: {
          ...existing,
          selectedAccountIds: isAllSelected ? [] : allAccountIds,
        },
      };
    });
  }, []);

  const openFiltersForProvider = useCallback(
    (providerId: number) => {
      // Fields should already be loaded when channel was selected, but ensure they're loaded as a safety check
      ensureFieldsLoaded(providerId);
      setOpenFilterPopoverProviderId(null);
    },
    [ensureFieldsLoaded],
  );

  const markFilterPopoverOpen = useCallback((providerId: number) => {
    setOpenFilterPopoverProviderId(providerId);
  }, []);

  const ga4PropertyOptions = useMemo(() => {
    const filterOptions = ga4IntegrationData?.integration?.filterOptions ?? [];
    const propertyOption = filterOptions.find((option) => option.filterName?.toLowerCase() === 'property');
    const properties =
      propertyOption?.filterList
        ?.filter((item) => item?.selected)
        ?.map((item) => {
          const rawId = item?.id ?? '';
          const [_, propertyPath] = rawId.split(';');
          const propertyId = propertyPath?.split('/')?.[1] ?? rawId;
          return {
            id: propertyId,
            label: (item?.itemInfo ?? []).filter(Boolean).join(' — ') || propertyId,
          };
        }) ?? [];
    return properties;
  }, [ga4IntegrationData?.integration?.filterOptions]);

  useEffect(() => {
    if (!ga4State.propertyId && ga4PropertyOptions.length > 0) {
      setGa4State((prev) => ({
        ...prev,
        propertyId: ga4PropertyOptions[0].id,
        propertyLabel: ga4PropertyOptions[0].label,
      }));
    }
  }, [ga4PropertyOptions, ga4State.propertyId]);

  const utmDimensionOptions = useMemo(() => {
    const params = utmMappingData?.listFunnelStepUtmMappingParams;
    const mappingNames = params?.map((param: NexoyaFunnelStepUtmMappingParams) => param.name) ?? [];
    const combined = new Set<string>(mappingNames.concat(['eventName']));
    return Array.from(combined);
  }, [utmMappingData]);

  const handleDateRangeChange = useCallback(({ start }: { start?: Date }) => {
    if (!start) return;
    setBasicRun((prev) => ({
      ...prev,
      start: start,
    }));
  }, []);

  const handleAddDimension = useCallback(() => {
    setGa4State((prev) => {
      if (prev.dimensions.length >= 5) return prev;
      return {
        ...prev,
        dimensions: [...prev.dimensions, { value: '' }],
      };
    });
  }, []);

  const handleUpdateDimension = useCallback((index: number, value: string) => {
    setGa4State((prev) => {
      const newDimensions = [...prev.dimensions];
      newDimensions[index] = { value };
      return {
        ...prev,
        dimensions: newDimensions,
      };
    });
  }, []);

  const handleDeleteDimension = useCallback((index: number) => {
    setGa4State((prev) => {
      // Don't allow deleting if it's the only dimension or if it's eventName
      if (prev.dimensions.length <= 1) return prev;
      if (prev.dimensions[index].value === 'eventName') return prev;
      return {
        ...prev,
        dimensions: prev.dimensions.filter((_, i) => i !== index),
      };
    });
  }, []);

  const handleTargetMetricChange = useCallback((metricId: number | null) => {
    setTargetMetric((prev) => ({ ...prev, metricId }));
  }, []);

  const handleTargetMetricFile = useCallback((file: File | null) => {
    setTargetMetric((prev) => ({ ...prev, file, skipFile: false }));
  }, []);

  const handleReplaceFile = useCallback(() => {
    handleTargetMetricFile(null);
  }, [handleTargetMetricFile]);

  const handleSkipFileChange = useCallback((skip: boolean) => {
    setTargetMetric((prev) => ({ ...prev, skipFile: skip, file: skip ? null : prev.file }));
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    maxSize: 1024 * 1024 * 50, // 50 MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleTargetMetricFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const reason = fileRejections[0]?.errors?.[0]?.message ?? 'Unsupported file';
      toast.error(reason);
    },
    noClick: true,
  });

  const isBasicStepValid = useMemo(
    () => Boolean(basicRun.name.trim() && basicRun.start),
    [basicRun.name, basicRun.start],
  );

  const isChannelsStepValid = useMemo(
    () =>
      selectedChannelsList.length > 0 &&
      selectedChannelsList.every((channel) => channel.selectedAccountIds.length > 0),
    [selectedChannelsList],
  );

  const isGa4StepValid = useMemo(() => {
    if (!ga4IntegrationData?.integration?.connected) return true;
    return Boolean(
      ga4State.propertyId &&
        ga4State.dimensions.length > 0 &&
        ga4State.dimensions.every((d) => d.value && d.value.trim() !== ''),
    );
  }, [ga4IntegrationData?.integration?.connected, ga4State.propertyId, ga4State.dimensions]);

  const isTargetStepValid = useMemo(
    () => Boolean(targetMetric.metricId && (targetMetric.skipFile || targetMetric.file)),
    [targetMetric.metricId, targetMetric.skipFile, targetMetric.file],
  );

  const isReviewValid = useMemo(
    () => isBasicStepValid && isChannelsStepValid && isGa4StepValid && isTargetStepValid,
    [isBasicStepValid, isChannelsStepValid, isGa4StepValid, isTargetStepValid],
  );

  const isCurrentStepValid = useMemo(() => {
    const stepId = WIZARD_STEPS[currentStepIndex].id;
    switch (stepId) {
      case 'basic':
        return isBasicStepValid;
      case 'channels':
        return isChannelsStepValid;
      case 'ga4':
        return isGa4StepValid;
      case 'target':
        return isTargetStepValid;
      default:
        return false;
    }
  }, [currentStepIndex, isBasicStepValid, isChannelsStepValid, isGa4StepValid, isTargetStepValid]);

  const handleClose = () => {
    setIsReviewDialogOpen(false);
    onClose();
  };

  const submitAttributionModel = async (successMessage: string) => {
    const channelFilters = transformChannelSelectionsToFilters(selectedChannelsList);
    const ga4Filters = transformGa4StateToFilters(ga4State);
    const exportStart = dayjs(basicRun.start).format(GLOBAL_DATE_FORMAT);

    const response = await createAttributionModel({
      variables: {
        channelFilters,
        exportStart,
        ga4Filters,
        name: basicRun.name,
        targetMetric: targetMetric.metricId?.toString() || '',
        teamId,
      },
    });

    const attributionModelId = response?.data?.createAttributionModel?.attributionModelId;
    if (!attributionModelId) {
      toast.error('Unable to create attribution model. Please try again.');
      return;
    }

    if (!targetMetric.skipFile && targetMetric.file) {
      setIsUploading(true);
      const uploadResult = await uploadFileToAttributionModel({
        teamId,
        attributionModelId,
        file: targetMetric.file,
      });

      if (!uploadResult.success) {
        toast.error('Attribution model created, but uploading the target metric file failed.');
        setIsUploading(false);
        return;
      }
    }

    toast.success(successMessage);
    setIsReviewDialogOpen(false);
    onCreated?.();
    handleClose();
  };

  const handleSubmit = async () => {
    if (!isReviewValid || creating || isUploading) return;
    try {
      await submitAttributionModel('Attribution model run created successfully');
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to create attribution model run', error);
      toast.error('Failed to create attribution model. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (currentStepIndex === WIZARD_STEPS.length - 1) {
      // On the last step, show the review dialog and close the main panel
      if (!isCurrentStepValid) {
        return;
      }
      setIsReviewDialogOpen(true);
      onClose(); // Close the main panel
      return;
    }

    if (!isCurrentStepValid) {
      return;
    }

    setCurrentStepIndex((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1));
  };

  const handleBack = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleNameChange = useCallback((value: string) => {
    setBasicRun((prev) => ({ ...prev, name: value }));
  }, []);

  const renderCurrentStep = useCallback(() => {
    const stepId = WIZARD_STEPS[currentStepIndex].id;

    switch (stepId) {
      case 'basic':
        return (
          <BasicRunStep
            basicRun={basicRun}
            onNameChange={handleNameChange}
            onDateRangeChange={handleDateRangeChange}
          />
        );
      case 'channels':
        return (
          <ChannelSelectionStep
            integrationsLoading={integrationsLoading}
            availableChannels={availableChannels}
            selectedChannels={selectedChannelsList}
            openFilterPopoverProviderId={openFilterPopoverProviderId}
            loadingAvailableFields={loadingAvailableFields}
            onAddChannelAccount={handleAddChannelAccount}
            onSelectAllAccounts={handleSelectAllAccounts}
            onRemoveChannel={handleRemoveProvider}
            onOpenFilters={openFiltersForProvider}
            onMarkFilterPopoverOpen={markFilterPopoverOpen}
            getFiltersDispatch={setChannelFiltersForProvider}
          />
        );
      case 'ga4':
        return (
          <Ga4Step
            ga4State={ga4State}
            utmDimensionOptions={utmDimensionOptions}
            isGa4Connected={ga4IntegrationData?.integration?.connected ?? false}
            onAddDimension={handleAddDimension}
            onUpdateDimension={handleUpdateDimension}
            onDeleteDimension={handleDeleteDimension}
          />
        );
      case 'target':
        return (
          <TargetStep
            targetMetric={targetMetric}
            measurements={measurements}
            isUploading={isUploading}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            onMetricChange={handleTargetMetricChange}
            onReplaceFile={handleReplaceFile}
            onBrowseFile={openFileDialog}
            onSkipFileChange={handleSkipFileChange}
            formatFileSize={formatFileSize}
          />
        );
      default:
        return null;
    }
  }, [
    currentStepIndex,
    basicRun,
    handleNameChange,
    handleDateRangeChange,
    integrationsLoading,
    availableChannels,
    selectedChannelsList,
    openFilterPopoverProviderId,
    loadingAvailableFields,
    handleAddChannelAccount,
    handleSelectAllAccounts,
    handleRemoveProvider,
    openFiltersForProvider,
    markFilterPopoverOpen,
    setChannelFiltersForProvider,
    ga4State,
    utmDimensionOptions,
    ga4IntegrationData?.integration?.connected,
    handleAddDimension,
    handleUpdateDimension,
    handleDeleteDimension,
    targetMetric,
    measurements,
    isUploading,
    getRootProps,
    getInputProps,
    isDragActive,
    handleTargetMetricChange,
    handleReplaceFile,
    openFileDialog,
    handleSkipFileChange,
  ]);

  const disableNext = !isCurrentStepValid || creating || isUploading;

  const handleReviewDialogClose = () => {
    setIsReviewDialogOpen(false);
  };

  const handleReviewDialogGoBack = () => {
    setIsReviewDialogOpen(false);
    // Set flag to prevent state reset when reopening
    isReturningFromReviewRef.current = true;
    // Reopen the main panel and go back to the last step (target step)
    if (onReopen) {
      onReopen();
    }
    // Ensure we're on the last step (target step)
    setCurrentStepIndex(WIZARD_STEPS.length - 1);
  };

  const handleReviewDialogSaveForLater = async () => {
    // Save for later - create the model but don't run it
    // Only require basic step to be valid for save for later
    if (!isBasicStepValid || creating || isUploading) return;

    try {
      await submitAttributionModel('Attribution model saved successfully');
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to save attribution model', error);
      toast.error('Failed to save attribution model. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveForLater = () => {
    // Open review dialog when clicking "Save for later" button
    // Only require basic step to be valid
    if (!isBasicStepValid) {
      return;
    }
    setIsReviewDialogOpen(true);
    onClose(); // Close the main panel
  };

  return (
    <>
      <SidePanel
        isOpen={isOpen}
        onClose={handleClose}
        paperProps={{
          style: {
            width: 'calc(100% - 218px)',
            paddingBottom: '78px',
          },
        }}
      >
        <div className="border-b border-neutral-100 px-8 py-6">
          <h3 className="text-xl font-medium text-neutral-900">Create attribution model run</h3>
        </div>

        <SidePanelContent className="!p-0">
          <StepperWrapper className="!w-[24%] border-r-[1px] border-[#EAEAEA] p-6">
            <VerticalStepper
              className="max-w-80 !p-0"
              current={currentStepIndex + 1}
              steps={WIZARD_STEPS.map((step) => ({
                id: step.id,
                name: step.title,
                description: step.description,
              }))}
            />
          </StepperWrapper>
          <StepWrapper className="px-8 py-10">{renderCurrentStep()}</StepWrapper>
        </SidePanelContent>

        <SidePanelActions className="flex items-center justify-between border-t border-neutral-100 bg-white">
          <Button
            id="cancel"
            variant="contained"
            onClick={handleBack}
            color="tertiary"
            disabled={creating || isUploading || currentStepIndex === 0}
          >
            Previous step
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveForLater}
              disabled={!isBasicStepValid || creating || isUploading}
            >
              Save for later
            </Button>

            <ButtonAsync
              id="next-step"
              variant="contained"
              color="primary"
              onClick={handleNext}
              loading={creating || isUploading}
              disabled={disableNext}
            >
              Next step
            </ButtonAsync>
          </div>
        </SidePanelActions>
      </SidePanel>

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={handleReviewDialogClose}
        onSaveForLater={handleReviewDialogSaveForLater}
        onRunAttributionModel={handleSubmit}
        onGoBack={handleReviewDialogGoBack}
        basicRun={basicRun}
        ga4State={ga4State}
        targetMetric={targetMetric}
        measurements={measurements}
        selectedChannels={selectedChannelsList}
        loading={creating || isUploading}
      />
    </>
  );
};
