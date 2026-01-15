import React, { FC, useEffect, useMemo, useState } from 'react';
import Tooltip from '../../components/Tooltip';
import SvgInfoCircle from '../../components/icons/InfoCircle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components-ui/Table';
import ButtonIcon from '../../components/ButtonIcon';
import SvgPlusCircle from '../../components/icons/PlusCircle';
import SvgEllipsisV from '../../components/icons/EllipsisV';
import { nexyColors } from '../../theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components-ui/DropdownMenu';
import { Select, SelectContent, SelectTrigger } from '../../components-ui/Select';
import { Input } from '../../components-ui/Input';
import { Button as ShadcnButton } from '../../components-ui/Button';
import Button from '../../components/Button';
import ButtonAsync from '../../components/ButtonAsync';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components-ui/Dialog';
import Checkbox from '../../components/Checkbox';
import { DateSelector } from '../../components/DateSelector';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { CURRENCY_LIST, findCurrency } from '../../utils/currencies';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../components-ui/Command';
import { ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import { useReplaceCurrencyExchangeTimeframesMutation } from '../../graphql/currency/mutationUpsertCurrencyExchangeTimeframes';
import { useCurrencyExchangeTimeframesQuery } from '../../graphql/currency/queryCurrencyExchangeTimeframes';
import { GLOBAL_DATE_FORMAT } from '../../utils/dates';
import { useCurrencyStore } from '../../store/currency-selection';
import { NexoyaCurrencyExchangeTimeframe } from '../../types';
import { isEqual, orderBy } from 'lodash';
import { useTeam } from '../../context/TeamProvider';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface ExchangeRateTimeframe extends Omit<NexoyaCurrencyExchangeTimeframe, 'rates'> {
  id: number;
  isEditing: boolean;
  rates: LocalRate[];
}

interface LocalRate {
  value: number | string | null;
  currencyExchangeRateId?: number;
}

interface CurrencyColumn {
  id: number;
  from: string; // channel currency (editable)
  to: string;
}

export const CurrencyExchangeRates: FC = () => {
  const {
    currency: mainCurrency,
    missingCurrencyPairs,
    missingCurrencyRanges,
    setMissingCurrencyPairs,
    setMissingCurrencyRanges,
    setMissingCurrencyCoverage,
  } = useCurrencyStore();
  const { teamId } = useTeam();

  const [timeframes, setTimeframes] = useState<ExchangeRateTimeframe[]>([]);
  const [initialTimeframes, setInitialTimeframes] = useState<ExchangeRateTimeframe[]>([]);
  const [currencyColumns, setCurrencyColumns] = useState<CurrencyColumn[]>([]);
  const [initialCurrencyColumns, setInitialCurrencyColumns] = useState<CurrencyColumn[]>([]);
  const [showInvertModal, setShowInvertModal] = useState(false);
  const [hideMessage, setHideMessage] = useState(localStorage.getItem('hideUnlinkMessage') === 'true');
  const [invertingColumnIndex, setInvertingColumnIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Tooltip context for dynamic end-date behavior while editing
  const [dynamicTooltip, setDynamicTooltip] = useState<{
    variant: 'after' | 'before';
    // when variant = 'after', we show before/after for the previous (ongoing) timeframe
    previousStart?: Date | null;
    previousOldEnd?: Date | null; // usually null/present
    previousNewEnd?: Date | null; // selectedDate - 1 day
    newStart?: Date | null; // selectedDate
  } | null>(null);

  const { replaceCurrencyExchangeTimeframes, loading: saving } = useReplaceCurrencyExchangeTimeframesMutation();
  const {
    loading: loadingTimeframes,
    error: queryError,
    refetch: refetchTimeframes,
    data,
  } = useCurrencyExchangeTimeframesQuery();

  useEffect(() => {
    if (!data) return;
    const existingTimeframes = data.currencyExchangeTimeframes;

    const uniqueCurrencyPairs = new Set<string>();
    existingTimeframes.forEach((tf: any) => {
      tf.rates?.forEach((rate: any) => {
        uniqueCurrencyPairs.add(`${rate.fromCurrency}-${rate.toCurrency}`);
      });
    });

    let columns: CurrencyColumn[] = Array.from(uniqueCurrencyPairs).map((pair, index) => {
      const [from, to] = pair.split('-');
      return { id: index + 1, from, to };
    });

    const existingPairKeys = new Set(columns.map((c) => `${c.from}-${c.to}`));
    const pairsToAdd = (missingCurrencyPairs || []).filter((p) => !existingPairKeys.has(`${p.from}-${p.to}`));
    if (pairsToAdd.length) {
      const startId = columns.length + 1;
      const newCols: CurrencyColumn[] = pairsToAdd.map((p, idx) => ({ id: startId + idx, from: p.from, to: p.to }));
      columns = [...columns, ...newCols];
    }

    setCurrencyColumns(columns);
    setInitialCurrencyColumns(columns);

    const transformedTimeframes: ExchangeRateTimeframe[] = existingTimeframes.map(
      (tf: ExchangeRateTimeframe, index: number) => {
        const rates = columns.map((col) => {
          const matchingRate = tf.rates?.find(
            (rate: any) => rate.fromCurrency === col.from && rate.toCurrency === col.to,
          );
          return {
            value: matchingRate ? matchingRate.value : null,
            currencyExchangeRateId: matchingRate?.currencyExchangeRateId,
          } as LocalRate;
        });

        return {
          id: index,
          currencyExchangeTimeframeId: tf.currencyExchangeTimeframeId,
          start: tf.start ? new Date(tf.start) : null,
          end: tf.end ? new Date(tf.end) : null,
          rates,
          isEditing: false,
        };
      },
    );

    let sortedTimeframes = orderBy(transformedTimeframes, (tf) => tf.start, 'desc');

    const ensureRangePresent = (fromISO: string, toISO: string) => {
      if (!fromISO || !toISO) return;
      const fromDate = new Date(fromISO);
      const toDate = new Date(toISO);
      const isCovered = sortedTimeframes.some((tf) => {
        const s = tf.start ? dayjs(tf.start).startOf('day') : null;
        const e = tf.end ? dayjs(tf.end).startOf('day') : null;
        if (!s) return false;
        const fromD = dayjs(fromDate).startOf('day');
        const toD = dayjs(toDate).startOf('day');
        const endToCompare = e || dayjs().startOf('day');
        return fromD.isSameOrAfter(s, 'day') && toD.isSameOrBefore(endToCompare, 'day');
      });
      if (!isCovered) {
        sortedTimeframes = [
          ...sortedTimeframes,
          {
            id: Date.now() + Math.round(Math.random() * 1000),
            currencyExchangeTimeframeId: undefined,
            start: fromDate,
            end: null,
            rates: columns.map(() => ({ value: null }) as LocalRate),
            isEditing: false,
            teamId,
          } as ExchangeRateTimeframe,
        ];
      }
    };

    (missingCurrencyRanges || []).forEach((r) => ensureRangePresent(r.from, r.to));

    sortedTimeframes = orderBy(sortedTimeframes, (tf) => tf.start, 'desc');

    setTimeframes(sortedTimeframes);
    setInitialTimeframes(
      sortedTimeframes.map((tf) => ({
        ...tf,
        rates: tf.rates.map((rate) => ({ ...rate })),
      })),
    );
  }, [data, missingCurrencyPairs, missingCurrencyRanges, teamId]);

  // Clear missing currency context when leaving the page (unsaved navigation)
  useEffect(() => {
    return () => {
      setMissingCurrencyPairs([]);
      setMissingCurrencyRanges([]);
      setMissingCurrencyCoverage(false);
    };
  }, []);

  // Check for changes to enable/disable buttons
  useEffect(() => {
    // Compare timeframes ignoring the isEditing property
    const timeframesChanged = !isEqual(
      timeframes.map((tf) => ({ ...tf, isEditing: false })),
      initialTimeframes.map((tf) => ({ ...tf, isEditing: false })),
    );
    const columnsChanged = !isEqual(currencyColumns, initialCurrencyColumns);

    setHasChanges(timeframesChanged || columnsChanged);
  }, [timeframes, currencyColumns, initialTimeframes, initialCurrencyColumns]);

  const handleAddTimeframe = () => {
    setTimeframes((prev) => [
      ...prev,
      {
        id: prev.length,
        start: new Date(),
        end: new Date(),
        rates: currencyColumns.map(
          () =>
            ({
              value: null,
              currencyExchangeRateId: undefined,
            }) as LocalRate,
        ),
        isEditing: true,
        currencyExchangeTimeframeId: undefined,
        teamId,
      },
    ]);
  };

  const handleAddColumn = () => {
    const usedFromCurrencies = currencyColumns.map((col) => col.from);

    const nextCurrency = CURRENCY_LIST.find((c) => !usedFromCurrencies.includes(c.code) && c.code !== mainCurrency);

    setCurrencyColumns((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: nextCurrency?.code || '', // channel currency (editable)
        to: mainCurrency, // team currency (fixed)
      },
    ]);

    setTimeframes((prev) =>
      prev.map((tf) => ({
        ...tf,
        rates: [...tf.rates, { value: null } as LocalRate],
      })),
    );
  };

  const handleInvertRate = () => {
    if (invertingColumnIndex === null) return;

    const newCols = [...currencyColumns];
    const col = newCols[invertingColumnIndex];
    const { from, to } = col;
    col.from = to;
    col.to = from;
    setCurrencyColumns(newCols);

    setTimeframes((prev) =>
      prev.map((tf) => ({
        ...tf,
        rates: tf.rates.map((rate, rateIndex) => {
          if (rateIndex === invertingColumnIndex && rate.value) {
            const numericValue = typeof rate.value === 'string' ? parseFloat(rate.value) : rate.value;
            return { ...rate, value: 1 / numericValue };
          }
          return rate;
        }),
      })),
    );
    setShowInvertModal(false);
    setInvertingColumnIndex(null);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setHideMessage(checked);
    localStorage.setItem('hideUnlinkMessage', JSON.stringify(checked));
  };

  const openInvertModal = (columnIndex: number) => {
    setInvertingColumnIndex(columnIndex);
    if (!hideMessage) {
      setShowInvertModal(true);
    } else {
      handleInvertRate();
    }
  };

  const handleEditTimeframe = (index: number) => {
    setTimeframes((prev) => {
      const updated = [...prev];
      updated[index].isEditing = !updated[index].isEditing;
      return updated;
    });
    // Reset tooltip context whenever toggling edit mode
    setDynamicTooltip(null);
  };

  const handleRemoveTimeframe = (index: number) => {
    setTimeframes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDateChange = (index: number, start: Date | undefined, end: Date | undefined) => {
    if (!start) return;

    setTimeframes((prev) => {
      const updated = [...prev];

      // Only set the start date, keep end date as provided (or null)
      updated[index].start = start;
      updated[index].end = end ?? null;

      // Calculate tooltip information without modifying other timeframes
      const selected = dayjs(start).startOf('day');

      // Find the next timeframe (the one that starts after the selected date)
      const sortedTimeframes = updated
        .map((tf, i) => ({ tf, i }))
        .filter(({ tf, i }) => i !== index && tf.start)
        .sort((a, b) => dayjs(a.tf.start!).valueOf() - dayjs(b.tf.start!).valueOf());

      const nextTimeframe = sortedTimeframes.find(({ tf }) => dayjs(start).isBefore(dayjs(tf.start!), 'day'))?.tf;

      // Identify the ongoing timeframe (the one that currently ends in the present)
      const ongoingIndex = updated.findIndex((tf, i) => i !== index && tf.start && !tf.end);
      const ongoing = ongoingIndex >= 0 ? updated[ongoingIndex] : null;

      if (nextTimeframe) {
        // There's a next timeframe - show what the end would be
        const autoEnd = dayjs(nextTimeframe.start!).subtract(1, 'day').toDate();
        setDynamicTooltip({
          variant: 'before',
          newStart: start,
          previousStart: nextTimeframe.start ? new Date(nextTimeframe.start) : null,
          previousNewEnd: autoEnd,
        });
      } else if (ongoing && ongoing.start) {
        const ongoingStart = dayjs(ongoing.start).startOf('day');

        if (selected.isAfter(ongoingStart, 'day')) {
          // Selecting AFTER the ongoing timeframe's start:
          // show what would happen to the ongoing timeframe
          const newEnd = selected.subtract(1, 'day').toDate();
          setDynamicTooltip({
            variant: 'after',
            previousStart: ongoing.start ? new Date(ongoing.start) : null,
            previousOldEnd: null, // previously present
            previousNewEnd: newEnd,
            newStart: start,
          });
        } else if (selected.isBefore(ongoingStart, 'day')) {
          // Selecting BEFORE the ongoing timeframe's start:
          // show what the end would be
          const autoEnd = ongoingStart.subtract(1, 'day').toDate();
          setDynamicTooltip({
            variant: 'before',
            newStart: start,
            previousStart: ongoing.start ? new Date(ongoing.start) : null,
            previousNewEnd: autoEnd,
          });
        }
      }

      return updated;
    });
  };

  // Preview-only tooltip logic when clicking a day in the calendar (single-date mode)
  const handlePreviewSingleDate = (index: number, selectedDate: Date) => {
    const updated = [...timeframes];
    const ongoingIndex = updated.findIndex((tf, i) => i !== index && tf.start && !tf.end);
    const ongoing = ongoingIndex >= 0 ? updated[ongoingIndex] : null;

    // Find the next timeframe (the one that starts after the selected date)
    // Sort all timeframes by start date and find the first one that starts after our selected date
    const sortedTimeframes = updated
      .map((tf, i) => ({ tf, i }))
      .filter(({ tf, i }) => i !== index && tf.start)
      .sort((a, b) => dayjs(a.tf.start!).valueOf() - dayjs(b.tf.start!).valueOf());

    const nextTimeframe = sortedTimeframes.find(({ tf }) => dayjs(selectedDate).isBefore(dayjs(tf.start!), 'day'))?.tf;

    const selected = dayjs(selectedDate).startOf('day');

    if (nextTimeframe) {
      // There's a next timeframe - set end to the day before it
      const autoEnd = dayjs(nextTimeframe.start!).subtract(1, 'day').toDate();
      setDynamicTooltip({
        variant: 'before',
        newStart: selectedDate,
        previousStart: nextTimeframe.start ? new Date(nextTimeframe.start) : null,
        previousNewEnd: autoEnd,
      });
    } else if (ongoing && ongoing.start) {
      const ongoingStart = dayjs(ongoing.start).startOf('day');

      if (selected.isAfter(ongoingStart, 'day')) {
        const newEnd = selected.subtract(1, 'day').toDate();
        setDynamicTooltip({
          variant: 'after',
          previousStart: ongoing.start ? new Date(ongoing.start) : null,
          previousOldEnd: null,
          previousNewEnd: newEnd,
          newStart: selectedDate,
        });
      } else if (selected.isBefore(ongoingStart, 'day')) {
        // Selecting BEFORE the ongoing timeframe's start:
        // set end to the day before the ongoing start
        const autoEnd = ongoingStart.subtract(1, 'day').toDate();
        setDynamicTooltip({
          variant: 'before',
          newStart: selectedDate,
          previousStart: ongoing.start ? new Date(ongoing.start) : null,
          previousNewEnd: autoEnd,
        });
      }
    }
  };

  const handleRateChange = (timeframeIndex: number, rateIndex: number, value: string) => {
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    const parts = cleanedValue.split('.');
    const finalValue = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : parts[0];

    setTimeframes((prev) =>
      prev.map((timeframe, idx) => {
        if (idx !== timeframeIndex) {
          return timeframe;
        }

        const newRates = timeframe.rates.map((rate, rateIdx) => {
          if (rateIdx !== rateIndex) {
            return rate;
          }
          // Keep the string value while typing, only convert to number when it's a complete number
          const valueToSet = finalValue === '' ? null : finalValue;
          return {
            ...rate,
            value: valueToSet,
          };
        });

        return {
          ...timeframe,
          rates: newRates,
        };
      }),
    );
  };

  const handleRemoveColumn = (index: number) => {
    setCurrencyColumns((prev) => prev.filter((_, i) => i !== index));
    setTimeframes((prev) =>
      prev.map((tf) => {
        const newRates = [...tf.rates];
        newRates.splice(index, 1);
        return { ...tf, rates: newRates };
      }),
    );
  };

  const handleSave = async () => {
    try {
      // Transform the local state to the format expected by the mutation
      const timeframesInput = timeframes.map((timeframe) => {
        const rates = timeframe.rates
          .map((rate, index) => {
            // @ts-ignore
            if (rate.value === null || rate.value === undefined || rate.value === '') return null;

            return {
              currencyExchangeRateId: rate.currencyExchangeRateId,
              currencyExchangeTimeframeId: timeframe.currencyExchangeTimeframeId,
              fromCurrency: currencyColumns[index]?.from,
              toCurrency: currencyColumns[index]?.to,
              value: typeof rate.value === 'string' ? parseFloat(rate.value) : rate.value,
            };
          })
          .filter((rate) => rate !== null);

        return {
          currencyExchangeTimeframeId: timeframe.currencyExchangeTimeframeId,
          start: timeframe.start ? dayjs(timeframe.start).format(GLOBAL_DATE_FORMAT) : null,
          end: timeframe.end ? dayjs(timeframe.end).format(GLOBAL_DATE_FORMAT) : null,
          rates,
        };
      });

      await replaceCurrencyExchangeTimeframes({
        variables: {
          timeframes: timeframesInput,
        },
      });

      // Refetch the data after successful save
      await refetchTimeframes();
      setHasChanges(false);

      toast.success('Currency exchange rates saved successfully');
    } catch (error) {
      console.error('Error saving currency exchange timeframes:', error);
      toast.error(error.message || 'Failed to save currency exchange rates');
    }
  };

  const handleCancel = () => {
    setTimeframes(initialTimeframes);
    setCurrencyColumns(initialCurrencyColumns);
    setHasChanges(false);
  };

  const allRatesFilled = useMemo(
    () =>
      timeframes.every((tf) =>
        tf.rates.every((rate, index) => {
          const column = currencyColumns[index];
          if (column && column.from && column.to) {
            const value = rate.value;
            return value !== null && value !== '' && !value.toString().endsWith('.') && !isNaN(Number(value));
          }
          return true; // Don't validate rates for incomplete columns
        }),
      ),
    [timeframes, currencyColumns],
  );

  if (loadingTimeframes) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <p className="text-neutral-500">Loading currency exchange rates...</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <p className="text-neutral-500">Error loading currency exchange rates. Please try again.</p>
        </div>
      </div>
    );
  }

  const renderBeforeAndAfterDynamicEndDateTooltip = () => {
    if (dynamicTooltip?.variant === 'after') {
      const newStartStr = dynamicTooltip.newStart ? dayjs(dynamicTooltip.newStart).format('D MMM YYYY') : '';
      const prevStartStr = dynamicTooltip.previousStart ? dayjs(dynamicTooltip.previousStart).format('D MMM YYYY') : '';
      const prevNewEndStr = dynamicTooltip.previousNewEnd
        ? dayjs(dynamicTooltip.previousNewEnd).format('D MMM YYYY')
        : '';

      return (
        <div className="w-[370px] px-1 py-2.5">
          <div className="text-neutral-200">
            <p className="mb-3 flex items-center text-xs font-semibold uppercase">
              <span className="mr-2 text-[10px] text-green-300">●</span>
              New exchange rates
            </p>
            <div className="flex items-center justify-between px-4">
              <div className="font-normal text-neutral-200">Timeframe</div>
              <div className="text-sm text-neutral-100">{newStartStr} - present</div>
            </div>
          </div>
          <div className="my-4 h-[1px] w-full bg-[#424347]" />
          <div className="text-neutral-200">
            <p className="mb-3 flex items-center text-xs font-semibold uppercase">
              <span className="mr-2 text-[10px] text-purple-300">●</span>
              Previous exchange rates
            </p>
            <div className="flex items-center justify-between px-4">
              <div className="font-normal text-neutral-200">New timeframe</div>
              <div className="text-sm text-neutral-100">
                {prevStartStr} - {prevNewEndStr}
              </div>
            </div>
            <div className="flex items-center justify-between px-4">
              <div className="font-normal text-neutral-200">Old timeframe</div>
              <div className="text-sm text-neutral-100">{prevStartStr} - present</div>
            </div>
          </div>
          <div className="my-4 h-[1px] w-full bg-[#424347]" />

          <div className="mt-3 rounded-md text-neutral-100">
            The previous exchange rate timeframe will end the day before the new one, as timeframes cannot overlap or
            leave gaps.
          </div>
        </div>
      );
    }

    if (dynamicTooltip?.variant === 'before') {
      return (
        <div style={{ wordBreak: 'break-word' }} className="max-w-xs">
          <p className="text-sm text-white">
            This timeframe will end the day before the next one, as timeframes cannot overlap or leave gaps.
          </p>
        </div>
      );
    }

    return null;
  };

  function renderCurrencySelectBasedOnMainCurrency(col: string, idx: number, isFromField: boolean) {
    if (col === mainCurrency) {
      return (
        <span className="p-2 font-medium text-neutral-500">
          {findCurrency(col)?.emoji} {col}
        </span>
      );
    } else {
      return (
        <Select value={col}>
          <SelectTrigger className="w-36 border-neutral-100 bg-neutral-50 font-medium">
            {col ? `${findCurrency(col)?.emoji} ${col}` : 'Select Currency'}
          </SelectTrigger>
          <SelectContent>
            <Command>
              <CommandInput placeholder="Search currency..." />
              <CommandList>
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandGroup>
                  {CURRENCY_LIST.map((currency) => {
                    const isSelectedInOtherColumn = currencyColumns.some(
                      (c, i) => i !== idx && c.from === currency.code,
                    );
                    const isSameAsTo = currency.code === currencyColumns[idx]?.to;
                    return (
                      <CommandItem
                        key={currency.code}
                        value={`${currency.code} ${currency.name}`}
                        disabled={isSelectedInOtherColumn || isSameAsTo}
                        onSelect={() => {
                          const newCols = [...currencyColumns];

                          if (isFromField) {
                            newCols[idx].from = currency.code;
                          } else {
                            newCols[idx].to = currency.code;
                          }

                          setCurrencyColumns(newCols);

                          // When the currency is changed, it's a new rate.
                          // We need to clear the value and ID for this column in all timeframes.
                          setTimeframes((prev) =>
                            prev.map((tf) => {
                              const newRates = [...tf.rates];
                              if (newRates[idx]) {
                                newRates[idx] = {
                                  value: null,
                                  currencyExchangeRateId: undefined,
                                } as LocalRate;
                              }
                              return { ...tf, rates: newRates };
                            }),
                          );
                        }}
                      >
                        {currency.emoji} {currency.name} ({currency.symbol})
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </SelectContent>
        </Select>
      );
    }
  }

  return (
    <div className="py-8">
      <div className="flex items-center">
        <h3 className="mb-1 text-xl font-medium text-neutral-900">Team currency exchange rates</h3>
        <Tooltip
          variant="dark"
          placement="right"
          content="Predefined team currency exchanges are fixed and cannot be edited. You can add additional exchange rates to support other currencies as needed."
          style={{ maxWidth: 380, wordBreak: 'break-word' }}
        >
          <span className="ml-2">
            <SvgInfoCircle className="size-4" />
          </span>
        </Tooltip>
      </div>
      <p className="mb-4 text-sm text-neutral-500">
        Main team currency: {findCurrency(mainCurrency)?.emoji} {findCurrency(mainCurrency)?.name} (
        {findCurrency(mainCurrency)?.symbol})
      </p>

      <div className="mb-6 flex max-w-4xl items-start gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-4">
        <SvgInfoCircle className="flex size-4 min-w-5 self-center text-neutral-400" />
        <div>
          <p className="font-normal text-neutral-600">
            Our system uses exchange rates from the oldest timeframe for earlier data to convert currency metrics needed
            for analytics and optimizations.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-xl border-collapse border border-neutral-100 text-sm">
          <TableHeader>
            <TableRow className="border-b border-neutral-100 text-left">
              <TableHead className="min-w-[200px] max-w-56 border-r border-neutral-100 px-4 py-3 font-medium text-neutral-500">
                Timeframe
              </TableHead>
              {currencyColumns.map((col, idx) => (
                <TableHead
                  key={col.id}
                  className="min-w-[220px] border-r border-neutral-100 px-4 py-1 font-semibold text-neutral-600"
                >
                  <div className="flex flex-row items-center space-x-2">
                    <div className="flex flex-col items-start gap-1">
                      {renderCurrencySelectBasedOnMainCurrency(col.from, idx, true)}
                      {renderCurrencySelectBasedOnMainCurrency(col.to, idx, false)}
                    </div>
                    <ShadcnButton
                      size="icon"
                      className="size-6 rotate-90 rounded-full border-neutral-200 p-1"
                      variant="outline"
                      onClick={() => openInvertModal(idx)}
                    >
                      <ArrowLeftRight className="text-neutral-300" />
                    </ShadcnButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ButtonIcon>
                          <SvgEllipsisV />
                        </ButtonIcon>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleRemoveColumn(idx)}>Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
              ))}
              <TableHead className="max-w-6 border-neutral-100 px-3 !text-center">
                <ButtonIcon onClick={handleAddColumn}>
                  <SvgPlusCircle />
                </ButtonIcon>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeframes.map((timeframe, timeframeIndex) => (
              <TableRow key={timeframe.id} className="border-b border-neutral-100 text-neutral-700">
                <TableCell className="border-r border-neutral-100 px-4 py-3 pl-1 align-middle">
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ButtonIcon>
                          <SvgEllipsisV />
                        </ButtonIcon>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleEditTimeframe(timeframeIndex)}>
                          Edit timeframe
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleRemoveTimeframe(timeframeIndex)}>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {timeframe.isEditing ? (
                      <>
                        <DateSelector
                          hidePastQuickSelection
                          hideFutureQuickSelection
                          isSingleDate
                          disableAfterDate={null}
                          showSingleDateSwitcher={false}
                          numberOfMonths={1}
                          defaultDatePickerOpen={timeframe.isEditing}
                          dateFrom={timeframe.start}
                          dateTo={timeframe.end}
                          panelProps={{ side: 'right', align: 'start' }}
                          onDiscard={() => handleEditTimeframe(timeframeIndex)}
                          renderAdditionalContent={renderBeforeAndAfterDynamicEndDateTooltip}
                          onPreviewSingleDate={(day) => handlePreviewSingleDate(timeframeIndex, day)}
                          onDateChange={({ singleDate }) => {
                            handleDateChange(timeframeIndex, singleDate, null);
                            handleEditTimeframe(timeframeIndex);
                          }}
                        />
                      </>
                    ) : (
                      <div
                        className="flex items-center font-normal text-neutral-400"
                        onClick={() => handleEditTimeframe(timeframeIndex)}
                      >
                        {timeframe.start ? dayjs(timeframe.start).format('D MMM YYYY') : 'Add timeframe'}
                        {timeframe.end
                          ? `- ${dayjs(timeframe.end).format('D MMM YYYY')}`
                          : timeframeIndex === 0
                            ? '- Present'
                            : null}
                      </div>
                    )}
                  </div>
                </TableCell>
                {timeframe.rates.map((rate, rateIndex) => (
                  <TableCell key={rateIndex} className="border-r border-neutral-100 px-4 py-3 align-top">
                    <Input
                      type="text"
                      lang="en-US"
                      value={rate.value !== null ? rate.value.toString() : ''}
                      placeholder="Enter exchange rate"
                      onChange={(e) => handleRateChange(timeframeIndex, rateIndex, e.target.value)}
                      className="w-52 border-none"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center border border-t-0 border-neutral-100 py-2 pl-2">
          <ButtonIcon onClick={handleAddTimeframe}>
            <SvgPlusCircle style={{ height: 16, width: 16, color: nexyColors.neutral300 }} />
          </ButtonIcon>
          <div className="h-[1px] w-full bg-neutral-100" />
        </div>
      </div>

      <Dialog open={showInvertModal} onOpenChange={setShowInvertModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invert conversion rate</DialogTitle>
            <DialogDescription>
              This will reverse the direction between the channel and team currencies. The rate will update accordingly.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-3 ml-[-4px] mt-1 flex items-center font-normal text-neutral-400">
            <Checkbox
              label="Don't show this message again"
              checked={hideMessage}
              onChange={(_, checked: boolean) => handleCheckboxChange(checked)}
            />
          </div>
          <DialogFooter>
            <Button className="!mr-3" size="small" variant="text" onClick={() => setShowInvertModal(false)}>
              Cancel
            </Button>
            <ButtonAsync size="small" variant="contained" color="secondary" onClick={handleInvertRate}>
              Invert currencies
            </ButtonAsync>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-8 flex justify-end gap-4">
        <Button size="small" variant="contained" onClick={handleCancel} disabled={!hasChanges || saving}>
          Cancel
        </Button>
        <ButtonAsync
          size="small"
          variant="contained"
          color="primary"
          onClick={handleSave}
          loading={saving}
          disabled={!hasChanges || saving || !allRatesFilled}
        >
          Save and apply
        </ButtonAsync>
      </div>
    </div>
  );
};
