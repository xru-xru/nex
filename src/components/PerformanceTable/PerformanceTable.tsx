import React, { Suspense, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { NexoyaFunnelStepPerformance, NexoyaFunnelStepType } from 'types/types';

import { getFormattedDateSelector, GLOBAL_DATE_FORMAT } from '../../utils/dates';

import { DateSelectorProps } from '../DateSelector';
import { TableStyled } from '../../routes/portfolio/styles/OptimizationProposal';
import { BooleanParam, DateParam, StringParam, useQueryParam, useQueryParams } from 'use-query-params';
import { useProviders } from '../../context/ProvidersProvider';
import { getData, processAttributionRulePerformanceData, processProviderPerformanceData } from './data-table';
import { ExtendedTable } from '../Table/ExtendedTable';
import { getColumns } from './columns';
import { TableManager } from '../Table/TableManager';
import AdSpendReportDownload from '../../routes/portfolio/components/AdSpendReportDownload';
import Spinner from '../Spinner';
import { usePortfolio } from '../../context/PortfolioProvider';
import Button from '../Button';
import { toast } from 'sonner';
import { Skeleton } from '../../components-ui/Skeleton';
import { getCustomCellStyles, useSequentialFunnelStepPerformanceQueries } from './utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../../components-ui/DropdownMenu';
import { Calendar, Download, Sigma } from 'lucide-react';
import SvgCaretDown from '../icons/CaretDown';
import { useCurrencyStore } from 'store/currency-selection';
import FormControlLabel from '../FormControlLabel';
import Radio from '../Radio';
import RadioGroup from '../RadioGroup';

interface Props {
  loading?: boolean;
  portfolioId?: number;
  dateSelectorProps: DateSelectorProps;
  performanceFunnelSteps?: NexoyaFunnelStepPerformance[];
}

const DEPTH_NUMBER_IN_COLUMN_TREE = 2;

const TABLE_CONTENT_SECTIONS = [
  {
    id: 'channel',
    text: 'Channel',
  },
  {
    id: 'type',
    text: 'Type',
  },
];

const TABLE_METRICS_SECTIONS = [
  {
    id: 'values',
    text: 'Values',
  },
  {
    id: 'cost-per',
    text: 'Cost-per',
  },
];

export const PerformanceTable = ({ loading, dateSelectorProps, portfolioId, performanceFunnelSteps }: Props) => {
  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
    selectedFunnelStep: { selectedFunnelStep },
  } = usePortfolio();

  const [tableMetricSections, setTableMetricSections] = useState(TABLE_METRICS_SECTIONS);
  const [download, setDownload] = useState<boolean>(false);
  const [exportType, setExportType] = useState<'daily' | 'summed'>(null);
  const {
    results,
    loading: sequentialFunnelStepsLoading,
    fetchFunnelSteps,
  } = useSequentialFunnelStepPerformanceQueries();

  const [contentSelection, setContentSelection] = useQueryParam('contentSelection', StringParam);
  const [metricsSelection, setMetricsSelection] = useQueryParam('metricsSelection', StringParam);

  // Set default values if not already set
  useEffect(() => {
    if (!contentSelection) {
      setContentSelection('channel');
    }
    if (!metricsSelection) {
      setMetricsSelection('values');
    }
  }, [contentSelection, metricsSelection, setContentSelection, setMetricsSelection]);

  const [queryParams] = useQueryParams({
    dateFrom: DateParam,
    dateTo: DateParam,
    compareFrom: DateParam,
    compareTo: DateParam,
    dateComparisonActive: BooleanParam,
  });

  const { numberFormat } = useCurrencyStore();
  const { providerById } = useProviders();

  const contentMetrics =
    (contentSelection || 'channel') === 'type'
      ? processAttributionRulePerformanceData(performanceFunnelSteps)
      : processProviderPerformanceData(performanceFunnelSteps);

  useEffect(() => {
    if (performanceFunnelSteps?.some((fsp) => fsp.funnelStep?.type === NexoyaFunnelStepType.ConversionValue)) {
      setTableMetricSections((prevState) => {
        if (!prevState.some((section) => section.id === 'roas')) {
          return [
            ...prevState,
            {
              id: 'roas',
              text: 'Per-cost',
            },
          ];
        }
        return prevState;
      });
    }
  }, [performanceFunnelSteps]);

  if (loading) {
    return (
      <div className="mt-10 flex w-full flex-col gap-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} style={{ height: '34px', width: '100%' }} />
        ))}
      </div>
    );
  }

  const handleExport = async (type: 'daily' | 'summed') => {
    setExportType(type);

    if (type !== 'daily') {
      setDownload(true);
      return;
    }
    // Only start the download process if we successfully fetch the funnel steps
    const success = await fetchFunnelSteps(
      performanceFunnelSteps?.map((fsp) => fsp.funnelStep),
      portfolioId,
      {
        start: dayjs(dateSelectorProps.dateFrom).utc().format(GLOBAL_DATE_FORMAT),
        end: dayjs(dateSelectorProps.dateTo).utc().format(GLOBAL_DATE_FORMAT),
      },
    );

    if (success) {
      setDownload(true);
    }
  };

  const contentSections = portfolioMeta?.isAttributed ? TABLE_CONTENT_SECTIONS : [];

  return (
    <div className="w-full overflow-x-scroll">
      <div className="my-4 ml-0.5 mr-0.5 flex justify-between">
        <div className="flex gap-2">
          {contentSections.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger disabled={loading}>
                <Button
                  disabled={loading}
                  size="small"
                  variant="contained"
                  color="secondary"
                  className="!px-3 !py-2 !font-normal !text-neutral-500"
                >
                  <span className="font-medium">Content:</span>{' '}
                  {contentSections.find((s) => s.id === contentSelection)?.text || 'Channel'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 font-normal" align="start">
                <RadioGroup>
                  {contentSections.map((section) => (
                    <DropdownMenuItem
                      key={section.id}
                      onClick={(e) => {
                        e.preventDefault();
                        setContentSelection(section.id);
                      }}
                    >
                      <FormControlLabel
                        checked={contentSelection === section.id}
                        onChange={() => setContentSelection(section.id)}
                        value={section.id}
                        name="content-section"
                        label={section.text}
                        control={<Radio />}
                      />
                    </DropdownMenuItem>
                  ))}
                </RadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger disabled={loading}>
              <Button
                disabled={loading}
                size="small"
                variant="contained"
                color="secondary"
                className="!px-3 !py-2 !font-normal !text-neutral-500"
              >
                <span className="font-medium">Metric data:</span>{' '}
                {tableMetricSections.find((s) => s.id === metricsSelection)?.text || 'Values'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 font-normal" align="start">
              <RadioGroup>
                {tableMetricSections.map((section) => (
                  <DropdownMenuItem
                    key={section.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setMetricsSelection(section.id);
                    }}
                  >
                    <FormControlLabel
                      checked={metricsSelection === section.id}
                      onChange={() => setMetricsSelection(section.id)}
                      value={section.id}
                      name="metric-section"
                      label={section.text}
                      control={<Radio />}
                    />
                  </DropdownMenuItem>
                ))}
              </RadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <Spinner style={{ width: 22, height: 22, borderTopColor: '#aaaaaa', padding: 8, marginRight: '-7px' }} />
        ) : (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger disabled={loading || sequentialFunnelStepsLoading}>
                <Button
                  disabled={loading || sequentialFunnelStepsLoading || contentSelection === 'type'}
                  size="small"
                  variant="contained"
                  color="secondary"
                  endAdornment={<SvgCaretDown style={{ width: 14, height: 14, marginLeft: 8 }} />}
                >
                  Export table
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 font-normal" align="end">
                <DropdownMenuItem onClick={() => handleExport('daily')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Daily export</span>
                  <DropdownMenuShortcut>
                    <Download className="ml-2 h-4 w-4" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('summed')}>
                  <Sigma className="mr-2 h-4 w-4" />
                  <span>Summed export</span>
                  <DropdownMenuShortcut>
                    <Download className="ml-2 h-4 w-4" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <TableStyled>
        <ExtendedTable
          disableManager={false}
          disableExpanded={false}
          getCustomCellStyles={(column) => getCustomCellStyles(column, selectedFunnelStep?.funnel_step_id)}
          tableId="performance_table"
          renderTableManager={({
            columns,
            getToggleHideAllColumnsProps,
            toggleHideAllColumns,
            setStickyColumns,
            stickyColumns,
          }) => (
            <TableManager
              columns={columns}
              getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
              toggleHideAllColumns={toggleHideAllColumns}
              setStickyColumns={setStickyColumns}
              stickyColumns={stickyColumns}
              depth={DEPTH_NUMBER_IN_COLUMN_TREE}
            />
          )}
          data={getData({
            performanceMetricSwitch: metricsSelection || 'values',
            contentSelectionSwitch: contentSelection || 'channel',
            performanceProviders: contentMetrics,
            providerById,
            dateRange: {
              start: queryParams?.dateFrom,
              end: queryParams?.dateTo,
            },
            compareToDateRange: queryParams.dateComparisonActive
              ? {
                  start: queryParams?.compareFrom,
                  end: queryParams?.compareTo,
                }
              : null,
          })}
          columns={getColumns({
            funnelSteps: performanceFunnelSteps,
            performanceMetricSwitch: metricsSelection || 'values',
            dateRange: {
              start: queryParams?.dateFrom,
              end: queryParams?.dateTo,
            },
            compareToDateRange: queryParams.dateComparisonActive
              ? {
                  start: queryParams?.compareFrom,
                  end: queryParams?.compareTo,
                }
              : null,
            contentSelectionSwitch: contentSelection === 'type' ? 'type' : 'channel',
          })}
        />
      </TableStyled>
      {!loading && download ? (
        <Suspense fallback={null}>
          <AdSpendReportDownload
            exportType={exportType}
            funnelSteps={performanceFunnelSteps?.map((fsp) => fsp.funnelStep)}
            performanceFunnelSteps={results}
            contentMetrics={contentMetrics}
            portfolioTitle={portfolioMeta?.title}
            duration={getFormattedDateSelector(dateSelectorProps, numberFormat)}
            onDone={() => setDownload(false)}
            onError={() => {
              setDownload(false);
              toast.error('Failed to download the report');
            }}
          />
        </Suspense>
      ) : null}
    </div>
  );
};
