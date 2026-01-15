import { round } from 'lodash';
import React from 'react';
import { BigHeaderCell } from '../../routes/portfolio/styles/OptimizationProposal';
import { withSortSkipped } from '../../routes/portfolio/components/OptimizationProposal/withSortSkipped';
import { sortTypes } from '../Table/sortTypes';
import {
  ACTIONS_HEADER_ID,
  getHeader,
  isCostFunnelStep,
} from '../../routes/portfolio/components/OptimizationProposal/columns';
import { NexoyaFunnelStepPerformance, NexoyaFunnelStepType } from '../../types';
import dayjs from 'dayjs';
import * as Styles from './styles';
import SvgChevronDown from '../icons/ChevronDown';
import NumberValue from '../NumberValue';
import FormattedCurrency from '../FormattedCurrency';
import { cn } from '../../lib/utils';
import { DATE_SELECTOR_DEFAULT_FORMAT, DATE_SELECTOR_YEARLY_DEFAULT_FORMAT } from '../../utils/dates';

interface Props {
  performanceMetricSwitch: string;
  funnelSteps: NexoyaFunnelStepPerformance[];
  dateRange: DateRange;
  compareToDateRange?: DateRange;
  // channel => group by providers, type => group by attribution rules
  contentSelectionSwitch?: 'channel' | 'type';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export const getColumns = ({
  performanceMetricSwitch,
  funnelSteps,
  dateRange,
  compareToDateRange,
  contentSelectionSwitch = 'channel',
}: Props) => {
  const columns = funnelSteps
    ?.filter((fsp) =>
      performanceMetricSwitch === 'roas'
        ? fsp.funnelStep.type === NexoyaFunnelStepType.ConversionValue ||
          fsp.funnelStep.type === NexoyaFunnelStepType.Cost
        : true,
    )
    ?.map((funnelStep) =>
      createFunnelColumn(funnelStep, performanceMetricSwitch, dateRange, compareToDateRange, contentSelectionSwitch),
    );

  return [
    {
      accessor: ACTIONS_HEADER_ID,
      disableSortBy: true,
      disableHiding: true,
      Header: '',
      tableManagerHeader: <BigHeaderCell>Content</BigHeaderCell>,
      columns: [
        {
          Header: <BigHeaderCell>Total</BigHeaderCell>,
          accessor: 'expanderHeader',
          disableSortBy: true,
          isHiddenInManager: true,
          disableHiding: true,
          className: 'border-right',
          columns: [
            {
              width: 50,
              disableSortBy: true,
              isHiddenInManager: true,
              disableHiding: true,
              id: 'expander',
              Header: ({ getToggleAllRowsExpandedProps }) => <span {...getToggleAllRowsExpandedProps()}></span>,
              Cell: ({ row }) =>
                row.canExpand ? (
                  <Styles.ChevronWrap
                    expanded={row.isExpanded}
                    className="mx-auto h-full w-fit items-center !justify-center"
                    {...row.getToggleRowExpandedProps()}
                  >
                    <SvgChevronDown />
                  </Styles.ChevronWrap>
                ) : null,
            },
            {
              width: '100%',
              Header: 'Content',
              accessor: 'content',
              className: 'border-right',
              sortType: withSortSkipped(sortTypes.jsxKey),
              enableColumnResize: true,
              disableHiding: true,
            },
          ],
        },
      ],
    },
    ...(columns || []),
  ];
};

const createFunnelColumn = (
  funnelStepPerformance: NexoyaFunnelStepPerformance,
  performanceMetricSwitch: string,
  dateRange: DateRange,
  compareToDateRange: DateRange,
  contentSelectionSwitch: 'channel' | 'type',
) => {
  const funnelStep = funnelStepPerformance.funnelStep;
  const isCostPer = performanceMetricSwitch === 'cost-per';
  const isRoas = performanceMetricSwitch === 'roas';

  const header = isCostFunnelStep(funnelStep.type) ? 'Ad spend' : getHeader(funnelStep);

  const calculateTotal = (key: string) => {
    const list =
      contentSelectionSwitch === 'type'
        ? funnelStepPerformance?.metricTotals?.attributionRules
        : funnelStepPerformance?.metricTotals?.providers;
    // @ts-ignore
    return list?.reduce((acc, cur) => acc + (cur?.total?.[key] || 0), 0) || 0;
  };

  const calculateComparisonTotal = (key: string) => {
    const list =
      contentSelectionSwitch === 'type'
        ? funnelStepPerformance?.metricTotals?.attributionRules
        : funnelStepPerformance?.metricTotals?.providers;
    // @ts-ignore
    return list?.reduce((acc, cur) => acc + (cur?.comparisonTotal?.[key] || 0), 0) || 0;
  };

  const calculatePercentageChange = (currentValue: number, previousValue: number) =>
    previousValue ? round(((currentValue - previousValue) / previousValue) * 100, 1) : 0;

  const calculateCostRatioValue = () => {
    if (isCostFunnelStep(funnelStep.type)) {
      return adSpendTotal.value;
    } else if (funnelStep.type === NexoyaFunnelStepType.Awareness) {
      return costPer.value * 1000;
    } else {
      return costPer.value;
    }
  };

  const calculateCostRatioComparisonValue = () => {
    if (isCostFunnelStep(funnelStep.type)) {
      return adSpendTotal.comparisonValue;
    } else if (funnelStep.type === NexoyaFunnelStepType.Awareness) {
      return costPer.comparisonValue * 1000;
    } else {
      return costPer.comparisonValue;
    }
  };

  const total = {
    value: calculateTotal('value'),
    comparisonValue: calculateComparisonTotal('value'),
    comparisonChangePercent: calculatePercentageChange(calculateTotal('value'), calculateComparisonTotal('value')),
  };

  const adSpendTotal = {
    value: calculateTotal('adSpend'),
    comparisonValue: calculateComparisonTotal('adSpend'),
  };

  const roasTotal = isCostFunnelStep(funnelStep.type)
    ? {
        value: calculateTotal('adSpend'),
        comparisonValue: calculateComparisonTotal('adSpend'),
        comparisonChangePercent: calculatePercentageChange(
          calculateTotal('adSpend'),
          calculateComparisonTotal('adSpend'),
        ),
      }
    : {
        value: total.value && adSpendTotal.value ? (total.value / adSpendTotal.value) * 100 : 0,
        comparisonValue:
          total.comparisonValue && adSpendTotal.comparisonValue
            ? (total.comparisonValue / adSpendTotal.comparisonValue) * 100
            : 0,
        comparisonChangePercent: calculatePercentageChange(
          total.value && adSpendTotal.value ? (total.value / adSpendTotal.value) * 100 : 0,
          total.comparisonValue && adSpendTotal.comparisonValue
            ? (total.comparisonValue / adSpendTotal.comparisonValue) * 100
            : 0,
        ),
      };

  const costPer = {
    value: total.value ? adSpendTotal.value / total.value : 0,
    comparisonValue: total.comparisonValue ? adSpendTotal.comparisonValue / total.comparisonValue : 0,
  };

  const costRatioTotal = {
    value: calculateCostRatioValue(),
    comparisonValue: calculateCostRatioComparisonValue(),
    comparisonChangePercent: calculatePercentageChange(calculateCostRatioValue(), calculateCostRatioComparisonValue()),
  };

  const isCurrency =
    isCostFunnelStep(funnelStep.type) ||
    (!isRoas &&
      (isCostPer || funnelStep.type === NexoyaFunnelStepType.ConversionValue) &&
      !(isCostPer && funnelStep.type === NexoyaFunnelStepType.ConversionValue));

  const columns = createColumnStructure(
    funnelStep?.funnelStepId,
    isRoas ? roasTotal : isCostPer ? costRatioTotal : total,
    isRoas ? 'funnelStepRoas' : isCostPer ? 'funnelStepCostPer' : 'funnelStepValue',
    // Remove isRoas from isCurrency check since we want to use NumberValue for percentage
    isCurrency,
    dateRange,
    compareToDateRange,
    // ROAS higher is better, so lowerIsBetter should be false
    isRoas ? false : isCostFunnelStep(funnelStep.type) ? false : isCostPer,
  );

  const title = isCostFunnelStep(funnelStep.type) ? 'Ad spend' : funnelStep?.title;
  const isAttributed = funnelStep?.isAttributed;
  const isMeasured = funnelStep?.isMeasured;

  return {
    id: `header-${funnelStep?.funnelStepId}`,
    title,
    disableSticky: true,
    disableSortBy: true,
    className: 'border-right',
    width: '100%',
    Header: (
      <div className="flex w-full flex-col items-end justify-end gap-1 py-2">
        <BigHeaderCell className={cn('w-full', compareToDateRange ? '!text-center' : 'text-right')}>
          {isCostPer ? header : title}
        </BigHeaderCell>
        {isAttributed ? <span className="text-[9px] font-semibold uppercase text-neutral-300">Attributed</span> : null}
        {isMeasured ? <span className="text-[9px] font-semibold uppercase text-neutral-300"> Measured</span> : null}
      </div>
    ),
    columns,
  };
};

export const createColumnStructure = (
  funnelStepId: number,
  total: { value: number; comparisonValue: number; comparisonChangePercent?: number },
  accessorPrefix: string,
  isCurrency: boolean,
  dateRange: DateRange,
  compareToDateRange?: DateRange,
  lowerIsBetter?: boolean,
) => {
  const getDateFormat = () => {
    const compareFromYear = dayjs(compareToDateRange?.start).year();
    const compareToYear = dayjs(compareToDateRange?.end).year();
    const dateFromYear = dayjs(dateRange?.start).year();
    const dateToYear = dayjs(dateRange?.end).year();

    // Check if any of the date ranges span different years
    if (compareFromYear !== compareToYear || compareFromYear !== dateFromYear || compareToYear !== dateToYear) {
      return DATE_SELECTOR_YEARLY_DEFAULT_FORMAT;
    }

    return DATE_SELECTOR_DEFAULT_FORMAT;
  };

  const baseColumns = [
    {
      Header: (
        <>
          {compareToDateRange ? (
            <BigHeaderCell className="w-full !px-1.5 !py-5 !text-left">
              {isCurrency ? (
                <FormattedCurrency amount={total?.comparisonValue} />
              ) : (
                <NumberValue
                  justify="flex-start"
                  value={total?.comparisonValue}
                  symbol={accessorPrefix === 'funnelStepRoas' ? '%' : undefined}
                />
              )}
            </BigHeaderCell>
          ) : null}
          <BigHeaderCell className={`w-full ${compareToDateRange ? '!px-12' : '!px-3'} !py-5 text-right`}>
            {isCurrency ? (
              <FormattedCurrency amount={total?.value} />
            ) : (
              <NumberValue
                justify="flex-end"
                value={total?.value}
                symbol={accessorPrefix === 'funnelStepRoas' ? '%' : undefined}
              />
            )}
          </BigHeaderCell>
          {compareToDateRange ? (
            <BigHeaderCell className="w-[70%] !px-3 !py-5 text-right">
              <NumberValue
                justify="flex-end"
                value={total?.comparisonChangePercent}
                symbol="%"
                textWithColor
                showChangePrefix
                lowerIsBetter={lowerIsBetter}
                variant={total?.comparisonChangePercent > 0 ? 'positive' : 'negative'}
              />
            </BigHeaderCell>
          ) : null}
        </>
      ),
      className: 'border-right',
      disableSortBy: true,
      disableSticky: true,
      accessor: `total_${accessorPrefix}_${funnelStepId}_${dayjs(dateRange.start).format()}_${dayjs(dateRange.end).format()}`,
      columns: [
        compareToDateRange
          ? {
              disableSortBy: false,
              Header: `${dayjs(compareToDateRange.start).format(getDateFormat())} - ${dayjs(compareToDateRange.end).format(getDateFormat())}`,
              accessor: `${accessorPrefix}_${funnelStepId}_${dayjs(compareToDateRange.start).format()}_${dayjs(compareToDateRange.end).format()}`,
              sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
              width: 130,
              rowProps: {
                style: {
                  justifyContent: 'flex-start',
                },
              },
            }
          : null,
        {
          Header: (
            <span className="w-full text-right">
              {dayjs(dateRange.start).format(getDateFormat())} - {dayjs(dateRange.end).format(getDateFormat())}
            </span>
          ),
          accessor: `${accessorPrefix}_${funnelStepId}_${dayjs(dateRange.start).format()}_${dayjs(dateRange.end).format()}`,
          sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
          className: compareToDateRange ? '' : 'border-right',
          minWidth: 150,
          width: 180,
        },
        compareToDateRange
          ? {
              disableSortBy: false,
              Header: 'Change %',
              accessor: `${accessorPrefix}_${funnelStepId}_${dayjs(compareToDateRange.start).format()}_${dayjs(compareToDateRange.end).format()}_change_percent`,
              sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
              className: 'border-right',
              rowProps: {
                style: {
                  justifyContent: 'flex-end',
                },
              },
            }
          : null,
      ].filter(Boolean),
    },
  ];

  return baseColumns;
};
