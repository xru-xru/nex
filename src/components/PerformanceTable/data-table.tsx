import dayjs from 'dayjs';
import { toast } from 'sonner';
import {
  NexoyaContentMetricTotal,
  NexoyaFunnelStepPerformance,
  NexoyaFunnelStepType,
  NexoyaPerformanceMetric,
  NexoyaProvider,
} from '../../types';
import { DateRange } from './columns';
import AvatarProvider from '../AvatarProvider';
import * as Styles from './styles';
import TypographyTranslation from '../TypographyTranslation';
import { NumberWrapperStyled } from '../../routes/portfolio/styles/OptimizationProposal';
import NumberValue from '../NumberValue';
import ButtonIcon from '../ButtonIcon';
import SvgCopyToClipboard from '../icons/CopyToClipboard';
import { ContentCell } from '../../routes/portfolio/components/OptimizationProposal/tableCellComponents';
import { buildContentPath } from '../../routes/paths';
import {
  isConversionValueFunnelStep,
  isCostFunnelStep,
} from '../../routes/portfolio/components/OptimizationProposal/columns';
import FormattedCurrency from '../FormattedCurrency';
import { GLOBAL_DATE_FORMAT } from '../../utils/dates';

interface ExtendedNexoyaFunnelStepPerformance extends Partial<NexoyaFunnelStepPerformance> {
  total: NexoyaPerformanceMetric;
  comparisonTotal: NexoyaPerformanceMetric;
  comparisonChangePercent: NexoyaPerformanceMetric;
  contents: NexoyaContentMetricTotal[];
}

export interface PerformanceProvider {
  // When grouping by channel
  providerId?: number;
  // When grouping by attribution rule
  ruleProviderId?: number;
  ruleId?: number;
  ruleName?: string;

  total: NexoyaPerformanceMetric;
  comparisonTotal: NexoyaPerformanceMetric;
  comparisonChangePercent: NexoyaPerformanceMetric;
  funnelSteps: ExtendedNexoyaFunnelStepPerformance[];
}

export const processProviderPerformanceData = (
  funnelStepPerformance: NexoyaFunnelStepPerformance[],
): PerformanceProvider[] => {
  const result: PerformanceProvider[] = [];

  funnelStepPerformance?.forEach((step) => {
    step.metricTotals.providers.forEach((provider) => {
      let existingProvider = result.find((p) => p.providerId === provider.providerId);

      if (!existingProvider) {
        existingProvider = {
          providerId: provider.providerId,
          total: provider?.total,
          comparisonTotal: provider?.comparisonTotal,
          comparisonChangePercent: provider?.comparisonChangePercent,
          funnelSteps: [],
        };
        result.push(existingProvider);
      }

      const funnelStep: ExtendedNexoyaFunnelStepPerformance = {
        funnelStep: step.funnelStep,
        total: provider.total,
        comparisonTotal: provider.comparisonTotal,
        comparisonChangePercent: provider.comparisonChangePercent,
        contents: provider.contents?.map((contentMetric) => ({
          title: contentMetric?.content?.title || contentMetric?.title,
          contentId: contentMetric?.content?.contentId || contentMetric?.contentId,
          content: contentMetric?.content,
          total: contentMetric?.total,
          comparisonTotal: contentMetric?.comparisonTotal,
          comparisonChangePercent: contentMetric?.comparisonChangePercent,
        })),
      };

      existingProvider.funnelSteps.push(funnelStep);
    });
  });

  return result;
};

export const processAttributionRulePerformanceData = (
  funnelStepPerformance: NexoyaFunnelStepPerformance[],
): PerformanceProvider[] => {
  const result: PerformanceProvider[] = [];

  funnelStepPerformance?.forEach((step) => {
    step.metricTotals?.attributionRules?.forEach((rule) => {
      let existing = result.find((r) => r.ruleId === rule?.attributionRule?.attributionRuleId);

      if (!existing) {
        existing = {
          ruleProviderId: rule?.attributionRule?.filters?.providerId,
          ruleId: rule?.attributionRule?.attributionRuleId,
          ruleName: rule?.attributionRule?.name,
          total: rule?.total,
          comparisonTotal: rule?.comparisonTotal,
          comparisonChangePercent: rule?.comparisonChangePercent,
          funnelSteps: [],
        };
        result.push(existing);
      }

      const funnelStep: ExtendedNexoyaFunnelStepPerformance = {
        funnelStep: step.funnelStep,
        total: rule.total,
        comparisonTotal: rule.comparisonTotal,
        comparisonChangePercent: rule.comparisonChangePercent,
        contents: rule.contents?.map((contentMetricTotal) => ({
          content: contentMetricTotal?.content,
          contentId: contentMetricTotal?.content?.contentId || contentMetricTotal?.contentId,
          title: contentMetricTotal?.content?.title || contentMetricTotal?.title,
          total: contentMetricTotal?.total,
          comparisonTotal: contentMetricTotal?.comparisonTotal,
          comparisonChangePercent: contentMetricTotal?.comparisonChangePercent,
        })),
      };

      existing.funnelSteps.push(funnelStep);
    });
  });

  return result;
};

interface GetDataParams {
  performanceMetricSwitch: string;
  contentSelectionSwitch: string;
  dateRange: DateRange;
  compareToDateRange?: DateRange;
  performanceProviders: PerformanceProvider[];
  providerById: (providerId: number) => NexoyaProvider;
}

export const getData = ({
  performanceMetricSwitch,
  contentSelectionSwitch,
  dateRange,
  performanceProviders,
  providerById,
  compareToDateRange,
}: GetDataParams) => {
  const accessorPrefix =
    performanceMetricSwitch === 'cost-per'
      ? 'funnelStepCostPer'
      : performanceMetricSwitch === 'roas'
        ? 'funnelStepRoas'
        : 'funnelStepValue';

  const isCostPer = performanceMetricSwitch === 'cost-per';
  const isRoas = performanceMetricSwitch === 'roas';

  return performanceProviders.map((performanceProvider) => {
    const providerRow = createProviderRow(performanceProvider, providerById, contentSelectionSwitch);
    const contentMap = new Map();

    performanceProvider.funnelSteps
      ?.filter((fsp) =>
        isRoas
          ? fsp.funnelStep?.type === NexoyaFunnelStepType.ConversionValue ||
            fsp.funnelStep.type === NexoyaFunnelStepType.Cost
          : true,
      )
      ?.forEach((funnelStep) => {
        addFunnelStepToProviderRow(
          providerRow,
          funnelStep,
          accessorPrefix,
          isCostPer,
          isRoas,
          dateRange,
          compareToDateRange,
        );
        updateContentMap(contentMap, funnelStep, accessorPrefix, isCostPer, isRoas, dateRange, compareToDateRange);
      });

    providerRow.subRows = Array.from(contentMap.values());
    return providerRow;
  });
};

const createProviderRow = (
  performanceProvider: PerformanceProvider,
  providerById: (providerId: number) => NexoyaProvider,
  contentSelectionSwitch: string,
) => ({
  content:
    contentSelectionSwitch === 'channel' ? (
      <div className="flex h-full items-center justify-start" key={providerById(performanceProvider.providerId).name}>
        <AvatarProvider providerId={performanceProvider.providerId} size={24} style={{ marginRight: 12 }} />
        <Styles.ProviderNameStyled>
          <TypographyTranslation
            className="!font-medium"
            text={providerById(performanceProvider.providerId).name}
            withTooltip
          />
        </Styles.ProviderNameStyled>
      </div>
    ) : (
      <div className="flex h-full items-center justify-start" key={performanceProvider.ruleName}>
        <AvatarProvider providerId={performanceProvider?.ruleProviderId} size={24} style={{ marginRight: 12 }} />
        <Styles.ProviderNameStyled>
          <TypographyTranslation className="!font-medium" text={performanceProvider.ruleName} withTooltip />
        </Styles.ProviderNameStyled>
      </div>
    ),
  subRows: [],
});

const addFunnelStepToProviderRow = (
  providerRow: any,
  funnelStepPerformance: ExtendedNexoyaFunnelStepPerformance,
  accessorPrefix: string,
  isCostPer: boolean,
  isRoas: boolean,
  dateRange: DateRange,
  compareToDateRange: DateRange,
) => {
  const keyDateRange = `${accessorPrefix}_${funnelStepPerformance?.funnelStep?.funnelStepId}_${dayjs(dateRange.start).format()}_${dayjs(dateRange.end).format()}`;
  const funnelStepType = funnelStepPerformance?.funnelStep?.type;
  const isCurrency =
    isCostFunnelStep(funnelStepType) ||
    (!isRoas &&
      ((isConversionValueFunnelStep(funnelStepType) && !isCostPer) ||
        (isCostPer && !isConversionValueFunnelStep(funnelStepType))));

  const total = funnelStepPerformance?.total;
  const value = isCostFunnelStep(funnelStepType)
    ? total?.value
    : isCostPer
      ? total?.costRatio
      : isRoas
        ? total?.roas
        : total?.value;

  providerRow[keyDateRange] = (
    <NumberWrapperStyled className="flex !justify-end" key={value || 0}>
      {isCurrency ? (
        <FormattedCurrency amount={value} />
      ) : (
        <NumberValue
          symbol={isRoas ? '%' : undefined}
          value={isRoas ? total?.roas : isCostPer ? total?.costRatio : total?.value}
        />
      )}
    </NumberWrapperStyled>
  );

  if (compareToDateRange) {
    const keyCompareDateRange = `${accessorPrefix}_${funnelStepPerformance?.funnelStep?.funnelStepId}_${dayjs(compareToDateRange?.start).format()}_${dayjs(compareToDateRange?.end).format()}`;
    const keyCompareDateRangeChangePercent = `${accessorPrefix}_${funnelStepPerformance?.funnelStep?.funnelStepId}_${dayjs(compareToDateRange?.start).format()}_${dayjs(compareToDateRange?.end).format()}_change_percent`;
    const comparisonTotal = funnelStepPerformance?.comparisonTotal;
    const comparisonValue = isCostFunnelStep(funnelStepType)
      ? comparisonTotal?.value
      : isCostPer
        ? comparisonTotal?.costRatio
        : isRoas
          ? comparisonTotal?.roas
          : comparisonTotal?.value;

    const comparisonChangePercent = isCostFunnelStep(funnelStepType)
      ? funnelStepPerformance?.comparisonChangePercent?.value
      : isCostPer
        ? funnelStepPerformance?.comparisonChangePercent?.costRatio
        : isRoas
          ? funnelStepPerformance?.comparisonChangePercent?.roas
          : funnelStepPerformance?.comparisonChangePercent?.value;

    providerRow[keyCompareDateRange] = (
      <NumberWrapperStyled className="flex !justify-start" key={comparisonValue}>
        {isCurrency ? (
          <FormattedCurrency amount={comparisonValue} />
        ) : (
          <NumberValue symbol={isRoas ? '%' : undefined} value={comparisonValue} />
        )}
      </NumberWrapperStyled>
    );

    providerRow[keyCompareDateRangeChangePercent] = (
      <NumberWrapperStyled className="flex !justify-end" key={comparisonChangePercent}>
        <NumberValue
          value={comparisonChangePercent}
          symbol="%"
          textWithColor
          showChangePrefix
          variant={comparisonChangePercent === 0 ? 'default' : comparisonChangePercent > 0 ? 'positive' : 'negative'}
          lowerIsBetter={isCostFunnelStep(funnelStepType) ? false : isCostPer}
        />
      </NumberWrapperStyled>
    );
  }
};

const updateContentMap = (
  contentMap: Map<number, any>,
  funnelStep: ExtendedNexoyaFunnelStepPerformance,
  accessorPrefix: string,
  isCostPer: boolean,
  isRoas: boolean,
  dateRange: DateRange,
  compareToDateRange?: DateRange,
) => {
  funnelStep.contents?.forEach((subRow) => {
    if (!contentMap.has(subRow.contentId)) {
      contentMap.set(subRow.contentId, createContentRow(subRow, dateRange));
    }

    addFunnelStepToContentRow(
      contentMap.get(subRow.contentId),
      funnelStep,
      subRow,
      accessorPrefix,
      isCostPer,
      isRoas,
      dateRange,
      compareToDateRange,
    );
  });
};

const createContentRow = (subRow: NexoyaContentMetricTotal, dateRange: DateRange) => ({
  content: (
    <div key={subRow?.title} className="flex h-full items-center">
      <Styles.IconContent style={{ paddingLeft: 6 }}>
        <ButtonIcon
          className="copyContentButton"
          title="Copy content name"
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(subRow?.title).then(() => toast.message('Copied to clipboard'));
          }}
        >
          <SvgCopyToClipboard />
        </ButtonIcon>
      </Styles.IconContent>
      <ContentCell
        key={subRow?.title}
        title={subRow?.title}
        isPerforming={false}
        className="!font-light"
        titleLink={buildContentPath(subRow?.contentId, {
          dateFrom: dayjs(dateRange.start).format(GLOBAL_DATE_FORMAT),
          dateTo: dayjs(dateRange.end).format(GLOBAL_DATE_FORMAT),
        })}
      />
    </div>
  ),
});

const addFunnelStepToContentRow = (
  contentRow: any,
  funnelStepPerformance: ExtendedNexoyaFunnelStepPerformance,
  subRow: NexoyaContentMetricTotal,
  accessorPrefix: string,
  isCostPer: boolean,
  isRoas: boolean,
  dateRange: DateRange,
  compareToDateRange?: DateRange,
) => {
  const funnelStepId = funnelStepPerformance?.funnelStep?.funnelStepId;
  const key = `${accessorPrefix}_${funnelStepId}_${dayjs(dateRange.start).format()}_${dayjs(dateRange.end).format()}`;
  const funnelStepType = funnelStepPerformance?.funnelStep?.type;
  const value =
    funnelStepType === NexoyaFunnelStepType.Cost
      ? subRow?.total?.value
      : isCostPer
        ? subRow?.total?.costRatio
        : isRoas
          ? subRow?.total?.roas
          : subRow?.total?.value;

  contentRow[key] = (
    <NumberWrapperStyled className="flex !justify-end !font-light" key={value}>
      {renderFunnelStepValue({ funnelStepType, value, isCostPer, isRoas })}
    </NumberWrapperStyled>
  );

  if (compareToDateRange) {
    const keyCompareDateRange = `${accessorPrefix}_${funnelStepId}_${dayjs(compareToDateRange.start).format()}_${dayjs(compareToDateRange.end).format()}`;
    const keyCompareDateRangeChangePercent = `${accessorPrefix}_${funnelStepId}_${dayjs(compareToDateRange.start).format()}_${dayjs(compareToDateRange.end).format()}_change_percent`;
    const comparisonValue =
      funnelStepType === NexoyaFunnelStepType.Cost
        ? subRow?.comparisonTotal?.value
        : isCostPer
          ? subRow?.comparisonTotal?.costRatio
          : isRoas
            ? subRow?.comparisonTotal?.roas
            : subRow?.comparisonTotal?.value;

    const comparisonChangePercent =
      funnelStepType === NexoyaFunnelStepType.Cost
        ? subRow?.comparisonChangePercent?.value
        : isCostPer
          ? subRow?.comparisonChangePercent?.costRatio
          : isRoas
            ? subRow?.comparisonChangePercent?.roas
            : subRow?.comparisonChangePercent?.value;

    contentRow[keyCompareDateRange] = (
      <NumberWrapperStyled className="flex !justify-start !font-light" key={comparisonValue}>
        {renderFunnelStepValue({ funnelStepType, value: comparisonValue, isCostPer, isRoas })}
      </NumberWrapperStyled>
    );
    contentRow[keyCompareDateRangeChangePercent] = (
      <NumberWrapperStyled className="flex !justify-end !font-light" key={comparisonChangePercent}>
        {renderFunnelStepValue({
          funnelStepType,
          value: comparisonChangePercent,
          isCostPer,
          isRoas,
          isPercentageDifference: true,
        })}
      </NumberWrapperStyled>
    );
  }
};

const renderFunnelStepValue = ({
  funnelStepType,
  value,
  isCostPer,
  isRoas,
  isPercentageDifference = false,
}: {
  funnelStepType: NexoyaFunnelStepType;
  value: number;
  isCostPer: boolean;
  isRoas: boolean;
  isPercentageDifference?: boolean;
}) => {
  if (isCostFunnelStep(funnelStepType) && !isPercentageDifference) {
    return <FormattedCurrency amount={value} />;
  }

  if (isRoas || isPercentageDifference) {
    return <NumberValue value={value} symbol="%" textWithColor={isPercentageDifference} />;
  }

  if (isCostPer && isConversionValueFunnelStep(funnelStepType)) {
    return <NumberValue value={value} />;
  }
  if (isConversionValueFunnelStep(funnelStepType)) {
    return <FormattedCurrency amount={value} />;
  }

  if (isCostPer) {
    return <FormattedCurrency amount={value} />;
  }

  return <NumberValue value={value} />;
};
