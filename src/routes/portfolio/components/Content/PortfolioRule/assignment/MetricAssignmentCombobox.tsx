import translate from '../../../../../../utils/translate';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../../components-ui/Popover';
import { cn } from '../../../../../../lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../../../../components-ui/Command';
import { toNumber } from 'lodash';
import React, { useState } from 'react';
import useTranslationStore from '../../../../../../store/translations';
import { NexoyaFunnelStepType, NexoyaMeasurement } from '../../../../../../types';
import { getSelectedMeasurementForFunnelStepId } from '../../../../../../lib/metric-assignment';
import { AssignedMetric } from '../ContentMetricAssignment';
import { ChevronDown } from 'lucide-react';

export const MetricAssignmentCombobox = ({
  measurementsList,
  triggerClassName,
  selectedFunnelStepId,
  assignedMetrics,
  setAssignedMetrics,
  selectedFunnelStepType,
}: {
  measurementsList: NexoyaMeasurement[];
  triggerClassName?: string;
  selectedFunnelStepId: number;
  assignedMetrics: AssignedMetric[];
  setAssignedMetrics: React.Dispatch<React.SetStateAction<AssignedMetric[]>>;
  selectedFunnelStepType: NexoyaFunnelStepType;
}) => {
  const [isAssignMetricsOpen, setIsAssignMetricsOpen] = useState(false);
  const { translations } = useTranslationStore();

  const selectedMetricName = translate(
    translations,
    getSelectedMeasurementForFunnelStepId(selectedFunnelStepId, measurementsList, assignedMetrics)?.name,
  );
  return (
    <Popover open={isAssignMetricsOpen} onOpenChange={setIsAssignMetricsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'w-52 whitespace-pre rounded-md border border-neutral-100 bg-white p-2 shadow-sm',
            triggerClassName,
          )}
        >
          <span className="flex cursor-pointer items-center justify-between truncate">
            {selectedMetricName === 'No data' ? 'Select a metric' : selectedMetricName}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search metrics..." />
          <CommandList>
            <CommandEmpty>No metrics found.</CommandEmpty>
            <CommandGroup>
              {measurementsList
                ?.filter((measurement) => measurement.optimization_target_type?.includes(selectedFunnelStepType))
                ?.map((measurement) => (
                  <CommandItem
                    key={measurement.measurement_id}
                    value={measurement.measurement_id?.toString()}
                    onSelect={() => {
                      setAssignedMetrics((prev) =>
                        prev.map((metric) =>
                          metric.funnelStepId === selectedFunnelStepId
                            ? {
                                ...metric,
                                metricId: toNumber(measurement.measurement_id),
                              }
                            : metric,
                        ),
                      );
                      setIsAssignMetricsOpen(false);
                    }}
                  >
                    <span>{translate(translations, measurement.name)}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
