import React, { useEffect } from 'react';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { get } from 'lodash';

import { NexoyaBudgetDetail, NexoyaWeeklyBudget } from 'types';

import { useUpdateBudgetDetailMutation } from '../../../graphql/portfolio/mutationUpdateBudgetDetail';
import { usePortfolio } from 'context/PortfolioProvider';
import { useProviders } from 'context/ProvidersProvider';
import { usePortfolioQuery } from 'graphql/portfolio/queryPortfolio';

import useTeamColor from 'hooks/useTeamColor';
import { checkOverflow } from 'utils/helpers';

import AvatarProvider from 'components/AvatarProvider';
import PortfolioBudgetPlannedChart from 'components/Charts/PortfolioBudgetPlannedChart';
import PortfolioBudgetSpentChart from 'components/Charts/PortfolioBudgetSpentChart';
import EditBudgetPanel from 'components/EditBudgetPanel';
import ErrorMessage from 'components/ErrorMessage';
import FormattedCurrency from 'components/FormattedCurrency';
import NameTranslation from 'components/NameTranslation';
import Typography from 'components/Typography';

import NoData from '../../kpi0/NoData';
import { LoadingWrapStyled } from '../Content/Content';
import * as Styles from './styles';
import LoadingPlaceholder from '../../../components/LoadingPlaceholder';

dayjs.extend(isoWeek);

type Props = {
  dateFrom: Date;
  dateTo: Date;
  portfolioId: number;
};

type BudgetDetail = {
  providerId: number;
  startDate: Date;
  endDate: Date;
  allocatedValue: number;
};

function OldBudget({ portfolioId, dateFrom, dateTo }: Props) {
  const tableRef = React.useRef(null);
  const [tableData, setTableData] = React.useState([]);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  const {
    portfolioInfo: { data: portfolio, loading: portfolioLoading, updateState: updateLegacyPortfolio },
    budgetChart: { visiblePlannedChart },
  } = usePortfolio();

  const {
    data: legacyPortfolio,
    loading: legacyPortfolioLoading,
    error: legacyPortfolioError,
  } = usePortfolioQuery({
    portfolioId,
    dateFrom,
    dateTo,
    withBudget: true,
  });

  useEffect(() => {
    updateLegacyPortfolio({
      data: legacyPortfolio?.portfolio,
      loading: legacyPortfolioLoading,
      error: legacyPortfolioError,
    });
  }, [legacyPortfolio, legacyPortfolioLoading, legacyPortfolioError]);

  const { providerById } = useProviders();
  const getThemeColor = useTeamColor();

  const [, { loading, error }, extendBudgetDetails] = useUpdateBudgetDetailMutation({
    portfolioId: portfolio?.portfolioId,
  });

  const budget = portfolio?.budget;
  const budgetDetails: NexoyaBudgetDetail[] = budget?.budgetDetails;
  const budgetTotals = budget?.budgetTotals;

  React.useEffect(() => setTableData(get(budget, 'budgetDetails') || []), [portfolio]);

  // Set table shadow only if there is horizontal overflow
  React.useEffect(() => {
    const overflows = checkOverflow(tableRef.current);
    setIsOverflowing(overflows);
  }, [tableRef]);

  function spentValuePerDate(index: number): number {
    return budgetDetails.reduce((acc, curr) => {
      acc += (curr.weeklyBudgets[index] || {}).realizedValue;
      return acc;
    }, 0);
  }

  function spentValuePerProvider(providerId: number): number {
    const target = budgetDetails.find((i) => i.providerId === providerId);
    return (target.weeklyBudgets || []).reduce((acc, curr) => {
      acc += curr.realizedValue;
      return acc;
    }, 0);
  }

  async function handleUpdateBudgetDetail(budgetDetail: BudgetDetail) {
    try {
      const res = await extendBudgetDetails(budgetDetail);

      if (get(res, 'data.updateBudgetDetail', false)) {
        // TODO:
        // What to do on update?
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const getColumnTitle = (item: NexoyaWeeklyBudget) =>
    `${dayjs(item.startDate).format('D MMM')} - ${dayjs(item.endDate).day(0).format('D MMM YYYY')}`;

  // we do this in order not to trigger portfolio query re-fetch
  // which re-renders entire page
  function handleItemUpdate(item: NexoyaWeeklyBudget, value: string) {
    const data = tableData.reduce(
      (accumulator, current) => [
        ...accumulator,
        {
          ...current,
          weeklyBudgets: current.weeklyBudgets.reduce((acc, curr) => {
            return item === curr
              ? [
                  ...acc,
                  {
                    ...curr,
                    allocatedValue: +value,
                  },
                ]
              : [...acc, curr];
          }, []),
        },
      ],
      [],
    );
    setTableData(data);
  }

  if (portfolioLoading) {
    return (
      <LoadingWrapStyled>
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </LoadingWrapStyled>
    );
  }

  if (!budget || Object.keys(budget).length === 0 || budget.budgetDetails.length === 0 || !portfolio) {
    return <NoData />;
  }

  return (
    <>
      {visiblePlannedChart ? (
        <PortfolioBudgetPlannedChart rawData={tableData} portfolioName={portfolio?.title} />
      ) : (
        <PortfolioBudgetSpentChart rawData={budgetDetails} portfolioName={portfolio?.title} />
      )}
      <Styles.WrapperStyled>
        <Styles.StaticTableStyled>
          <Styles.GridHeaderStyled>
            <Typography
              variant="subtitlePill"
              style={{
                textAlign: 'left',
              }}
            >
              Channel
            </Typography>
          </Styles.GridHeaderStyled>
          {budgetDetails.map((item, index) => {
            const provider = providerById(parseInt(`${item.providerId}`));
            return (
              <Styles.GridRowStyled key={index}>
                <Styles.ChannelRowStyled>
                  <AvatarProvider
                    providerId={provider.provider_id}
                    size={24}
                    style={{
                      marginRight: 12,
                    }}
                  />
                  <Styles.ColorMark color={getThemeColor(index)} />
                  <NameTranslation text={provider.name} />
                </Styles.ChannelRowStyled>
              </Styles.GridRowStyled>
            );
          })}
          <Styles.GridRowHeaderStyled>
            <div>Total</div>
          </Styles.GridRowHeaderStyled>
        </Styles.StaticTableStyled>
        <Styles.BudgetColumnStyled className={isOverflowing ? 'BudgetColumnShadow' : ''}>
          <Styles.GridHeaderStyled>
            <Typography variant="subtitlePill">{visiblePlannedChart ? 'Planned' : 'Realized'} Budget</Typography>
          </Styles.GridHeaderStyled>
          {budgetDetails.map((item, index) => (
            <Styles.GridRowStyled key={index}>
              <FormattedCurrency
                key={`${index}-${item.providerId}`}
                amount={visiblePlannedChart ? item.totalAllocatedValue : spentValuePerProvider(item.providerId)}
              />
            </Styles.GridRowStyled>
          ))}
          <Styles.GridRowTotalStyled
            style={{
              textAlign: 'right',
            }}
          >
            <Styles.FormattedCurrencyStyled
              amount={visiblePlannedChart ? budget.allocatedValue : budget.realizedValue}
              isBold={true}
            />
          </Styles.GridRowTotalStyled>
        </Styles.BudgetColumnStyled>
        <Styles.ValuesTableStyled ref={tableRef}>
          <Styles.ValuesTableHeader columnRepeat={budgetDetails[0].weeklyBudgets.length}>
            {budgetDetails[0].weeklyBudgets.map((item, index) => (
              <Styles.GridHeaderStyled key={index}>
                <Typography variant="subtitlePill" key={item.startDate}>
                  {getColumnTitle(item)}
                </Typography>
              </Styles.GridHeaderStyled>
            ))}
          </Styles.ValuesTableHeader>
          {tableData.map((td, index) => (
            <Styles.GridRowUnderlined key={index} columnRepeat={td.weeklyBudgets.length}>
              {td.weeklyBudgets.map((item, index) => (
                <Styles.StyledWeeklyBudget key={`${index}-${item.allocatedValue}`}>
                  <Styles.FormattedCurrencyStyled
                    amount={visiblePlannedChart ? item.allocatedValue : item.realizedValue}
                    isColored={true}
                  />
                  {!dayjs(item.endDate).isBefore(dayjs()) && visiblePlannedChart ? (
                    <EditBudgetPanel
                      value={item.allocatedValue.toFixed(2)}
                      loading={loading}
                      handleChange={(value: string) => {
                        handleItemUpdate(item, value);
                        handleUpdateBudgetDetail({
                          providerId: parseInt(`${item.providerId}`),
                          startDate: item.startDate,
                          endDate: item.endDate,
                          allocatedValue: parseFloat(`${value}`),
                        });
                      }}
                    />
                  ) : null}
                </Styles.StyledWeeklyBudget>
              ))}
            </Styles.GridRowUnderlined>
          ))}
          <Styles.GridRowTotalsStyled columnRepeat={budgetDetails[0].weeklyBudgets.length}>
            {budgetTotals.map((item, index) => (
              <Styles.FormattedCurrencyColored
                key={index}
                amount={visiblePlannedChart ? item.allocatedValue : spentValuePerDate(index)}
                isBold={true}
              />
            ))}
          </Styles.GridRowTotalsStyled>
        </Styles.ValuesTableStyled>
      </Styles.WrapperStyled>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default OldBudget;
