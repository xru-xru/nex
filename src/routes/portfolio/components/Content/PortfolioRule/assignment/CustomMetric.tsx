import React, { FC, useState } from 'react';
import { NexoyaFunnelStepType, NexoyaMeasurement } from '../../../../../../types';
import { AssignedMetric } from '../ContentMetricAssignment';
import { LabelLight } from '../../../../../../components/InputLabel/styles';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../../../../../components-ui/Select';
import { Input } from '../../../../../../components-ui/Input';
import { MetricAssignmentCombobox } from './MetricAssignmentCombobox';
import { useListCustomMetricExpansionVariables } from '../../../../../../graphql/portfolioRules/queryCustomMetricExpansionVariables';
import { useMeasurementsQuery } from '../../../../../../graphql/measurement/queryMeasurements';

const CUSTOM_METRIC_PROVIDER_ID = 100;

interface CustomMetricProps {
  funnelStepId: number;
  funnelStepType: NexoyaFunnelStepType;
  assignedMetrics: AssignedMetric[];
  setAssignedMetrics: React.Dispatch<React.SetStateAction<AssignedMetric[]>>;
}

export const CustomMetric: FC<CustomMetricProps> = ({
  funnelStepId,
  funnelStepType,
  assignedMetrics,
  setAssignedMetrics,
}) => {
  const { data: customMetricVariablesData } = useListCustomMetricExpansionVariables();
  const customMetricVariables = customMetricVariablesData?.listFunnelStepCustomMetricExpansionVariables;

  const { data: measurementsData } = useMeasurementsQuery({
    providerId: CUSTOM_METRIC_PROVIDER_ID,
  });

  const measurements = measurementsData?.measurements || [];

  const currentMetric = assignedMetrics.find((metric) => metric.funnelStepId === funnelStepId);
  const titleValue = currentMetric?.searchTitle || '';
  const [openVariablesSelect, setOpenVariablesSelect] = useState(false);

  // Update the title in the assignedMetrics state
  const updateTitle = (newTitle: string) => {
    setAssignedMetrics((prev) => {
      const index = prev.findIndex((m) => m.funnelStepId === funnelStepId);
      if (index === -1) return prev;

      const newMetrics = [...prev];
      newMetrics[index] = { ...newMetrics[index], searchTitle: newTitle };
      return newMetrics;
    });
  };

  // Handle input changes and check for variable trigger
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateTitle(value);

    // Show variable suggestions dropdown if user types "{}"
    if (value.endsWith('{}')) {
      setOpenVariablesSelect(true);
    } else {
      setOpenVariablesSelect(false);
    }
  };

  // Handle variable selection
  const handleVariableSelect = (selectedVariable: string) => {
    const newTitle = titleValue.replace('{}', `{${selectedVariable}}`);
    updateTitle(newTitle);
    setOpenVariablesSelect(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="mt-3 text-lg text-neutral-700">Select custom import metric</div>
        <div className="mt-0.5 text-sm font-light text-neutral-400">
          Select a custom metric title to assign to match the collection title.
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center">
          <div className="w-full">
            <LabelLight style={{ fontSize: 11 }}>Collection title matching</LabelLight>
            <div className="flex w-full items-center gap-2">
              {/* Title input with variable selection */}
              <Select open={openVariablesSelect} onValueChange={handleVariableSelect}>
                <Input
                  className="relative w-full shadow-sm"
                  placeholder="Enter title (use {} to insert variables)"
                  value={titleValue}
                  onChange={handleTitleChange}
                />
                <SelectTrigger className="h-0 w-0 border-none p-0 opacity-0" />
                <SelectContent className="absolute left-[-595px] top-4">
                  {customMetricVariables?.map((variable) => (
                    <SelectItem key={variable} value={variable}>
                      {`{${variable}}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <div className="w-full">
          <LabelLight>Metric</LabelLight>
          <MetricAssignmentCombobox
            measurementsList={measurements as NexoyaMeasurement[]}
            selectedFunnelStepId={funnelStepId}
            assignedMetrics={assignedMetrics}
            setAssignedMetrics={setAssignedMetrics}
            selectedFunnelStepType={funnelStepType}
            triggerClassName="w-full"
          />
        </div>
      </div>
    </div>
  );
};
