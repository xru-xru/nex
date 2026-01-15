import React, { ReactNode, useEffect, useState } from 'react';
import { RangeModifier } from 'react-day-picker/types/Modifiers';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { NexoyaPortfolioTargetItem, NexoyaPortfolioType, NexoyaTargetItemStatus } from '../../../../types';

import { usePortfolio } from '../../../../context/PortfolioProvider';
import { useTargetItemQuery } from '../../../../graphql/target/targetItemQuery';

import { format, GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import { DateSelector, getPortfolioDateRanges } from '../../../../components/DateSelector';
import { ExtendedDayModifiers } from '../../../../components/DateSelector/DateSelector';
import Fieldset from '../../../../components/Form/Fieldset';
import FormGroup from '../../../../components/Form/FormGroup';
import { PortfolioTargetTypeSwitch } from '../../../../components/PortfolioTypeSwitch';
import TextField from '../../../../components/TextField';
import Tooltip from '../../../../components/Tooltip';
import Typography from '../../../../components/Typography';
import SvgDollarInCircle from '../../../../components/icons/DollarInCircle';
import SvgDuration from '../../../../components/icons/Duration';
import SvgTarget from '../../../../components/icons/Target';

import { nexyColors } from '../../../../theme';
import { renderTargetItemStatus } from './utils';
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

type StateUpdater<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
  portfolioId: number;
  targetItemState: NexoyaPortfolioTargetItem;
  handleChangeValueByKey: (ev: { target: { name: string; value: unknown } }) => void;
  intermediateTargetAmount: number | null;
  setIntermediateTargetAmount: (value: number | null) => void;
  lastTargetNumber?: string | number;
  setLastTargetNumber?: (value: string) => void;
  lastMaxBudgetNumber?: string | number;
  setLastMaxBudgetNumber?: (value: string) => void;
}

export const TargetItemDetailsEdit = ({
  portfolioId,
  targetItemState,
  handleChangeValueByKey,
  lastTargetNumber,
  setLastTargetNumber,
  intermediateTargetAmount,
  lastMaxBudgetNumber,
  setLastMaxBudgetNumber,
}: Props) => {
  const [disabledRange, setDisabledRange] = useState<RangeModifier[]>();

  const { data: targetItemData } = useTargetItemQuery({
    portfolioId,
  });

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const { name, value, start, end, maxBudget } = targetItemState || {};
  const targetItems: NexoyaPortfolioTargetItem[] = targetItemData?.portfolioV2?.targetItems;
  const targetFunnelStep = portfolioMeta?.defaultOptimizationTarget;
  const isPortfolioTypeROAS = portfolioMeta?.type === NexoyaPortfolioType.Roas;

  const { currency, numberFormat } = useCurrencyStore();

  useEffect(() => {
    if (!isPortfolioTypeROAS) {
      numberToText(value, 'value', setLastTargetNumber);
    } else {
      setLastTargetNumber(value?.toString());
    }
    numberToText(maxBudget, 'maxBudget', setLastMaxBudgetNumber);
  }, []);

  useEffect(() => {
    const targetItemsDateRanges = targetItems
      ?.filter((item) => item.targetItemId !== targetItemState?.targetItemId)
      ?.map((item) => ({
        from: new Date(format(item.start, 'utcStartMidnight')),
        to: new Date(format(item.end, 'utcStartMidnight')),
      }));

    if (targetItemsDateRanges?.length) {
      setDisabledRange(targetItemsDateRanges);
    }
  }, [targetItemData, targetItemState?.targetItemId]);

  const getCopyBasedOnTargetItemStatus = (targetItemStatus: NexoyaTargetItemStatus) => {
    switch (targetItemStatus) {
      case NexoyaTargetItemStatus.ActiveNoOptimization:
        return 'The start date of this target item is in the past, therefore the timeframe can not be changed. The planned target must be higher than the total spend so far.';
      case NexoyaTargetItemStatus.Active:
        return 'The start date of this target item is in the past, therefore the timeframe can not be changed. The planned target must be higher than the total spend so far.';
      case NexoyaTargetItemStatus.Past:
        return 'This target item is in the past, therefore only the target item name can be changed.';
      case NexoyaTargetItemStatus.Planned:
        return "This target item has a timeframe in the future. This means that you can edit this target item's timeframe and planned target.";
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

  const textToNumber = (propertyKey: string, lastNumber: number | string) => {
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

    setLastNumber(numberToConvert?.toString() || '');
    handleChangeValueByKey({
      target: {
        name: propertyKey,
        value: parseCurrency(+numberToConvert),
      },
    });
  };
  const renderDay = (day: Date, modifiers: ExtendedDayModifiers): ReactNode => {
    // Render the disabled tooltip if day is within the target item's start/end date & set the modifiers to disabled
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

  // @ts-ignore
  const isPlannedSmallerThanSpendSoFar = intermediateTargetAmount < targetItemState?.spendSoFar;
  return (
    <WrapStyled>
      <Fieldset>
        <FormGroup>
          <Typography style={{ marginBottom: 12 }} variant="h3">
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              Target item status:
              {renderTargetItemStatus(targetItemState.status)}
            </div>
          </Typography>
          <Typography withEllipsis={false} variant="subtitle" style={{ fontSize: 14, fontWeight: 400, maxWidth: 600 }}>
            {getCopyBasedOnTargetItemStatus(targetItemState.status)}
          </Typography>
          <Typography variant="subtitle" style={{ marginTop: 8, fontSize: 12 }}>
            Important: Changing the planned target does not affect the actual spending on your advertising channels.
          </Typography>
        </FormGroup>
        <FormGroup style={{ marginBottom: 40, width: 390 }}>
          <Typography variant="h3">Target item name</Typography>
          <TextField
            id="title"
            name="name"
            value={name}
            onChange={handleChangeValueByKey}
            placeholder="Name your new target item here"
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
            dateFrom={dayjs(start).toDate() || null}
            dateTo={dayjs(end).toDate() || null}
            disabled={targetItemState?.status !== NexoyaTargetItemStatus.Planned}
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
                disabled={
                  targetItemState?.status === NexoyaTargetItemStatus.Active ||
                  targetItemState.status === NexoyaTargetItemStatus.Past
                }
                onChange={(e) => handleChangeValueByKey({ target: { name: 'value', value: e.target.value } })}
              />
            )}
            renderForROASType={() => (
              <TextField
                id="target-limit-input"
                type="number"
                name="value"
                maxLength={3}
                placeholder="Enter ROAS as a percentage"
                step={1}
                max={9999}
                value={value ?? ''}
                endAdornment="%"
                disabled={
                  targetItemState?.status === NexoyaTargetItemStatus.Active ||
                  targetItemState.status === NexoyaTargetItemStatus.Past
                }
                onChange={(e) => {
                  const { value, min, max } = e.target;
                  const validatedValue = Math.max(Number(min), Math.min(Number(max), Number(value)));
                  handleChangeValueByKey({ target: { name: 'value', value: validatedValue } });
                  setLastTargetNumber(validatedValue.toString());
                }}
              />
            )}
          />
          {isPlannedSmallerThanSpendSoFar ? (
            <Typography style={{ color: nexyColors.orangeyRed, fontSize: 13, marginTop: 8, marginLeft: 2 }}>
              The planned budget must be higher than the total spend so far
            </Typography>
          ) : null}
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
            disabled={
              targetItemState?.status === NexoyaTargetItemStatus.Active ||
              targetItemState.status === NexoyaTargetItemStatus.Past
            }
            onFocus={() => textToNumber('maxBudget', lastMaxBudgetNumber)}
            onBlur={() => numberToText(maxBudget, 'maxBudget', setLastMaxBudgetNumber)}
            onChange={(e) => handleChangeValueByKey({ target: { name: 'maxBudget', value: e.target.value } })}
            error={true}
          />
        </FormGroup>
        {targetItemState?.status !== NexoyaTargetItemStatus.Planned ? (
          <FormGroup style={{ marginBottom: 40, width: 390 }}>
            <Typography variant="h3">
              <SvgTarget style={{ width: 24, height: 24 }} />
              Latest achieved
            </Typography>

            <PortfolioTargetTypeSwitch
              renderForCPAType={() => (
                <TextField
                  id="target-cpa-latest-achieved-input"
                  type="currency"
                  name="value"
                  step={0.01}
                  value={targetItemState.achieved ? parseCurrency(targetItemState.achieved) : ''}
                  disabled
                />
              )}
              renderForROASType={() => (
                <TextField
                  id="target-roas-latest-achieved-input"
                  type="number"
                  name="value"
                  maxLength={3}
                  step={1}
                  max={100}
                  value={targetItemState?.achieved ?? ''}
                  endAdornment="%"
                  disabled
                />
              )}
            />
          </FormGroup>
        ) : null}
      </Fieldset>
    </WrapStyled>
  );
};
