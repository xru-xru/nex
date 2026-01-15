import React, { FC, useEffect, useRef, useState } from 'react';
import { concat, toNumber } from 'lodash';
import { toast } from 'sonner';
import { useLazyQuery } from '@apollo/client';
import { useHistory, useRouteMatch } from 'react-router';

// UI Components
import { FunnelContainerStyled, FunnelStepsContainerStyled, LabelsContainerStyled } from '../../Funnel/styles';
import { FunnelSteps } from '../../Funnel/components/FunnelSteps';
import SidePanel, { SidePanelActions } from '../../../../../components/SidePanel';
import ButtonAsync from '../../../../../components/ButtonAsync';
import Button from '../../../../../components/Button';
import RadioGroup from '../../../../../components/RadioGroup';
import FormControlLabel from '../../../../../components/FormControlLabel';
import Radio from '../../../../../components/Radio';

// Custom Components
import { AssignMetricFunnelStepLabel } from './assignment/AssignMetricFunnelStepLabel';
import { UTMTracking } from './assignment/UTMTracking';
import { MetricClashesDialog } from './MetricClashes';
import { CustomConversions } from './assignment/CustomConversions';
import { MetricAssignmentCombobox } from './assignment/MetricAssignmentCombobox';
import { ReviewAndApplyDialog } from './assignment/ReviewAndApplyDialog';

// Hooks and Context
import { usePortfolio } from '../../../../../context/PortfolioProvider';
import { useTeam } from '../../../../../context/TeamProvider';
import { useDialogState } from '../../../../../components/Dialog';
import { useContentMappingStore } from '../../../../../store/content-metric-assignments';
import { useRuleClashStore } from '../../../../../store/metric-clashes';
import useTranslationStore from '../../../../../store/translations';

// GraphQL
import { MEASUREMENTS_QUERY, useMeasurementsQuery } from '../../../../../graphql/measurement/queryMeasurements';
import { LIST_CONVERSIONS_QUERY } from 'graphql/portfolioRules/queryConversions';
import { useApplyRulesToDiscoveredContentsMutation } from '../../../../../graphql/portfolioRules/mutationApplyRulesToDiscoveredContents';
import { usePortfolioDefaultFunnelStepMappingsQuery } from '../../../../../graphql/portfolioRules/queryPortfolioDefaultFunnelStepMappings';

// Types
import {
  NexoyaApplicableContentRule,
  NexoyaContentRule,
  NexoyaContentRuleFunnelStepMappingInput,
  NexoyaConversion,
  NexoyaDiscoveredContentStatus,
  NexoyaFunnelStepMappingInput,
  NexoyaFunnelStepMappingType,
  NexoyaFunnelStepMappingUtmParamInput,
  NexoyaFunnelStepV2,
  NexoyaMeasurement,
} from '../../../../../types';

// Utils
import { nexyColors } from '../../../../../theme';
import { areAllFunnelStepsAssigned, areSomeFunnelStepsAssigned, cleanUtmParams } from './utils';
import { CustomMetric } from './assignment/CustomMetric';
import { CustomImport } from './assignment/CustomImport';
import { useUpdateContentRuleMappingMutation } from '../../../../../graphql/portfolioRules/mutationUpdateContentRuleMapping';
import useUserStore from '../../../../../store/user';

// Constants
const GA4_PROVIDER_ID = 44;
const DEFAULT_COLOR = nexyColors.azure;
const INITIAL_FUNNEL_DATA = {
  labels: [],
  subLabels: [],
  values: [],
  colors: [],
};

export const ASSIGN_METRIC_OPTIONS = (customConversionsDisabled: boolean, isLoadingConversions: boolean) => [
  { value: NexoyaFunnelStepMappingType.Metric, label: 'Assign metric', disabled: false },
  {
    value: NexoyaFunnelStepMappingType.Conversion,
    label: 'Custom conversions',
    disabled: customConversionsDisabled,
    loading: isLoadingConversions,
  },
  { value: NexoyaFunnelStepMappingType.Utm, label: 'UTM tracking', disabled: false },
  { value: NexoyaFunnelStepMappingType.CustomImport, label: 'Custom import', disabled: false },
  { value: NexoyaFunnelStepMappingType.CustomMetric, label: 'Custom metric 🍺', disabled: false, supportOnly: true },
  { value: NexoyaFunnelStepMappingType.Ignore, label: 'Ignore mapping', disabled: false },
];

// Types
export interface AssignedMetric extends Omit<NexoyaFunnelStepMappingInput, 'utmParams'> {
  funnelStepId: number;
  utmParams?: NexoyaFunnelStepMappingUtmParamInput[];
}

interface ContentMetricAssignmentProps {
  funnelSteps: NexoyaFunnelStepV2[];
  isOpen: boolean;
  closeSidePanel: () => void;
  contentRule?: NexoyaContentRule;
}

export const ContentMetricAssignment: FC<ContentMetricAssignmentProps> = ({
  isOpen,
  closeSidePanel,
  funnelSteps,
  contentRule,
}) => {
  // Refs
  const didFetch = useRef(false);

  // Router and global state
  const history = useHistory();
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const { teamId } = useTeam();
  const { selectedFunnelStep, setSelectedFunnelStep } = usePortfolio().selectedFunnelStep;
  const { translations } = useTranslationStore();

  const { isSupportUser } = useUserStore();

  // Selected funnel step data
  const selectedFunnelStepId = selectedFunnelStep?.funnel_step_id;

  // Content rule data
  const providerId = contentRule?.filters?.providerId;
  const adAccountIds = contentRule?.filters?.adAccountIds;
  const isAssigningMetricsFirstTime = contentRule?.funnelStepMappings?.length === 0;

  // Local state
  const [funnelData, setFunnelData] = useState(INITIAL_FUNNEL_DATA);
  const [assignedMetrics, setAssignedMetrics] = useState<AssignedMetric[]>([]);
  const [isLoadingConversions, setIsLoadingConversions] = useState(true);

  // Content mapping store
  const {
    measurementsByProvider,
    conversionsByProvider,
    reset: resetContentMappingStore,
    setMeasurementsByProvider,
    setConversionsByProvider,
  } = useContentMappingStore();

  // Dialog states
  const {
    isOpen: isOpenApplyDialog,
    toggleDialog: toggleApplyDialog,
    closeDialog: closeApplyDialog,
  } = useDialogState();

  const {
    isOpen: isOpenClashesDialog,
    toggleDialog: toggleClashesDialog,
    closeDialog: closeClashesDialog,
  } = useDialogState();

  // Rule clash store
  const { setClashingDiscoveredContents, selectedRules, resetSelectedRules } = useRuleClashStore();

  // Derived state
  const measurements = Object.values(measurementsByProvider?.[providerId] ?? {}).flat();
  const conversions: NexoyaConversion[] = Object.values(conversionsByProvider?.[providerId] ?? {}).flat();
  const isCustomConversionsOptionDisabled = !adAccountIds?.length || !conversions?.length;
  const selectedMappingType = assignedMetrics.find((m) => m.funnelStepId === selectedFunnelStepId)?.type;
  const hasAnyMetricAssignment = assignedMetrics.some((m) => m.type);

  // GraphQL queries
  const { data: GA4MeasurementData } = useMeasurementsQuery({ providerId: GA4_PROVIDER_ID });
  const GA4Measurements: Partial<NexoyaMeasurement[]> = GA4MeasurementData?.measurements;
  const mergedMeasurements = concat(measurements, GA4Measurements);

  const [fetchMeasurements] = useLazyQuery(MEASUREMENTS_QUERY);
  const [fetchConversions] = useLazyQuery(LIST_CONVERSIONS_QUERY);

  // Default funnel step mappings query
  usePortfolioDefaultFunnelStepMappingsQuery({
    portfolioId,
    providerId,
    onCompleted: (data) => {
      if (!data.listPortfolioDefaultFunnelStepMappings) return;

      const defaultMappings = data.listPortfolioDefaultFunnelStepMappings;
      setAssignedMetrics((prev) => {
        const newMappings = defaultMappings.map((mapping) => ({
          funnelStepId: mapping.funnelStepId,
          metricId: mapping.metricId,
          type: mapping.metricId ? NexoyaFunnelStepMappingType.Metric : NexoyaFunnelStepMappingType.Ignore,
          conversionId: null,
        }));

        if (contentRule.funnelStepMappings.length === 0) {
          return newMappings; // Use defaults if no existing mappings
        } else {
          return prev; // Keep existing mappings if any exist
        }
      });
    },
  });

  const [updateContentRuleMappingMutation, { loading }] = useUpdateContentRuleMappingMutation({
    portfolioId,
    onCompleted: (data) => {
      const { clashingDiscoveredContents } = data.updateContentRuleFunnelStepMappings;

      if (clashingDiscoveredContents?.length) {
        setClashingDiscoveredContents(clashingDiscoveredContents);
        toast.warning('Some contents have clashes');
        toggleClashesDialog();
      } else {
        toast.success(`Metrics applied successfully`, {
          description: 'The metrics have been applied to all matching contents',
        });
        closeSidePanel();
      }
    },
  });

  const [applyRulesToDiscoveredContents, { loading: loadingApply }] = useApplyRulesToDiscoveredContentsMutation({
    portfolioId,
    status: NexoyaDiscoveredContentStatus.Manual,
  });

  // Effects
  useEffect(() => {
    // Only set up blocker if there are unsaved changes
    if (hasAnyMetricAssignment) {
      // This function returns an unblock function
      const unblock = history.block(() => {
        // Show a custom confirmation dialog
        const userConfirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');

        // Allow navigation if user confirmed, block if they didn't
        return userConfirmed;
      });

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        // Standard way to show a confirmation dialog
        const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
        e.preventDefault();
        e.returnValue = confirmationMessage; // For older browsers
        return confirmationMessage; // For modern browsers
      };

      // Add the event listener
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Clean up both event listeners when component unmounts
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        unblock();
      };
    }
  }, [hasAnyMetricAssignment, history]);

  // Select first funnel step on mount
  useEffect(() => {
    const firstFunnelStep = funnelSteps[0];
    setSelectedFunnelStep({
      title: firstFunnelStep.title,
      funnel_step_id: firstFunnelStep.funnelStepId,
      type: firstFunnelStep.type,
    });
  }, []);

  // Initialize assigned metrics from content rule
  useEffect(() => {
    if (contentRule) {
      setAssignedMetrics(
        // @ts-ignore
        contentRule.funnelStepMappings.map((contentRuleFunnelStepMapping) => {
          const mapping = contentRuleFunnelStepMapping.mapping;

          return {
            funnelStepId: contentRuleFunnelStepMapping.funnelStepId,
            metricId: mapping.metricId,
            type: mapping.type,
            searchTitle: mapping.searchTitle,
            conversions: mapping.conversions?.map(({ __typename, ...rest }) => rest),
            utmParams: mapping.utmParams,
            analyticsPropertyId: mapping.analyticsPropertyId,
          };
        }),
      );
    }
  }, [contentRule]);

  // Fetch measurements and conversions for each provider
  useEffect(() => {
    if (didFetch.current || !adAccountIds?.length) return;

    didFetch.current = true;
    setIsLoadingConversions(true); // Set loading to true when fetch starts

    const fetchData = async () => {
      const { data: measurementsData } = await fetchMeasurements({
        variables: { providerId },
      });

      if (measurementsData?.measurements) {
        setMeasurementsByProvider(providerId, measurementsData.measurements);
      }

      const { data } = await fetchConversions({
        variables: { adAccountContentIds: adAccountIds, teamId },
      });
      setIsLoadingConversions(false); // Set loading to false when fetch completes

      if (data?.listConversions) {
        setConversionsByProvider(providerId, data.listConversions);
      }
    };

    fetchData();
  }, [
    providerId,
    adAccountIds,
    teamId,
    fetchMeasurements,
    fetchConversions,
    setMeasurementsByProvider,
    setConversionsByProvider,
  ]);

  // Build funnel data
  useEffect(() => {
    setFunnelData(
      funnelSteps.reduce(
        (_, step) => ({
          labels: [step.title],
          subLabels: [step.title],
          values: [[100]],
          colors: [DEFAULT_COLOR],
        }),
        INITIAL_FUNNEL_DATA,
      ),
    );
  }, [funnelSteps]);

  // Initialize the assigned metric for the selected funnel step
  useEffect(() => {
    if (selectedFunnelStepId == null) return;

    setAssignedMetrics((prev) => {
      if (prev.some((metric) => metric.funnelStepId === selectedFunnelStepId)) return prev;

      return [
        ...prev,
        {
          funnelStepId: selectedFunnelStepId,
          type: null,
          metricId: null,
          conversionId: null,
          conversionName: null,
        },
      ];
    });
  }, [selectedFunnelStepId]);

  // Handle updating the content rule
  const handleUpdate = () => {
    const funnelStepMappings: NexoyaContentRuleFunnelStepMappingInput[] = assignedMetrics
      ?.filter((m) => m.type)
      ?.map(({ funnelStepId, metricId, conversions, utmParams, type, analyticsPropertyId, searchTitle }) => ({
        funnelStepId: Number(funnelStepId),
        mapping: {
          type,
          ...(metricId && { metricId }),
          ...(searchTitle && { searchTitle }),
          ...(analyticsPropertyId && { analyticsPropertyId }),
          conversions: conversions?.map(({ accountConversionIds, metricId, conversionName }) => ({
            metricId,
            conversionName,
            accountConversionIds,
          })),
          utmParams: cleanUtmParams(utmParams),
        },
      }));

    updateContentRuleMappingMutation({
      variables: {
        teamId,
        portfolioId,
        contentRuleId: contentRule?.contentRuleId,
        funnelStepMappings,
      },
    }).then(() => {
      closeSidePanel();
    });
  };

  // Handle submitting the content rule mapping
  const handleSubmit = () => {
    const invalidUtmMappings = assignedMetrics.some(
      (metric) => metric.type === NexoyaFunnelStepMappingType.Utm && !metric.metricId,
    );

    if (invalidUtmMappings) {
      toast.warning('Please select a metric type for all UTM tracking steps.');
      return;
    }

    updateContentRuleMappingMutation({
      variables: {
        contentRuleId: contentRule.contentRuleId,
        portfolioId,
        teamId,
        funnelStepMappings:
          assignedMetrics
            ?.filter((mapping): mapping is NonNullable<typeof mapping> => Boolean(mapping?.type))
            ?.map(({ funnelStepId, metricId, conversions, utmParams, type, searchTitle, analyticsPropertyId }) => {
              const mapping: NexoyaFunnelStepMappingInput = {
                type,
                ...(metricId && { metricId }),
                ...(searchTitle && { searchTitle }),
                ...(analyticsPropertyId && { analyticsPropertyId }),
                conversions:
                  conversions?.map(({ accountConversionIds, metricId, conversionName }) => ({
                    metricId,
                    conversionName,
                    accountConversionIds,
                  })) ?? [],
              };

              if (utmParams?.length) {
                mapping.utmParams = [...cleanUtmParams(utmParams)];
              }

              return { funnelStepId: Number(funnelStepId), mapping };
            }) ?? [],
      },
    }).then(() => {
      closeApplyDialog();
    });
  };

  // Handle applying clashes
  const handleApplyClashes = async () => {
    const discoveredContentsWithRulesToApply = Object.entries(selectedRules).map(([contentId, rule]) => ({
      discoveredContentId: parseInt(contentId, 10),
      contentRuleId: toNumber(rule.ruleId),
      impactGroupRuleId: null,
    }));

    await applyRulesToDiscoveredContents({
      variables: {
        discoveredContentsWithRulesToApply,
        portfolioId,
        teamId,
      },
    }).then(() => {
      closeClashesDialog();
      resetSelectedRules();
      closeSidePanel();
    });
  };

  // Handle closing the panel
  const handleClose = () => {
    resetContentMappingStore();
    didFetch.current = false;
    closeSidePanel();
  };

  // Handle metric type change
  const handleMetricTypeChange = (type: NexoyaFunnelStepMappingType) => {
    if (!selectedFunnelStepId) return;

    setAssignedMetrics((prev) =>
      prev.map((metric) => {
        if (metric.funnelStepId !== selectedFunnelStepId) return metric;

        const updatedMetric = {
          ...metric,
          type,
        };

        if (type === NexoyaFunnelStepMappingType.Metric) {
          return {
            ...updatedMetric,
            conversions: [],
            utmParams: [],
          };
        } else if (type === NexoyaFunnelStepMappingType.Ignore) {
          return {
            ...updatedMetric,
            type: NexoyaFunnelStepMappingType.Ignore,
            metricId: null,
            conversions: [],
            utmParams: [],
          };
        } else if (type === NexoyaFunnelStepMappingType.Conversion) {
          return {
            ...updatedMetric,
            type: NexoyaFunnelStepMappingType.Conversion,
            metricId: null,
            conversions: [{ accountConversionIds: [], conversionName: '', metricId: null }],
            utmParams: [],
          };
        } else if (type === NexoyaFunnelStepMappingType.CustomImport) {
          return {
            ...updatedMetric,
            type: NexoyaFunnelStepMappingType.CustomImport,
            metricId: null,
            searchTitle: '',
            conversions: [],
            utmParams: [],
          };
        } else if (type === NexoyaFunnelStepMappingType.Utm) {
          return {
            ...updatedMetric,
            type: NexoyaFunnelStepMappingType.Utm,
            analyticsPropertyId: null,
            metricId: null,
            searchTitle: '',
            conversions: [],
            utmParams: [],
          };
        } else if (type === NexoyaFunnelStepMappingType.CustomMetric) {
          return {
            ...updatedMetric,
            type: NexoyaFunnelStepMappingType.CustomMetric,
            metricId: null,
            searchTitle: '',
            conversions: [],
            utmParams: [],
          };
        }

        return updatedMetric;
      }),
    );
  };

  // Navigation between funnel steps
  const getNextOrPreviousFunnelStep = (direction: 'next' | 'previous') => {
    const currentIndex = funnelSteps.findIndex((step) => step.funnelStepId === selectedFunnelStepId);
    return funnelSteps[direction === 'next' ? currentIndex + 1 : currentIndex - 1];
  };

  const handlePreviousStep = () => {
    const previousFunnelStep = getNextOrPreviousFunnelStep('previous');
    if (previousFunnelStep) {
      setSelectedFunnelStep({
        title: previousFunnelStep.title,
        funnel_step_id: previousFunnelStep.funnelStepId,
        type: previousFunnelStep.type,
      });
    }
  };

  const handleNextStep = () => {
    const nextFunnelStep = getNextOrPreviousFunnelStep('next');
    if (!nextFunnelStep && areAllFunnelStepsAssigned(funnelSteps, assignedMetrics, mergedMeasurements, translations)) {
      toggleApplyDialog();
    } else {
      setSelectedFunnelStep({
        title: nextFunnelStep.title,
        funnel_step_id: nextFunnelStep.funnelStepId,
        type: nextFunnelStep.type,
      });
    }
  };

  // Render mapping type specific content
  const renderInputsBasedOnMappingType = (mappingType?: NexoyaFunnelStepMappingType) => {
    switch (mappingType) {
      case NexoyaFunnelStepMappingType.Metric:
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="mt-3 text-lg text-neutral-900">Assign a metric</div>
              <div className="mt-0.5 text-sm font-light text-neutral-400">
                Assign a metric for the conversion goal selected above.
              </div>
            </div>
            <MetricAssignmentCombobox
              measurementsList={measurements}
              selectedFunnelStepId={selectedFunnelStepId}
              assignedMetrics={assignedMetrics}
              setAssignedMetrics={setAssignedMetrics}
              selectedFunnelStepType={selectedFunnelStep?.type}
            />
          </div>
        );

      case NexoyaFunnelStepMappingType.Conversion:
        return (
          <CustomConversions
            selectedFunnelStepId={selectedFunnelStepId}
            conversions={conversions}
            measurements={measurements}
            translations={translations}
            setAssignedMetrics={setAssignedMetrics}
            selectedConversions={
              assignedMetrics.find((m) => m.funnelStepId === selectedFunnelStepId)?.conversions || []
            }
          />
        );

      case NexoyaFunnelStepMappingType.CustomMetric:
        return (
          <CustomMetric
            funnelStepId={selectedFunnelStepId}
            funnelStepType={selectedFunnelStep?.type}
            assignedMetrics={assignedMetrics}
            setAssignedMetrics={setAssignedMetrics}
          />
        );
      case NexoyaFunnelStepMappingType.CustomImport:
        return (
          <CustomImport
            funnelStepId={selectedFunnelStepId}
            funnelStepType={selectedFunnelStep?.type}
            assignedMetrics={assignedMetrics}
            setAssignedMetrics={setAssignedMetrics}
          />
        );

      case NexoyaFunnelStepMappingType.Utm:
        return (
          <UTMTracking
            assignedMetrics={assignedMetrics}
            setAssignedMetrics={setAssignedMetrics}
            funnelStepId={selectedFunnelStepId}
            selectedMetricId={assignedMetrics.find((m) => m.funnelStepId === selectedFunnelStepId)?.metricId}
            measurements={GA4Measurements}
            funnelStepType={selectedFunnelStep?.type}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SidePanel
        isOpen={isOpen}
        onClose={handleClose}
        paperProps={{ style: { width: 'calc(100% - 218px)', paddingBottom: '78px' } }}
      >
        {/* Header */}
        <div className="border border-b-[#eaeaea] px-6 py-5">
          <h3 className="text-xl font-medium text-neutral-900">
            Assign metrics to funnel steps for {contentRule?.name}
          </h3>
        </div>

        {/* Content */}
        <div className="flex h-full gap-10 px-6">
          {/* Left Panel - Funnel Visualization */}
          <div className="max-h-full w-fit flex-col overflow-y-auto pb-8 pr-3">
            <div className="mb-8 mt-6 text-sm font-light text-neutral-500">
              Configure the metric mappings for each funnel step.
            </div>
            <FunnelContainerStyled>
              <LabelsContainerStyled>
                <AssignMetricFunnelStepLabel
                  assignedMetrics={assignedMetrics}
                  mergedMeasurements={mergedMeasurements}
                  translations={translations}
                  funnelSteps={funnelSteps?.filter((f) => !f.isAttributed)}
                />
              </LabelsContainerStyled>
              <FunnelStepsContainerStyled>
                <FunnelSteps withTooltip={false} funnelData={funnelData} funnelSteps={funnelSteps} />
              </FunnelStepsContainerStyled>
            </FunnelContainerStyled>
          </div>

          {/* Divider */}
          <div className="h-full w-[1px] bg-neutral-100" />

          {/* Right Panel - Configuration */}
          <div className="flex h-full flex-col gap-6">
            {/* Mapping Type Selection */}
            <div>
              <div className="mt-6 text-lg text-neutral-700">
                Mapping type for <span className="font-semibold">{selectedFunnelStep?.title}</span>
              </div>
              <div className="mt-2 text-sm font-light text-neutral-500">
                Assign metrics to funnel steps to track the performance of your marketing campaigns.
              </div>
              <RadioGroup className="ml-[-3px] mt-4 flex flex-col gap-1.5">
                {ASSIGN_METRIC_OPTIONS(isCustomConversionsOptionDisabled, isLoadingConversions).map((option) => {
                  // Show the option if:
                  // 1. It doesn't have supportOnly property, OR
                  // 2. It has supportOnly property AND the user is a support user
                  if (!option.supportOnly || (option.supportOnly && isSupportUser)) {
                    return (
                      <div key={option.value} className="flex items-center gap-2">
                        <FormControlLabel
                          checked={option.value === selectedMappingType}
                          onChange={() => !option.disabled && handleMetricTypeChange(option.value)}
                          value={option.value}
                          label={
                            <div className="flex items-center gap-2">
                              {option.label}
                              {option.loading && (
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-neutral-200 border-t-transparent"></span>
                              )}
                            </div>
                          }
                          control={<Radio />}
                          data-cy={option.value}
                          disabled={option.disabled}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </RadioGroup>
            </div>

            {/* Mapping Type Specific Inputs */}
            <div>{renderInputsBasedOnMappingType(selectedMappingType)}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <SidePanelActions className="!fixed bottom-0 z-[3400] !w-[calc(100%-218px)] border-t border-neutral-100">
          <Button
            id="previous"
            disabled={
              loading ||
              !hasAnyMetricAssignment ||
              !areSomeFunnelStepsAssigned(funnelSteps, assignedMetrics, mergedMeasurements, translations)
            }
            onClick={toggleApplyDialog}
            variant="contained"
            color="secondary"
            className="w-fit"
          >
            Save progress and apply
          </Button>
          <div className="flex justify-end gap-3">
            <Button
              id="previous"
              variant="contained"
              disabled={!getNextOrPreviousFunnelStep('previous')}
              onClick={handlePreviousStep}
            >
              Previous step
            </Button>
            <ButtonAsync
              id="next"
              variant="contained"
              color="primary"
              loading={loading}
              disabled={
                loading ||
                !hasAnyMetricAssignment ||
                // Only disable when there's no next step AND not all steps are assigned
                (!getNextOrPreviousFunnelStep('next') &&
                  !areAllFunnelStepsAssigned(funnelSteps, assignedMetrics, mergedMeasurements, translations))
              }
              onClick={handleNextStep}
            >
              {getNextOrPreviousFunnelStep('next') ? 'Next funnel step' : 'Review and apply'}
            </ButtonAsync>
          </div>
        </SidePanelActions>
      </SidePanel>

      {/* Dialogs */}
      <ReviewAndApplyDialog
        isOpen={isOpenApplyDialog}
        onClose={closeApplyDialog}
        onConfirm={isAssigningMetricsFirstTime ? handleSubmit : handleUpdate}
        loading={loading}
        disabled={loading || !hasAnyMetricAssignment}
        funnelSteps={funnelSteps}
        assignedMetrics={assignedMetrics}
        measurements={mergedMeasurements}
      />

      {isOpenClashesDialog && (
        <MetricClashesDialog<NexoyaApplicableContentRule>
          isOpen={isOpenClashesDialog}
          onCancel={closeClashesDialog}
          onConfirm={() => handleApplyClashes()}
          loading={loadingApply}
          getRules={(dsc) => dsc.contentRules}
          getRuleId={(rule) => rule?.contentRule?.contentRuleId?.toString()}
          getRuleName={(rule) => rule?.contentRule?.name}
          dialogTitle="Content rule clashes"
          type="content rule"
        />
      )}
    </>
  );
};
