import { usePortfolio } from 'context/PortfolioProvider';
import React, { FC, useEffect, useState } from 'react';
import useTranslationStore from 'store/translations';
import { nexyColors } from 'theme';
import { NexoyaFunnelStepMappingType, NexoyaManualContentFunnelStepMappingInput, NexoyaMeasurement } from 'types';
import { MEASUREMENTS_QUERY } from '../../../../../graphql/measurement/queryMeasurements';
import { FunnelContainerStyled, FunnelStepsContainerStyled, LabelsContainerStyled } from '../../Funnel/styles';
import { AssignMetricFunnelStepLabel } from '../PortfolioRule/assignment/AssignMetricFunnelStepLabel';
import { FunnelSteps } from '../../Funnel/components/FunnelSteps';
import RadioGroup from '../../../../../components/RadioGroup';
import FormControlLabel from '../../../../../components/FormControlLabel';
import Radio from '../../../../../components/Radio';
import { MetricAssignmentCombobox } from '../PortfolioRule/assignment/MetricAssignmentCombobox';
import { useLazyQuery } from '@apollo/client';
import { uniqBy } from 'lodash';
import useFunnelStepsStore from '../../../../../store/funnel-steps';

interface MetricAssignmentStepProps {
  providerIds: number[];
  funnelStepMappings: Array<
    NexoyaManualContentFunnelStepMappingInput & { type: NexoyaFunnelStepMappingType; disabled?: boolean }
  >;
  setFunnelStepMappings: (
    mappings: Array<
      NexoyaManualContentFunnelStepMappingInput & { type: NexoyaFunnelStepMappingType; disabled?: boolean }
    >,
  ) => void;
}

const DEFAULT_COLOR = nexyColors.azure;
const INITIAL_FUNNEL_DATA = {
  labels: [],
  subLabels: [],
  values: [],
  colors: [],
};

const MetricAssignmentStep: FC<MetricAssignmentStepProps> = ({
  providerIds,
  funnelStepMappings,
  setFunnelStepMappings,
}) => {
  const [funnelData, setFunnelData] = useState(INITIAL_FUNNEL_DATA);
  const [measurements, setMeasurements] = useState<NexoyaMeasurement[]>([]);

  const { funnelSteps } = useFunnelStepsStore();

  const { selectedFunnelStep, setSelectedFunnelStep } = usePortfolio().selectedFunnelStep;
  const { translations } = useTranslationStore();

  const selectedFunnelStepId = selectedFunnelStep?.funnel_step_id;
  const selectedFunnelStepMapping = funnelStepMappings.find((m) => m.funnelStepId === selectedFunnelStepId);

  const [fetchMeasurements] = useLazyQuery(MEASUREMENTS_QUERY);

  // Fetch measurements for each provider
  useEffect(() => {
    const fetchMeasurementsForProviders = async () => {
      // Clear measurements before fetching new ones
      setMeasurements([]);

      const allMeasurements = [];

      for (const providerId of providerIds) {
        const { data: measurementsData } = await fetchMeasurements({
          variables: { providerId },
        });

        const measurements = measurementsData?.measurements || [];
        allMeasurements.push(...measurements);
      }

      // Set all measurements at once
      setMeasurements(uniqBy(allMeasurements, 'measurement_id'));
    };

    fetchMeasurementsForProviders();
  }, [providerIds, fetchMeasurements]);

  // Initialize with first funnel step
  useEffect(() => {
    if (funnelSteps && funnelSteps.length > 0) {
      const firstFunnelStep = funnelSteps[0];
      setSelectedFunnelStep({
        title: firstFunnelStep.title,
        funnel_step_id: firstFunnelStep.funnelStepId,
        type: firstFunnelStep.type,
      });
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
    }
  }, [funnelSteps]);

  return (
    <div className="flex h-full gap-10 px-6">
      {/* Left Panel - Funnel Visualization */}
      <div className="w-fit flex-col">
        <div className="mb-8 mt-6 text-sm font-light text-neutral-500">
          Configure the metric mappings for each funnel step.
        </div>
        <FunnelContainerStyled>
          <LabelsContainerStyled>
            <AssignMetricFunnelStepLabel
              assignedMetrics={funnelStepMappings}
              mergedMeasurements={measurements}
              translations={translations}
              funnelSteps={funnelSteps
                ?.filter((f) => !f.isAttributed)
                .map((step) => {
                  const mapping = funnelStepMappings.find((m) => m.funnelStepId === step.funnelStepId);
                  return {
                    ...step,
                    disabled: mapping?.disabled || false,
                  };
                })}
            />
          </LabelsContainerStyled>
          <FunnelStepsContainerStyled>
            <FunnelSteps
              withTooltip={false}
              funnelData={funnelData}
              funnelSteps={funnelSteps.map((step) => {
                const mapping = funnelStepMappings.find((m) => m.funnelStepId === step.funnelStepId);
                return {
                  ...step,
                  disabled: mapping?.disabled || false,
                };
              })}
            />
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
            <div className="flex items-center gap-2">
              <FormControlLabel
                checked={selectedFunnelStepMapping?.type === NexoyaFunnelStepMappingType.Metric}
                value={NexoyaFunnelStepMappingType.Metric}
                label={<div className="flex items-center gap-2">Assign metric</div>}
                control={<Radio />}
                onChange={() => {
                  const updatedMappings = funnelStepMappings.map((item) =>
                    item.funnelStepId === selectedFunnelStepId
                      ? { ...item, type: NexoyaFunnelStepMappingType.Metric }
                      : item,
                  );
                  setFunnelStepMappings(updatedMappings);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <FormControlLabel
                checked={selectedFunnelStepMapping?.type === NexoyaFunnelStepMappingType.Ignore}
                value={NexoyaFunnelStepMappingType.Ignore}
                label={<div className="flex items-center gap-2">Ignore mapping</div>}
                control={<Radio />}
                onChange={() => {
                  const updatedMappings = funnelStepMappings.map((item) =>
                    item.funnelStepId === selectedFunnelStepId
                      ? { ...item, metricId: null, type: NexoyaFunnelStepMappingType.Ignore }
                      : item,
                  );
                  setFunnelStepMappings(updatedMappings);
                }}
              />
            </div>
          </RadioGroup>
        </div>

        {selectedFunnelStepMapping?.type === NexoyaFunnelStepMappingType.Metric ? (
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
              assignedMetrics={funnelStepMappings}
              setAssignedMetrics={setFunnelStepMappings}
              selectedFunnelStepType={selectedFunnelStep?.type}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MetricAssignmentStep;
