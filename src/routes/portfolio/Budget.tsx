import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { sortBy } from 'lodash';
import { StringParam, useQueryParams } from 'use-query-params';

import { NexoyaBudgetItem, NexoyaDailyMetric, NexoyaPortfolioBudget } from 'types';
import { usePortfolio } from '../../context/PortfolioProvider';
import { useBudgetItemQuery, useBudgetItemWithDailyItemsQuery } from '../../graphql/budget/budgetItemQuery';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

import Button from '../../components/Button';
import PacingView from '../../components/Charts/budget/PacingView';
import LoadingPlaceholder from '../../components/LoadingPlaceholder/LoadingPlaceholder';
import { BudgetItemCreate } from './components/BudgetItem/BudgetItemCreate';
import { BudgetItemsTable } from './components/BudgetItem/BudgetItemsTable';
import { computeUnionOfBudgetItems } from './components/BudgetItem/utils';

import { LoadingWrapStyled } from './Content/Content';
import NoDataFound from './NoDataFound';

dayjs.extend(isoWeek);

type Props = {
  dateFrom: Date;
  dateTo: Date;
  portfolioStart: Date;
  portfolioEnd: Date;
  portfolioId: number;
};

// eslint-disable-next-line no-unused-vars
enum BudgetChartType {
  // eslint-disable-next-line no-unused-vars
  OVERVIEW = 'overview',
  // eslint-disable-next-line no-unused-vars
  PACING = 'pacing',
}
function Budget({ portfolioId, portfolioStart, portfolioEnd, dateFrom, dateTo }: Props) {
  const [budgetItemDrawerOpen, setBudgetItemDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useQueryParams({
    budgetChart: StringParam,
    dateFrom: StringParam,
    dateTo: StringParam,
  });
  const {
    portfolioInfo: { data: portfolio, updateState: updateLegacyPortfolio },
    // TODO: Rename to visibleOverviewChart
  } = usePortfolio();

  const { data: budgetItemData, loading: budgetItemLoading } = useBudgetItemQuery({
    portfolioId,
    start: portfolioStart,
    end: portfolioEnd,
  });

  const { data: budgetItemChartData, loading: budgetItemChartLoading } = useBudgetItemWithDailyItemsQuery({
    portfolioId,
    start: queryParams?.dateFrom,
    end: queryParams?.dateTo,
  });

  const partialPortfolioBudget: Partial<NexoyaPortfolioBudget> = budgetItemData?.portfolioV2?.budget;
  const portfolioBudget: NexoyaPortfolioBudget = budgetItemChartData?.portfolioV2?.budget;
  const budgetItems = partialPortfolioBudget?.budgetItems;

  const dailySpendings: NexoyaDailyMetric[] = portfolioBudget?.spent?.dailySpendings;

  const sortedBudgetItems = sortBy(budgetItemChartData?.portfolioV2?.budget?.budgetItems, 'startDate');
  const allBudgetItemsUnion: NexoyaBudgetItem = computeUnionOfBudgetItems(sortedBudgetItems);

  useEffect(() => {
    if (!queryParams.budgetChart) {
      setQueryParams({ budgetChart: BudgetChartType.OVERVIEW });
    }
  }, []);

  if (budgetItemLoading || budgetItemChartLoading) {
    return (
      <LoadingWrapStyled>
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </LoadingWrapStyled>
    );
  }

  return (
    <>
      <PacingView
        dailySpendings={dailySpendings}
        budgetDailyItems={allBudgetItemsUnion?.budgetDailyItems}
        budgetReallocation={portfolioBudget?.budgetReallocation}
        portfolioName={portfolio?.title}
      />
      {budgetItems?.length ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setBudgetItemDrawerOpen(true);
                track(EVENT.ADD_BUDGET_ITEM_DIALOG);
              }}
            >
              Add budget item
            </Button>
          </div>
          <BudgetItemsTable
            start={dateFrom}
            end={dateTo}
            allBudgetItemsUnion={allBudgetItemsUnion}
            budgetItems={budgetItems}
            portfolioId={portfolioId}
            extendedBudgetItems={budgetItemChartData?.portfolioV2?.budget?.budgetItems}
            extendedBudgetItemsLoading={budgetItemChartLoading}
            spendForPeriod={dailySpendings?.reduce(
              (acc, dm: NexoyaDailyMetric) => acc + dm?.providers?.reduce((acc, p) => acc + p?.value?.adSpend, 0),
              0,
            )}
          />
        </>
      ) : (
        <NoDataFound
          title="You don’t have any budget items yet"
          subtitle="Click the button below to get started"
          cta={
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <Button variant="contained" color="secondary" onClick={() => setBudgetItemDrawerOpen(true)}>
                Add budget item
              </Button>
            </div>
          }
        />
      )}
      <BudgetItemCreate
        budgetItemDrawerOpen={budgetItemDrawerOpen}
        setBudgetItemDrawerOpen={setBudgetItemDrawerOpen}
        portfolioId={portfolioId}
        start={portfolioStart}
        end={portfolioEnd}
      />
    </>
  );
}

export default Budget;
