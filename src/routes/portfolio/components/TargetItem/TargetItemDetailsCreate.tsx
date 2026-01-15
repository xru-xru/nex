import React, { ReactNode, useEffect, useState } from 'react';
import { RangeModifier } from 'react-day-picker';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaPortfolioTargetItem } from '../../../../types';

import { usePortfolio } from '../../../../context/PortfolioProvider';
import { useTargetItemQuery } from '../../../../graphql/target/targetItemQuery';

import { format, GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import { DateSelector, getPortfolioDateRanges } from '../../../../components/DateSelector';
import { ExtendedDayModifiers } from '../../../../components/DateSelector/DateSelector';
import Fieldset from '../../../../components/Form/Fieldset';
import FormGroup from '../../../../components/Form/FormGroup';
import { PortfolioTargetTypeSwitch } from '../../../../components/PortfolioTypeSwitch/PortfolioTypeSwitch';
import TextField from '../../../../components/TextField';
import Typography from '../../../../components/Typography';
import SvgDollarInCircle from '../../../../components/icons/DollarInCircle';
import SvgDuration from '../../../../components/icons/Duration';
import SvgTarget from '../../../../components/icons/Target';
import Tooltip from 'components/Tooltip';
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';
import { useTargetItemStore } from '../../../../store/target-item';

type StateUpdater<T> = React.Dispatch<React.SetStateAction<T>>;

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

export const TargetItemDetailsCreate = ({ portfolioId }: { portfolioId: number }) => {
  const [disabledRange, setDisabledRange] = useState<RangeModifier[]>();

  const {
    targetItemState: { targetItemName, value, start, end, maxBudget },
    lastTargetNumber,
    setLastTargetNumber,
    lastMaxBudgetNumber,
    setLastMaxBudgetNumber,
    handleChangeValueByKey,
  } = useTargetItemStore();

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const { data: targetItemData } = useTargetItemQuery({
    portfolioId,
  });

  const { currency, numberFormat } = useCurrencyStore();
  const targetItems: NexoyaPortfolioTargetItem[] = targetItemData?.portfolioV2?.targetItems;
  const targetFunnelStep = portfolioMeta?.defaultOptimizationTarget;

  useEffect(() => {
    const targetItemsDateRanges = targetItems?.map((item) => ({
      from: new Date(format(item.start, 'utcStartMidnight')),
      to: new Date(format(item.end, 'utcStartMidnight')),
    }));
    if (targetItemsDateRanges?.length) {
      setDisabledRange(targetItemsDateRanges);
    }
  }, [targetItemData]);

  const dateRangeProps = {
    hidePastQuickSelection: true,
    hideFutureQuickSelection: false,
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

  const textToNumber = (propertyKey: string, lastNumber: number) => {
    handleChangeValueByKey({ target: { name: propertyKey, value: lastNumber } });
  };

  const numberToText = (
    numberToConvert: number | string | null,
    propertyKey: string,
    setLastNumber: StateUpdater<string | null>,
  ) => {
    if (numberToConvert === null || numberToConvert === '') {
      setLastNumber(null);
      handleChangeValueByKey({ target: { name: propertyKey, value: null } });
      return;
    }
    setLastNumber(numberToConvert?.toString());
    handleChangeValueByKey({
      target: {
        name: propertyKey,
        value: parseCurrency(+numberToConvert),
      },
    });
  };

  const renderDay = (day: Date, modifiers: ExtendedDayModifiers): ReactNode => {
    // Render the disabled tooltip if day is within the budget item's start/end date & set the modifiers to disabled
    const isWithinTargetItemTimeframe =
      disabledRange?.some((range) => dayjs(day).isBetween(range.from, range.to, 'day', '[]')) ?? false;

    return modifiers.disabled ? (
      <Tooltip
        style={{ maxWidth: 234 }}
        content={
          isWithinTargetItemTimeframe ? (
            <Typography withEllipsis={false} style={{ fontSize: 12, fontWeight: 500 }}>
              This date range is disabled as it is taken by a another target item.
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
        <FormGroup style={{ marginBottom: 40, width: 390 }}>
          <Typography variant="h3">Target item name</Typography>
          <TextField
            id="title"
            name="targetItemName"
            value={targetItemName}
            onChange={handleChangeValueByKey}
            placeholder="Give your target item a name"
          />
        </FormGroup>
        <FormGroup style={{ marginBottom: 40, width: 390 }}>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            <SvgDuration style={{ width: 24, height: 24 }} />
            Timeframe
          </Typography>
          <Typography
            withEllipsis={false}
            variant="subtitle"
            style={{ fontSize: 14, fontWeight: 400, marginBottom: 16 }}
          >
            When will this target item run?
          </Typography>
          <DateSelector
            renderDay={renderDay}
            disabledRange={disabledRange}
            dateFrom={start || null}
            dateTo={end || null}
            applyButtonTooltipDisabledContent="This date range is disabled as overlapping target items are within this range."
            onDateChange={(dateRange) => {
              handleChangeValueByKey({ target: { name: 'start', value: dateRange.from } });
              handleChangeValueByKey({ target: { name: 'end', value: dateRange.to } });
            }}
            {...dateRangeProps}
            panelProps={{
              side: 'bottom',
              align: 'start',
            }}
            style={{
              width: 390,
            }}
          />
        </FormGroup>
        <FormGroup style={{ marginBottom: 40, width: 390 }}>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            <SvgTarget style={{ width: 24, height: 24 }} />
            Target
          </Typography>
          <Typography
            withEllipsis={false}
            variant="subtitle"
            style={{ fontSize: 14, fontWeight: 400, marginBottom: 16 }}
          >
            <PortfolioTargetTypeSwitch
              renderForCPAType={() => `What daily Cost-per ${targetFunnelStep?.title} would you like to achieve?`}
              renderForROASType={() => `What daily ROAS would you like to achieve?`}
            />
          </Typography>
          <PortfolioTargetTypeSwitch
            renderForCPAType={() => (
              <TextField
                id="target-limit-input"
                type="currency"
                name="value"
                placeholder={`Enter daily target cost-per ${targetFunnelStep?.title} in ${currencySymbol[currency]}`}
                step={0.01}
                value={value ?? ''}
                onFocus={() => textToNumber('value', lastTargetNumber)}
                onBlur={() => numberToText(value, 'value', setLastTargetNumber)}
                onChange={(e) => handleChangeValueByKey({ target: { name: 'value', value: e.target.value } })}
              />
            )}
            renderForROASType={() => (
              <TextField
                id="target-limit-input"
                type="number"
                name="value"
                placeholder="Enter ROAS as a percentage"
                step={1}
                max={999}
                value={value ?? ''}
                endAdornment="%"
                onChange={(e) => {
                  const { value, min, max } = e.target;
                  const validatedValue = Math.max(Number(min), Math.min(Number(max), Number(value)));
                  handleChangeValueByKey({ target: { name: 'value', value: validatedValue } });
                }}
              />
            )}
          />
        </FormGroup>
        <FormGroup style={{ marginBottom: 40, width: 390 }}>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            <SvgDollarInCircle style={{ width: 24, height: 24 }} />
            Maximum budget limit
          </Typography>
          <Typography
            withEllipsis={false}
            variant="subtitle"
            style={{ fontSize: 14, fontWeight: 400, marginBottom: 16 }}
          >
            Set the maximum budget limit for this target item.
          </Typography>
          <TextField
            id="target-limit-input"
            type="currency"
            name="maxBudget"
            placeholder={`Enter the maximum budget in ${currencySymbol[currency]}`}
            step={0.01}
            value={maxBudget ?? ''}
            onFocus={() => textToNumber('maxBudget', lastMaxBudgetNumber)}
            onBlur={() => numberToText(maxBudget, 'maxBudget', setLastMaxBudgetNumber)}
            onChange={(e) => handleChangeValueByKey({ target: { name: 'maxBudget', value: e.target.value } })}
            error={true}
          />
        </FormGroup>
      </Fieldset>
    </WrapStyled>
  );
};
