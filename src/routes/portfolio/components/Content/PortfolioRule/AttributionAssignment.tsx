import React, { FC, useEffect, useRef, useState } from 'react';
import {
  NexoyaAttributionRule,
  NexoyaAttributionRuleFactorInput,
  NexoyaAttributionRuleFactorSourceInput,
  NexoyaAttributionRuleFactorSourceType,
  NexoyaConversion,
} from '../../../../../types';
import SidePanel, { SidePanelActions } from '../../../../../components/SidePanel';
import ButtonAsync from '../../../../../components/ButtonAsync';
import Button from '../../../../../components/Button';
import { Input } from '../../../../../components-ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../components-ui/Popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../../../components-ui/Command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../../components-ui/DropdownMenu';
import ButtonIcon from '../../../../../components/ButtonIcon';
import SvgPlusCircle from '../../../../../components/icons/PlusCircle';
import SvgEllipsisV from '../../../../../components/icons/EllipsisV';
import { toast } from 'sonner';
import { useTeam } from '../../../../../context/TeamProvider';
import { DateSelector } from '../../../../../components/DateSelector';
import { useRouteMatch } from 'react-router';
import dayjs from 'dayjs';
import { GLOBAL_DATE_FORMAT } from '../../../../../utils/dates';
import { nexyColors } from '../../../../../theme';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components-ui/Table';
import { useUpdateAttributionRuleFactorsMutation } from '../../../../../graphql/portfolioRules/mutationUpdateAttributionRuleFunnelStepMappings';
import { useMeasurementsQuery } from '../../../../../graphql/measurement/queryMeasurements';
import { LIST_CONVERSIONS_QUERY } from '../../../../../graphql/portfolioRules/queryConversions';
import { useLazyQuery } from '@apollo/client';
import translate from '../../../../../utils/translate';
import useTranslationStore from '../../../../../store/translations';
import { orderBy, toNumber } from 'lodash';
import Tooltip from '../../../../../components/Tooltip/Tooltip';
import MultipleSwitch from '../../../../../components/MultipleSwitchFluid';

interface Props {
  isOpen: boolean;
  closeSidePanel: () => void;
  attributionRule: NexoyaAttributionRule | null;
}

interface EditableFactor {
  start: Date;
  value: number | null;
  source: NexoyaAttributionRuleFactorSourceInput;
  isEditing: boolean;
}

const ATTRIBUTION_SOURCE_SECTIONS = [
  { id: 'metric', text: 'Metric' },
  { id: 'customConversions', text: 'Custom Conversions' },
];

const getSourceTypeFromTab = (tab: 'metric' | 'customConversions') =>
  tab === 'metric'
    ? NexoyaAttributionRuleFactorSourceType.Metric
    : NexoyaAttributionRuleFactorSourceType.CustomConversion;

const getCurrentTab = (sourceType: NexoyaAttributionRuleFactorSourceType) =>
  sourceType === NexoyaAttributionRuleFactorSourceType.Metric ? 'metric' : 'customConversions';

/**
 * Determines the conversionMetricId to use, falling back to the first available measurement if needed.
 * Uses explicit null checks since 0 is a valid metricId.
 */
const getConversionMetricId = (
  existingMetricId: number | null | undefined,
  measurements: Array<{ measurement_id: number }>,
): number | null => {
  if (existingMetricId != null) {
    return existingMetricId;
  }
  return measurements.length > 0 ? measurements[0].measurement_id : null;
};

export const AttributionAssignment: FC<Props> = ({ isOpen, closeSidePanel, attributionRule }) => {
  const { teamId } = useTeam();
  const match = useRouteMatch<{ portfolioID: string }>();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const { translations } = useTranslationStore();

  // State
  const [factors, setFactors] = useState<EditableFactor[]>([]);
  const [conversions, setConversions] = useState<NexoyaConversion[]>([]);
  const [isLoadingConversions, setIsLoadingConversions] = useState(false);
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  // Refs
  const didFetchConversions = useRef(false);

  // Attribution rule data
  const providerId = attributionRule?.filters?.providerId;
  const adAccountIds = attributionRule?.filters?.adAccountIds;

  // Queries
  const { data: measurementsData, loading: measurementsLoading } = useMeasurementsQuery({ providerId });
  const measurements = measurementsData?.measurements ?? [];
  const [fetchConversions] = useLazyQuery<{ listConversions: NexoyaConversion[] }>(LIST_CONVERSIONS_QUERY);

  // Fetch conversions when needed
  useEffect(() => {
    if (didFetchConversions.current || !adAccountIds?.length || !providerId) return;

    const loadConversions = async () => {
      setIsLoadingConversions(true);
      try {
        const { data } = await fetchConversions({
          variables: { adAccountContentIds: adAccountIds, teamId },
        });
        if (data?.listConversions) {
          setConversions(data.listConversions);
        }
      } catch (error) {
        console.error('Failed to fetch conversions:', error);
      } finally {
        setIsLoadingConversions(false);
        didFetchConversions.current = true;
      }
    };

    loadConversions();
  }, [adAccountIds, providerId, teamId, fetchConversions]);

  const [updateAttributionRuleFactorsMutation, { loading }] = useUpdateAttributionRuleFactorsMutation({
    portfolioId: portfolioId!,
    onCompleted: () => {
      closeSidePanel();
    },
  });

  // Initialize factors from attribution rule
  useEffect(() => {
    if (!attributionRule?.factors) {
      setFactors([]);
      return;
    }

    const initializeFactorSource = (source: any): NexoyaAttributionRuleFactorSourceInput => {
      // Determine source type: explicit type, or infer from data, or default to Metric
      let type = source?.type || NexoyaAttributionRuleFactorSourceType.Metric;

      if (!source?.type && (source?.conversionName || source?.accountConversionIds)) {
        type = NexoyaAttributionRuleFactorSourceType.CustomConversion;
      }

      const isCustomConversion = type === NexoyaAttributionRuleFactorSourceType.CustomConversion;

      const conversionMetricId = isCustomConversion
        ? getConversionMetricId(source?.conversionMetricId, measurements)
        : null;

      return {
        type,
        metricId: type === NexoyaAttributionRuleFactorSourceType.Metric ? source?.metricId : null,
        conversionName: type === NexoyaAttributionRuleFactorSourceType.CustomConversion ? source?.conversionName : null,
        accountConversionIds:
          type === NexoyaAttributionRuleFactorSourceType.CustomConversion && source?.accountConversionIds != null
            ? Array.from(new Set(source.accountConversionIds))
            : null,
        conversionMetricId,
      };
    };

    const editableFactors = orderBy(attributionRule.factors, ['start'], ['desc']).map((factor) => ({
      start: factor.start,
      value: factor.value,
      source: initializeFactorSource(factor.source),
      isEditing: false,
    }));

    setFactors(editableFactors);
  }, [attributionRule, measurements]);

  const handleAddFactor = () => {
    setFactors((prev) => [
      ...prev,
      {
        start: new Date(),
        value: null,
        source: {
          type: NexoyaAttributionRuleFactorSourceType.Metric,
          metricId: null,
          conversionName: null,
          accountConversionIds: null,
          conversionMetricId: null,
        },
        isEditing: true,
      },
    ]);
  };

  const handleEditFactor = (index: number) => {
    setFactors((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isEditing: !updated[index].isEditing };
      return updated;
    });
  };

  const handleRemoveFactor = (index: number) => {
    setFactors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDateChange = (index: number, start?: Date) => {
    if (!start) return;
    setFactors((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], start };
      return updated;
    });
  };

  const handleFromChange = (index: number, val: string) => {
    setFactors((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        source: {
          ...updated[index].source,
          metricId: val ? Number(val) : null,
          // Clear conversion fields when selecting metric
          conversionName: null,
          accountConversionIds: null,
          conversionMetricId: null,
        },
      };
      return updated;
    });
  };

  const handleConversionGoalChange = (index: number, conversion: NexoyaConversion) => {
    setFactors((prev) => {
      const updated = [...prev];
      const currentSource = updated[index].source;
      const conversionMetricId = getConversionMetricId(currentSource.conversionMetricId, measurements);

      // Deduplicate accountConversionIds to prevent duplicate IDs
      // Use explicit null check to preserve empty arrays (empty arrays are falsy but semantically different from null)
      const uniqueAccountConversionIds =
        conversion.accountConversionIds != null
          ? Array.from(new Set(conversion.accountConversionIds))
          : null;

      updated[index] = {
        ...updated[index],
        source: {
          ...updated[index].source,
          conversionName: conversion.conversionName,
          accountConversionIds: uniqueAccountConversionIds,
          conversionMetricId,
          // Clear metricId for custom conversions
          metricId: null,
        },
      };
      return updated;
    });
  };

  const handleCustomConversionMetricChange = (index: number, metricId: number | null) => {
    setFactors((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        source: {
          ...updated[index].source,
          conversionMetricId: metricId,
          // Don't set metricId for custom conversions
          metricId: null,
        },
      };
      return updated;
    });
  };

  const handleTabChange = (index: number, tab: 'metric' | 'customConversions') => {
    setFactors((prev) => {
      const updated = [...prev];
      const isMetric = tab === 'metric';
      const currentSource = updated[index].source;

      const conversionMetricId = !isMetric
        ? getConversionMetricId(currentSource.conversionMetricId, measurements)
        : null;

      updated[index] = {
        ...updated[index],
        source: {
          type: getSourceTypeFromTab(tab),
          metricId: isMetric ? currentSource.metricId : null,
          conversionName: !isMetric ? currentSource.conversionName : null,
          accountConversionIds: !isMetric ? currentSource.accountConversionIds : null,
          conversionMetricId,
        },
      };

      return updated;
    });
  };

  const handleFactorChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^\d.]/g, '');
    setFactors((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], value: cleaned as any };
      return updated;
    });
  };

  // Helper functions for validation
  const isValidFactorValue = (value: number | null): boolean => {
    if (value == null || !value) return false;
    const numValue = Number(value);
    return !isNaN(numValue) && numValue >= 0;
  };

  const isFactorComplete = (factor: EditableFactor): boolean => {
    if (factor.isEditing || !factor.start || !isValidFactorValue(factor.value)) {
      return false;
    }

    const isCustomConversion = factor.source.type === NexoyaAttributionRuleFactorSourceType.CustomConversion;

    if (isCustomConversion) {
      return Boolean(
        factor.source.conversionName && factor.source.accountConversionIds && factor.source.conversionMetricId,
      );
    }

    return Boolean(factor.source.metricId);
  };

  const isFactorValidForSave = (factor: EditableFactor): boolean => {
    if (!isValidFactorValue(factor.value)) return false;

    const isCustomConversion = factor.source.type === NexoyaAttributionRuleFactorSourceType.CustomConversion;

    if (isCustomConversion) {
      return Boolean(
        factor.source.conversionName && factor.source.accountConversionIds && factor.source.conversionMetricId,
      );
    }

    return Boolean(factor.source.metricId);
  };

  const atLeastOneAttributedTarget = factors.some(isFactorComplete);
  const allRowsValid = factors.every(isFactorValidForSave);

  // Helper functions for display text
  const getMetricName = (metricId: number | null, factorType?: NexoyaAttributionRuleFactorSourceType): string => {
    if (factorType && factorType === NexoyaAttributionRuleFactorSourceType.CustomConversion) {
      return 'Custom conversions';
    }

    if (!metricId) return 'Select measurement';
    const metric = measurements.find((m) => m.measurement_id === metricId);
    return translate(translations, metric?.name) || 'Select measurement';
  };

  const getFactorDisplayText = (factor: EditableFactor): string => {
    const isCustomConversion = factor.source.type === NexoyaAttributionRuleFactorSourceType.CustomConversion;

    if (isCustomConversion) {
      return 'Custom Conversions';
    }

    return getMetricName(factor.source.metricId, factor.source.type);
  };

  const getFactorTooltipText = (factor: EditableFactor): string => {
    const isCustomConversion = factor.source.type === NexoyaAttributionRuleFactorSourceType.CustomConversion;

    if (isCustomConversion) {
      if (factor.source.conversionName) {
        const metricName = factor.source.conversionMetricId
          ? getMetricName(factor.source.conversionMetricId)
          : 'Select metric';
        return `${factor.source.conversionName} - ${metricName}`;
      }
      return 'Custom Conversions';
    }

    return getMetricName(factor.source.metricId, factor.source.type);
  };

  // Save mapping
  const handleSave = () => {
    if (!attributionRule) return;

    if (!allRowsValid) {
      toast.error('Please select a metric for each row with an attribution value.');
      return;
    }

    if (!atLeastOneAttributedTarget) {
      toast.error('No attributed funnel step available to map to.');
      return;
    }

    const inputFactors: NexoyaAttributionRuleFactorInput[] = factors.map((factor) => {
      const isCustomConversion = factor.source.type === NexoyaAttributionRuleFactorSourceType.CustomConversion;

      const source: any = {
        type: factor.source.type,
        ...(isCustomConversion
          ? {
              conversionName: factor.source.conversionName,
              accountConversionIds: factor.source.accountConversionIds,
              conversionMetricId: factor.source.conversionMetricId,
            }
          : {
              metricId: factor.source.metricId,
            }),
      };

      return {
        start: dayjs(factor.start).format(GLOBAL_DATE_FORMAT),
        value: toNumber(factor.value),
        source: source as NexoyaAttributionRuleFactorSourceInput,
      };
    });

    updateAttributionRuleFactorsMutation({
      variables: {
        attributionRuleId: attributionRule.attributionRuleId,
        factors: inputFactors,
        portfolioId,
        teamId,
      },
    }).catch((error) => toast.error(error.message));
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={closeSidePanel}
      paperProps={{ style: { width: 'calc(100% - 218px)', paddingBottom: '78px' } }}
    >
      {/* Top Section */}
      <div className="border border-b-[#eaeaea] px-6 py-5">
        <h3 className="mb-1 text-xl font-medium text-neutral-900">Assign attribution factors</h3>
      </div>

      <div className="p-6">
        <div className="mb-7 text-sm text-neutral-400">
          <div className="text-mdlg text-neutral-700">{attributionRule?.name}</div>
          <div className="mb-6 font-normal">
            Select a timeframe, choose the source metric, and set its attribution value.
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-xl border-collapse border border-neutral-100 text-sm">
            <TableHeader>
              <TableRow className="border-b border-neutral-100 text-left">
                <TableHead className="min-w-[220px] border-r border-neutral-100 px-4 py-3 font-medium text-neutral-500">
                  Start date
                </TableHead>
                <TableHead className="min-w-[260px] border-r border-neutral-100 px-4 py-3 font-medium text-neutral-500">
                  Attributed from metric
                </TableHead>
                <TableHead className="min-w-[200px] px-4 py-3 font-medium text-neutral-500">
                  Attribution factor
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {factors.map((factor, idx) => (
                <TableRow key={idx} className="border-b border-neutral-100 text-neutral-700">
                  {/* Factor cell */}
                  <TableCell className="border-r border-neutral-100 px-4 py-3 pl-1 align-middle">
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <ButtonIcon>
                            <SvgEllipsisV />
                          </ButtonIcon>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onSelect={() => handleEditFactor(idx)}>Edit timeframe</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleRemoveFactor(idx)}>Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {factor.isEditing ? (
                        <DateSelector
                          hidePastQuickSelection
                          hideFutureQuickSelection
                          isSingleDate
                          placeholder="Select start date"
                          dateTo={null}
                          disableAfterDate={new Date()}
                          showSingleDateSwitcher={false}
                          defaultDatePickerOpen={factor.isEditing}
                          dateFrom={factor.start}
                          panelProps={{ side: 'bottom', align: 'start' }}
                          onDateChange={({ singleDate }) => {
                            handleDateChange(idx, singleDate);
                            handleEditFactor(idx);
                          }}
                        />
                      ) : (
                        <div className="flex items-center font-normal text-neutral-400">
                          {dayjs(factor.start).format('D MMM YYYY')}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* From measurement select */}
                  <TableCell className="border-r border-neutral-100 px-4 py-3 align-top">
                    <Popover
                      open={openPopoverIndex === idx}
                      onOpenChange={(open) => setOpenPopoverIndex(open ? idx : null)}
                    >
                      <PopoverTrigger asChild>
                        <div
                          className={cn(
                            'w-56 whitespace-pre rounded-md border border-neutral-100 bg-white p-2 shadow-sm',
                            { 'cursor-not-allowed opacity-50': measurementsLoading },
                          )}
                        >
                          <Tooltip
                            placement="top"
                            popperProps={{ style: { zIndex: 3301 } }}
                            style={{ wordBreak: 'break-word', width: '100%' }}
                            variant="dark"
                            content={getFactorTooltipText(factor)}
                          >
                            <span className="flex cursor-pointer items-center justify-between truncate text-sm text-neutral-700">
                              {getFactorDisplayText(factor)}
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </span>
                          </Tooltip>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[400px] border border-neutral-100 bg-white p-0 shadow-md"
                        align="start"
                      >
                        <div className="flex flex-col">
                          {/* Source type selector */}
                          <div className="w-full px-3 pt-3">
                            <MultipleSwitch
                              switchClassname="w-full"
                              sectionClassname="w-full justify-center"
                              sections={ATTRIBUTION_SOURCE_SECTIONS}
                              initial={getCurrentTab(factor.source.type)}
                              current={getCurrentTab(factor.source.type)}
                              onToggle={(tab: string) => handleTabChange(idx, tab as 'metric' | 'customConversions')}
                            />
                          </div>

                          {/* Content based on selected tab */}
                          {factor.source.type === NexoyaAttributionRuleFactorSourceType.Metric ? (
                            <Command className="mt-3 bg-white">
                              <CommandInput placeholder="Search measurements..." borderColor="border-neutral-100" />
                              <CommandList>
                                <CommandEmpty>No measurements found.</CommandEmpty>
                                <CommandGroup>
                                  {measurements.map((m) => {
                                    const isActive = factor.source.metricId === m.measurement_id;
                                    return (
                                      <CommandItem
                                        key={m.measurement_id}
                                        value={translate(translations, m.name)}
                                        className={cn(
                                          isActive ? 'bg-neutral-100 text-black' : '',
                                          'aria-selected:bg-neutral-100',
                                        )}
                                        onSelect={() => {
                                          handleFromChange(idx, m.measurement_id.toString());
                                          setOpenPopoverIndex(null);
                                        }}
                                      >
                                        {isActive && <Check className="ml-1 mr-2 h-4 w-4 opacity-60" />}
                                        <span className="text-neutral-800" title={translate(translations, m.name)}>
                                          {translate(translations, m.name)}
                                        </span>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          ) : (
                            <div className="flex flex-col gap-3 p-3">
                              {/* Conversion goal selector */}
                              <div className="flex flex-col gap-1">
                                <label className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                  Conversion goal
                                  {isLoadingConversions && (
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-neutral-200 border-t-transparent" />
                                  )}
                                </label>
                                <Popover>
                                  <PopoverTrigger disabled={isLoadingConversions} asChild>
                                    <div className="flex w-full cursor-pointer items-center justify-between truncate rounded-md border border-neutral-100 bg-white p-2 text-sm text-neutral-700 shadow-sm">
                                      <span className="truncate">
                                        {(factor.source.type ===
                                          NexoyaAttributionRuleFactorSourceType.CustomConversion &&
                                          factor.source.conversionName) ||
                                          'Select conversion goal'}
                                      </span>
                                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full p-0" align="start">
                                    <Command>
                                      <CommandInput placeholder="Search conversions..." />
                                      <CommandList>
                                        <CommandEmpty>No conversions found.</CommandEmpty>
                                        <CommandGroup>
                                          {conversions.map((conv) => {
                                            const isActive = factor.source.conversionName === conv.conversionName;

                                            return (
                                              <CommandItem
                                                key={conv.accountConversionIds.join()}
                                                value={conv.conversionName}
                                                className={cn(isActive && 'bg-neutral-700 text-white')}
                                                onSelect={() => handleConversionGoalChange(idx, conv)}
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
                              </div>

                              {/* Attributed from metric selector */}
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-neutral-500">Attributed from metric</label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <div className="flex w-full cursor-pointer items-center justify-between truncate rounded-md border border-neutral-100 bg-white p-2 text-sm text-neutral-700 shadow-sm">
                                      <span className="truncate">
                                        {getMetricName(factor.source.conversionMetricId)}
                                      </span>
                                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full p-0" align="start">
                                    <Command>
                                      <CommandInput placeholder="Search metrics..." />
                                      <CommandList>
                                        <CommandEmpty>No metrics found.</CommandEmpty>
                                        <CommandGroup>
                                          {measurements.map((measurement) => {
                                            const metricName = translate(translations, measurement.name);
                                            const isActive =
                                              factor.source.conversionMetricId === measurement.measurement_id;
                                            return (
                                              <CommandItem
                                                key={measurement.measurement_id}
                                                value={metricName}
                                                className={cn(isActive && 'bg-neutral-700 text-white')}
                                                onSelect={() =>
                                                  handleCustomConversionMetricChange(idx, measurement.measurement_id)
                                                }
                                              >
                                                {isActive && <Check className="ml-1 mr-2 h-4 w-4 opacity-60" />}
                                                <span>{metricName}</span>
                                              </CommandItem>
                                            );
                                          })}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>

                  {/* Factor input */}
                  <TableCell className="px-4 py-3 align-top">
                    <Input
                      type="text"
                      lang="en-US"
                      value={factor.value}
                      placeholder="Enter the attribution factor..."
                      onChange={(e) => handleFactorChange(idx, e.target.value)}
                      className="w-56 border-0 focus:border-2 focus:border-green-400"
                      onBlur={(e) => {
                        const cleaned = e.target.value.replace(/[^\d.]/g, '');
                        handleFactorChange(idx, cleaned);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add timeframe */}
          <div className="flex items-center border border-t-0 border-neutral-100 py-2 pl-2">
            <ButtonIcon onClick={handleAddFactor}>
              <SvgPlusCircle style={{ height: 16, width: 16, color: nexyColors.neutral300 }} />
            </ButtonIcon>
            <div className="h-[1px] w-full bg-neutral-100" />
          </div>
        </div>
      </div>

      <SidePanelActions className="!fixed bottom-0 z-[3400] !w-[calc(100%-218px)] border-t border-neutral-100">
        <Button id="previous" variant="contained" onClick={closeSidePanel}>
          Cancel
        </Button>
        <ButtonAsync
          id="next"
          variant="contained"
          color="primary"
          loading={loading}
          disabled={loading || !allRowsValid || !atLeastOneAttributedTarget}
          onClick={handleSave}
        >
          Save and apply
        </ButtonAsync>
      </SidePanelActions>
    </SidePanel>
  );
};
