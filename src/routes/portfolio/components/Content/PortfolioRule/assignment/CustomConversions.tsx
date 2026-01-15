import React, { FC } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../../components-ui/Popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../../../../components-ui/Command';
import { Button as ShadcnButton } from '../../../../../../components-ui/Button';
import { Check, ChevronDown, CirclePlus, Trash2 } from 'lucide-react';
import { cn } from '../../../../../../lib/utils';
import { NexoyaConversion, NexoyaMeasurement } from '../../../../../../types';
import translate from '../../../../../../utils/translate';
import { AssignedMetric } from '../ContentMetricAssignment';
import Tooltip from '../../../../../../components/Tooltip/Tooltip';

interface CustomConversionsProps {
  selectedFunnelStepId: number;
  selectedConversions: Array<{
    accountConversionIds: string[];
    conversionName: string;
    metricId: number | null;
  }>;
  conversions: NexoyaConversion[];
  measurements: Partial<NexoyaMeasurement>[];
  translations: any[];
  setAssignedMetrics: React.Dispatch<React.SetStateAction<AssignedMetric[]>>;
}

export const CustomConversions: FC<CustomConversionsProps> = ({
  selectedFunnelStepId,
  selectedConversions,
  conversions,
  measurements,
  translations,
  setAssignedMetrics,
}) => {
  const handleAddConversion = () => {
    setAssignedMetrics((prev) =>
      prev.map((metric) =>
        metric.funnelStepId === selectedFunnelStepId
          ? {
              ...metric,
              conversions: [...metric.conversions, { accountConversionIds: [], conversionName: '', metricId: null }],
            }
          : metric,
      ),
    );
  };

  const handleDeleteConversion = (index: number) => {
    setAssignedMetrics((prev) =>
      prev.map((metric) =>
        metric.funnelStepId === selectedFunnelStepId
          ? {
              ...metric,
              conversions: metric.conversions.filter((_, i) => i !== index),
            }
          : metric,
      ),
    );
  };

  const getSelectedMeasurementForSelectedConversion = (measurementsList: Partial<NexoyaMeasurement>[], index: number) =>
    measurementsList?.find((m) => m?.measurement_id === selectedConversions[index]?.metricId);

  return (
    <div className="mb-40 flex max-h-full flex-col gap-4 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <div className="mt-3 text-lg text-neutral-700">Select conversion goals and metrics</div>
        <div className="mt-0.5 text-sm font-light text-neutral-400">
          Select conversion goals and metrics to assign to them respectively.
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {selectedConversions.map((conversion, index) => {
          const metricName = translate(
            translations,
            getSelectedMeasurementForSelectedConversion(measurements, index)?.name,
          );

          return (
            <>
              <div key={index} className="flex w-full gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className={cn('w-64 whitespace-pre rounded-md border border-neutral-100 bg-white p-2 shadow-sm')}
                    >
                      <Tooltip
                        placement="top"
                        popperProps={{
                          style: {
                            zIndex: 3301,
                          },
                        }}
                        style={{ wordBreak: 'break-word', width: '100%' }}
                        variant="dark"
                        content={conversion.conversionName || 'Select a conversion goal'}
                      >
                        <span className="flex cursor-pointer items-center justify-between truncate">
                          {conversion.conversionName || 'Select a conversion goal'}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </span>
                      </Tooltip>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search conversions..." />
                      <CommandList>
                        <CommandEmpty>No conversions found.</CommandEmpty>
                        <CommandGroup>
                          {conversions.map((conv) => {
                            const isActive =
                              conversion.conversionName && conv.conversionName === conversion.conversionName;
                            return (
                              <CommandItem
                                key={conv.accountConversionIds.join()}
                                value={conv.conversionName}
                                className={isActive ? 'bg-neutral-700 text-white' : ''}
                                onSelect={() => {
                                  setAssignedMetrics((prev) =>
                                    prev.map((metric) =>
                                      metric.funnelStepId === selectedFunnelStepId
                                        ? {
                                            ...metric,
                                            conversions: metric.conversions.map((c, i) =>
                                              i === index
                                                ? {
                                                    metricId: c.metricId,
                                                    accountConversionIds: conv.accountConversionIds,
                                                    conversionName: conv.conversionName,
                                                  }
                                                : c,
                                            ),
                                          }
                                        : metric,
                                    ),
                                  );
                                }}
                              >
                                {isActive && <Check className="ml-1 mr-2 h-4 w-4 opacity-60" />}
                                <span title={conv.conversionName}>{conv.conversionName}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className={cn('w-64 whitespace-pre rounded-md border border-neutral-100 bg-white p-2 shadow-sm')}
                    >
                      <Tooltip
                        placement="top"
                        popperProps={{
                          style: {
                            zIndex: 3301,
                          },
                        }}
                        style={{
                          wordBreak: 'break-word',
                          width: '100%',
                        }}
                        variant="dark"
                        content={metricName !== 'No data' ? metricName : 'Select a metric'}
                      >
                        <span className="flex cursor-pointer items-center justify-between truncate">
                          {metricName !== 'No data' ? metricName : 'Select a metric'}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </span>
                      </Tooltip>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search metrics..." />
                      <CommandList>
                        <CommandEmpty>No metrics found.</CommandEmpty>
                        <CommandGroup>
                          {measurements.map((measurement) => {
                            const metricTranslation = translate(translations, measurement.name);
                            return (
                              <CommandItem
                                key={measurement.measurement_id}
                                value={metricTranslation}
                                onSelect={() => {
                                  setAssignedMetrics((prev) =>
                                    prev.map((metric) =>
                                      metric.funnelStepId === selectedFunnelStepId
                                        ? {
                                            ...metric,
                                            conversions: metric.conversions.map((c, i) =>
                                              i === index
                                                ? {
                                                    ...c,
                                                    metricId: measurement.measurement_id,
                                                  }
                                                : c,
                                            ),
                                          }
                                        : metric,
                                    ),
                                  );
                                }}
                              >
                                <span>{metricTranslation}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <ShadcnButton
                  size="icon"
                  variant="ghost"
                  disabled={index === 0}
                  onClick={() => handleDeleteConversion(index)}
                >
                  <Trash2 className="h-5 w-5 text-neutral-300" />
                </ShadcnButton>
              </div>
              {index !== selectedConversions.length - 1 && (
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-20 border-t-2 border-dotted border-neutral-100"></div>
                  <span className="text-xs text-neutral-400">SUM</span>
                  <div className="h-[1px] flex-1 border-t-2 border-dotted border-neutral-100"></div>
                </div>
              )}
            </>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <div className="h-[1px] w-full bg-neutral-100"></div>
        <ShadcnButton data-testid="add_conversion_button" onClick={handleAddConversion} size="icon" variant="ghost">
          <CirclePlus className="h-5 w-5 text-neutral-300" />
        </ShadcnButton>
      </div>
    </div>
  );
};
