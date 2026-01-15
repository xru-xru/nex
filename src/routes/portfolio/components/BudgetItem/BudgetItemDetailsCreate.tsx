import React, { ReactNode, useEffect, useState } from 'react';
import { RangeModifier } from 'react-day-picker/types/Modifiers';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaBudgetItem } from '../../../../types';
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
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';
import { useBudgetItemStore } from '../../../../store/budget-item';

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
}

export const BudgetItemDetailsCreate = ({ portfolioId, start, end }: Props) => {
  const [disabledRange, setDisabledRange] = useState<RangeModifier[]>();
  const {
    budgetItemState: { name, budgetAmount, startDate, endDate },
    lastBudgetNumber,
    setLastBudgetNumber,
    handleChangeValueByKey,
  } = useBudgetItemStore();

  const { data: budgetItemData } = useBudgetItemQuery({
    portfolioId,
    start,
    end,
  });

  const budgetItems: NexoyaBudgetItem[] = budgetItemData?.portfolioV2?.budget?.budgetItems;

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const { currency, numberFormat } = useCurrencyStore();

  useEffect(() => {
    const budgetItemsDateRanges = budgetItems?.map((item) => ({
      from: new Date(format(item.startDate, 'utcStartMidnight')),
      to: new Date(format(item.endDate, 'utcStartMidnight')),
    }));
    if (budgetItemsDateRanges?.length) {
      setDisabledRange(budgetItemsDateRanges);
    }
  }, [budgetItemData]);

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

  const numberToText = (numberToConvert: any = budgetAmount) => {
    if (numberToConvert === null || numberToConvert === '') {
      setLastBudgetNumber(null);
      handleChangeValueByKey({ target: { name: 'budgetAmount', value: null } });
      return;
    }

    if (isNaN(numberToConvert)) {
      const numericValue = numberToConvert ? numberToConvert.replace(/[^\\d]/g, '') : '';
      numberToConvert = numericValue;
    }

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

  return (
    <WrapStyled>
      <Fieldset>
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
            dateFrom={startDate || null}
            dateTo={endDate || null}
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
          <Typography variant="h3">Budget</Typography>
          <TextField
            id="budget-limit-input"
            type="currency"
            name="budgetAmount"
            placeholder={`Enter the budget for this item in ${currencySymbol[currency]}`}
            step={0.01}
            value={budgetAmount ?? ''}
            onFocus={() => textToNumber()}
            onBlur={() => numberToText()}
            onChange={(e) => handleChangeValueByKey({ target: { name: 'budgetAmount', value: e.target.value } })}
            error={true}
          />
        </FormGroup>
      </Fieldset>
    </WrapStyled>
  );
};
