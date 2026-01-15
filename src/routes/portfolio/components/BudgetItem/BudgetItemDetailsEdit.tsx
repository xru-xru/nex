import React, { ReactNode, useEffect, useState } from 'react';
import { RangeModifier } from 'react-day-picker/types/Modifiers';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaBudgetItem, NexoyaBudgetItemStatus } from '../../../../types';

import { usePortfolio } from '../../../../context/PortfolioProvider';
import { useBudgetItemQuery } from '../../../../graphql/budget/budgetItemQuery';

import { format, GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import { DateSelector, getPortfolioDateRanges } from '../../../../components/DateSelector';
import { ExtendedDayModifiers } from '../../../../components/DateSelector/DateSelector';
import Fieldset from '../../../../components/Form/Fieldset';
import FormGroup from '../../../../components/Form/FormGroup';
import TextField from '../../../../components/TextField';
import Tooltip from '../../../../components/Tooltip';
import Typography from '../../../../components/Typography';

import { nexyColors } from '../../../../theme';
import { renderBudgetItemStatus } from './utils';
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';

const WrapStyled = styled.div`
  .NEXYH3 {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    svg {
      display: inline-block;
      font-size: 32px;
      margin-right: 12px;
    }
  }
`;

interface Props {
  portfolioId: number;
  start: Date | string;
  end: Date | string;
  budgetItemState: NexoyaBudgetItem;
  handleChangeValueByKey: (ev: { target: { name: string; value: unknown } }) => void;
  intermediateBudgetAmount: number | null;
  setIntermediateBudgetAmount: (value: number | null) => void;
  lastBudgetNumber?: string;
  setLastBudgetNumber?: (value: string) => void;
}

export const BudgetItemDetailsEdit = ({
  portfolioId,
  start,
  end,
  budgetItemState,
  handleChangeValueByKey,
  lastBudgetNumber,
  setLastBudgetNumber,
  intermediateBudgetAmount,
  setIntermediateBudgetAmount,
}: Props) => {
  const [disabledRange, setDisabledRange] = useState<RangeModifier[]>();

  const { data: budgetItemData } = useBudgetItemQuery({
    portfolioId,
    start,
    end,
  });

  const budgetItems: NexoyaBudgetItem[] = budgetItemData?.portfolioV2?.budget?.budgetItems;

  const { name, budgetAmount, startDate, endDate } = budgetItemState || {};

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const { currency, numberFormat } = useCurrencyStore();

  useEffect(() => {
    numberToText();
  }, []);

  useEffect(() => {
    const budgetItemsDateRanges = budgetItems
      ?.filter((item) => item.budgetItemId !== budgetItemState?.budgetItemId)
      ?.map((item) => ({
        from: new Date(format(item.startDate, 'utcStartMidnight')),
        to: new Date(format(item.endDate, 'utcStartMidnight')),
      }));

    if (budgetItemsDateRanges?.length) {
      setDisabledRange(budgetItemsDateRanges);
    }
  }, [budgetItemData, budgetItemState?.budgetItemId]);

  const getCopyBasedOnBudgetItemStatus = (budgetItemStatus: NexoyaBudgetItemStatus) => {
    switch (budgetItemStatus) {
      case NexoyaBudgetItemStatus.ActiveNoOptimization:
        return 'The start date of this budget item is in the past, therefore the timeframe can not be changed. The planned budget must be higher than the total spend so far.';
      case NexoyaBudgetItemStatus.Active:
        return 'The start date of this budget item is in the past, therefore the timeframe can not be changed. The planned budget must be higher than the total spend so far.';
      case NexoyaBudgetItemStatus.Past:
        return 'This budget item is in the past, therefore only the budget item name can be changed.';
      case NexoyaBudgetItemStatus.Planned:
        return "This budget item has a timeframe in the future. This means that you can edit this budget item's timeframe and planned budget.";
      default:
        return '';
    }
  };

  const dateRangeProps = {
    hidePastQuickSelection: true,
    hideFutureQuickSelection: false,
    useNexoyaDateRanges: false,
    disableBeforeDate: new Date(format(dayjs(portfolioMeta?.start), 'utcStartMidnight')),
    disableAfterDate: new Date(format(dayjs(portfolioMeta?.end), 'utcStartMidnight')),
    dateRanges: {
      ...getPortfolioDateRanges(
        new Date(dayjs(portfolioMeta?.start).utc().format(GLOBAL_DATE_FORMAT)),
        new Date(dayjs(portfolioMeta?.end).utc().format(GLOBAL_DATE_FORMAT)),
      ),
      allTime: {
        name: 'All time',
        isPast: false,
        getDateRange: () => ({
          from: new Date(format(dayjs(portfolioMeta?.start), 'utcStartMidnight')),
          to: new Date(format(dayjs(portfolioMeta?.end), 'utcStartMidnight')),
        }),
      },
    },
  };

  const parseCurrency = (value: string | number) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat(numberFormat, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
        .format(value)
        .replace('SAR', 'ر.س');
    }
    const numberValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return isNaN(numberValue) ? null : numberValue;
  };

  const textToNumber = () => {
    handleChangeValueByKey({ target: { name: 'budgetAmount', value: lastBudgetNumber } });
  };

  const numberToText = (numberToConvert = budgetAmount) => {
    // @ts-ignore
    if (numberToConvert === null || numberToConvert === '') {
      setLastBudgetNumber(null);
      handleChangeValueByKey({ target: { name: 'budgetAmount', value: null } });
      return;
    }

    if (isNaN(numberToConvert)) {
      // @ts-ignore
      const numericValue = numberToConvert ? numberToConvert.replace(/[^\d]/g, '') : '';
      numberToConvert = numericValue;
    }

    setIntermediateBudgetAmount(numberToConvert);
    setLastBudgetNumber(numberToConvert?.toString() || '');
    handleChangeValueByKey({
      target: {
        name: 'budgetAmount',
        value: parseCurrency(+numberToConvert),
      },
    });
  };

  const renderDay = (day: Date, modifiers: ExtendedDayModifiers): ReactNode => {
    // Render the disabled tooltip if day is within the budget item's start/end date & set the modifiers to disabled
    const isWithinBudgetItemTimeframe =
      disabledRange?.some((range) => dayjs(day).isBetween(range.from, range.to, 'day', '[]')) ?? false;

    return modifiers.disabled ? (
      <Tooltip
        style={{ maxWidth: 234 }}
        content={
          isWithinBudgetItemTimeframe ? (
            <Typography withEllipsis={false} style={{ fontSize: 12, fontWeight: 500 }}>
              This date range is disabled as it is taken by a another budget item.
            </Typography>
          ) : (
            ''
          )
        }
        popperProps={{
          style: {
            zIndex: 3300,
          },
        }}
      >
        <div {...modifiers}>{day.getDate()}</div>
      </Tooltip>
    ) : (
      <div {...modifiers}>{day.getDate()}</div>
    );
  };

  const isPlannedSmallerThanSpendSoFar = intermediateBudgetAmount < budgetItemState?.spendSoFar;
  return (
    <WrapStyled>
      <Fieldset>
        <FormGroup>
          <Typography style={{ marginBottom: 12 }} variant="h3">
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              Budget item status:
              {renderBudgetItemStatus({
                startDate,
                endDate,
              })}
            </div>
          </Typography>
          <Typography withEllipsis={false} variant="subtitle" style={{ fontSize: 14, fontWeight: 400, maxWidth: 600 }}>
            {getCopyBasedOnBudgetItemStatus(budgetItemState.status)}
          </Typography>
          <Typography variant="subtitle" style={{ marginTop: 8, fontSize: 12 }}>
            Important: Changing the planned budget does not affect the actual spending on your advertising channels.
          </Typography>
        </FormGroup>
        <FormGroup>
          <Typography variant="h3">Budget item name</Typography>
          <TextField
            id="title"
            name="name"
            value={name}
            onChange={handleChangeValueByKey}
            placeholder="Name your new budget item here"
          />
        </FormGroup>
        <FormGroup>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            Timeframe
          </Typography>
          <Typography variant="subtitle" style={{ fontSize: 12, marginBottom: 16 }}>
            Note: separate budget items cannot overlap.
          </Typography>
          <DateSelector
            disabled={budgetItemState?.status !== NexoyaBudgetItemStatus.Planned}
            dateFrom={dayjs(startDate).toDate() || new Date(format(dayjs().subtract(1, 'week'), 'utcStartMidnight'))}
            dateTo={dayjs(endDate).toDate() || new Date(format(dayjs(), 'utcStartMidnight'))}
            renderDay={renderDay}
            disabledRange={disabledRange}
            onDateChange={(dateRange) => {
              handleChangeValueByKey({ target: { name: 'startDate', value: dateRange.from } });
              handleChangeValueByKey({ target: { name: 'endDate', value: dateRange.to } });
            }}
            {...dateRangeProps}
            panelProps={{
              side: 'bottom',
              align: 'start',
            }}
            style={{
              width: '100%',
            }}
          />
        </FormGroup>
        <FormGroup>
          <Typography variant="h3">Planned budget</Typography>

          <TextField
            disabled={budgetItemState?.status === NexoyaBudgetItemStatus.Past}
            error={budgetAmount < budgetItemState?.spendSoFar}
            id="budget-limit-input"
            name="budgetAmount"
            placeholder={`Enter the budget for this item in ${currencySymbol[currency]}`}
            step={0.01}
            min={budgetItemState?.spendSoFar ?? null}
            value={budgetAmount ?? ''}
            onFocus={() => textToNumber()}
            onBlur={() => numberToText()}
            onChange={(e) => handleChangeValueByKey({ target: { name: 'budgetAmount', value: e.target.value } })}
          />
          {isPlannedSmallerThanSpendSoFar ? (
            <Typography style={{ color: nexyColors.orangeyRed, fontSize: 13, marginTop: 8, marginLeft: 2 }}>
              The planned budget must be higher than the total spend so far
            </Typography>
          ) : null}
        </FormGroup>
        {budgetItemState?.status !== NexoyaBudgetItemStatus.Planned ? (
          <FormGroup>
            <Typography variant="h3">Total spend so far</Typography>
            <TextField
              disabled
              id="budget-limit-input"
              type="currency"
              name="budgetAmount"
              step={0.01}
              value={parseCurrency(budgetItemState.spendSoFar)}
            />
          </FormGroup>
        ) : null}
      </Fieldset>
    </WrapStyled>
  );
};
