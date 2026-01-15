import { gql, useQuery } from '@apollo/client';
import { useCurrencyStore } from 'store/currency-selection';

import { useTeam } from '../../context/TeamProvider';
import dayjs from 'dayjs';
import { sortBy, uniqBy } from 'lodash';
import usePortfolioMetaStore from '../../store/portfolio-meta';
import { PORTFOLIO_FEATURE_FLAGS } from '../../constants/featureFlags';

interface MissingCurrencyCoverage {
  teamCurrency: string;
  contentCurrency: string;
  missingRanges: Array<{
    from: string;
    to: string;
  }>;
}

const NEW_OPTIMIZATION_SUMMARY_FRAGMENT = gql`
  fragment NewOptimizationSummaryFields on NewOptimizationSummary {
    isCustomImportDataFresh
    totalBudget
    allContentsHaveImpactGroupAssigned
    isOptiPeriodSpanningMultipleTargetItems
    attribution {
      hasErrors
      attributionRuleWithNoFactors {
        name
      }
      contentWithNoAttributionRules {
        contentId
        title
      }
    }
    missingCurrencyCoverage {
      teamCurrency
      contentCurrency
      missingRanges {
        from
        to
      }
    }
    targetItem {
      targetItemId
      name
      start
      end
      maxBudget
      value
    }
  }
`;

const NEW_OPTIMIZATION_SUMMARY_WITHOUT_IGNORE_WEEKDAYS = gql`
  query NewOptimizationSummary($teamId: Int!, $portfolioId: Int!, $end: Date!) {
    newOptimizationSummary(teamId: $teamId, portfolioId: $portfolioId, end: $end) {
      ...NewOptimizationSummaryFields
    }
  }
  ${NEW_OPTIMIZATION_SUMMARY_FRAGMENT}
`;

const NEW_OPTIMIZATION_SUMMARY_WITH_IGNORE_WEEKDAYS = gql`
  query NewOptimizationSummary($teamId: Int!, $portfolioId: Int!, $end: Date!) {
    newOptimizationSummary(teamId: $teamId, portfolioId: $portfolioId, end: $end) {
      ...NewOptimizationSummaryFields
      ignoreWeekdays
    }
  }
  ${NEW_OPTIMIZATION_SUMMARY_FRAGMENT}
`;

type Options = {
  portfolioId: number;
  end: string;
};

function useNewOptimizationSummary({ portfolioId, end }: Options) {
  const { teamId } = useTeam();
  const { setMissingCurrencyCoverage, setMissingCurrencyPairs, setMissingCurrencyRanges } = useCurrencyStore();
  const { portfolioMeta } = usePortfolioMetaStore();

  const isIgnoreWeekdaysFeatureEnabled = portfolioMeta?.featureFlags?.some(
    (ff) => ff.name === PORTFOLIO_FEATURE_FLAGS.IGNORE_WEEKDAYS && ff.status,
  );

  const query = isIgnoreWeekdaysFeatureEnabled
    ? NEW_OPTIMIZATION_SUMMARY_WITH_IGNORE_WEEKDAYS
    : NEW_OPTIMIZATION_SUMMARY_WITHOUT_IGNORE_WEEKDAYS;

  return useQuery(query, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    skip: !teamId || !portfolioId || !end,
    onCompleted: (data) => {
      const missing: MissingCurrencyCoverage[] = data?.newOptimizationSummary?.missingCurrencyCoverage || [];
      setMissingCurrencyCoverage(missing.length > 0);
      const pairs = missing
        .filter((m) => m?.teamCurrency && m?.contentCurrency)
        .map((m) => ({ from: m.contentCurrency, to: m.teamCurrency }));
      const uniquePairs = uniqBy(pairs, (p) => `${p.from}-${p.to}`);
      setMissingCurrencyPairs(uniquePairs);
      // collect union of missing ranges
      const rangesRaw = missing.flatMap((m) => m?.missingRanges || []) || [];
      const ranges: { from: string; to: string }[] = rangesRaw
        .filter((r) => r?.from && r?.to)
        .map((r) => ({ from: String(r.from), to: String(r.to) }));

      // Merge overlapping or contiguous ranges
      const merged = sortBy(ranges, 'from').reduce((acc: { from: string; to: string }[], curr) => {
        const last = acc[acc.length - 1];
        if (!last) return [{ ...curr }];
        const contiguous = dayjs(curr.from).isSameOrBefore(dayjs(last.to).add(1, 'day'), 'day');
        return contiguous
          ? [
              ...acc.slice(0, -1),
              {
                from: last.from,
                to: dayjs(curr.to).isAfter(dayjs(last.to)) ? curr.to : last.to,
              },
            ]
          : [...acc, { ...curr }];
      }, []);

      setMissingCurrencyRanges(merged);
    },
    variables: {
      teamId,
      portfolioId,
      end,
    },
  });
}

export { NEW_OPTIMIZATION_SUMMARY_WITHOUT_IGNORE_WEEKDAYS, NEW_OPTIMIZATION_SUMMARY_WITH_IGNORE_WEEKDAYS, useNewOptimizationSummary };
