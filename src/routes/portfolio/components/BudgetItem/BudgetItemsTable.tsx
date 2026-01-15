import React, { useState } from 'react';

import dayjs from 'dayjs';
import { sortBy } from 'lodash';
import styled, { css } from 'styled-components';

import { NexoyaBudgetItem } from '../../../../types';

import { READABLE_FORMAT } from '../../../../utils/dates';

import GridHeader from '../../../../components/GridHeader';
import GridWrap from '../../../../components/GridWrap';
import * as Styles from '../../../../components/PerformanceTable/styles';
import SpendProgressBar from '../../../../components/SpendProgressBar';
import SvgChevronDown from '../../../../components/icons/ChevronDown';
import Collapse from 'components/Collapse';
import GridRow from 'components/GridRow';
import Typography from 'components/Typography';

import { Skeleton } from '../../../../components-ui/Skeleton';
import { BudgetItemTDM } from './BudgetItemTDM';
import { calculateBudgetPlannedBetweenDates, renderBudgetItemStatus } from './utils';

interface Props {
  budgetItems: NexoyaBudgetItem[];
  extendedBudgetItems: NexoyaBudgetItem[];
  allBudgetItemsUnion: NexoyaBudgetItem;
  extendedBudgetItemsLoading: boolean;
  spendForPeriod: number;
  portfolioId: number;
  start: Date;
  end: Date;
}

export const BudgetItemsTable = ({
  budgetItems,
  spendForPeriod,
  allBudgetItemsUnion,
  portfolioId,
  start,
  end,
  extendedBudgetItemsLoading,
  extendedBudgetItems,
}: Props) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [editedBudgetItem, setEditedBudgetItem] = useState<NexoyaBudgetItem>();

  const plannedForPeriod = calculateBudgetPlannedBetweenDates(allBudgetItemsUnion?.budgetDailyItems, start, end);
  const totalPlanned = budgetItems.reduce((acc, curr) => acc + curr.budgetAmount, 0) || 0;

  const percentageDifference = Math.abs(Math.round(((plannedForPeriod - spendForPeriod) / plannedForPeriod) * 100));
  const sortedBudgetItems = sortBy(budgetItems, 'startDate');

  return (
    <WrapStyled>
      <GridWrap>
        <GridHeader style={{ justifyItems: 'start' }}>
          <TypographyStyled>
            <span>Budget item</span>
          </TypographyStyled>
          <TypographyStyledAligned>
            <span>Status</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Timeframe</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Total planned</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Period planned</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Period spend</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Spend vs planned</span>
          </TypographyStyledAligned>
        </GridHeader>
        <GridRow style={{ justifyItems: 'start', padding: '12px 24px', background: '#FAFAFA' }}>
          <Styles.ContentRowStyled>
            <Typography withTooltip>Total budget items</Typography>
          </Styles.ContentRowStyled>
          <Styles.ContentRowStyled></Styles.ContentRowStyled>
          <Styles.ContentRowStyled style={{ color: '#888a94' }}>
            <Typography style={{ maxWidth: 150 }} withTooltip>
              {dayjs(sortedBudgetItems[0]?.startDate).format(READABLE_FORMAT)} -{' '}
              {dayjs(sortedBudgetItems[sortedBudgetItems.length - 1]?.endDate).format(READABLE_FORMAT)}
            </Typography>
          </Styles.ContentRowStyled>
          <Styles.FormattedCurrencyStyled color="#888a94" amount={totalPlanned} />
          <Styles.FormattedCurrencyStyled color="#888a94" amount={plannedForPeriod || 0} />
          <Styles.FormattedCurrencyStyled color="#888a94" amount={spendForPeriod || 0} />
          <SpendProgressBarContainer>
            <SpendProgressBar
              percentage={spendForPeriod > plannedForPeriod ? +percentageDifference : -percentageDifference}
            />
          </SpendProgressBarContainer>
          <Styles.ChevronWrap
            style={{
              justifySelf: 'flex-end',
              padding: 9,
            }}
            expanded={expanded}
            onClick={() => setExpanded((s) => !s)}
          >
            <SvgChevronDown />
          </Styles.ChevronWrap>
        </GridRow>
        <Collapse in={expanded}>
          {[...budgetItems]
            ?.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            ?.map((budgetItem) => {
              return (
                <GridRow style={{ justifyItems: 'start', padding: '12px 24px' }} key={budgetItem.budgetItemId}>
                  <Styles.ContentRowStyled style={{ marginLeft: 12 }}>
                    <Typography withTooltip={budgetItem?.name?.length > 12} withEllipsis style={{ maxWidth: 110 }}>
                      {budgetItem.name}
                    </Typography>
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled>{renderBudgetItemStatus(budgetItem)}</Styles.ContentRowStyled>
                  <Styles.ContentRowStyled style={{ color: '#888a94' }}>
                    <Typography style={{ maxWidth: 150 }} withTooltip>
                      {dayjs(budgetItem.startDate).format(READABLE_FORMAT)} -{' '}
                      {dayjs(budgetItem.endDate).format(READABLE_FORMAT)}
                    </Typography>
                  </Styles.ContentRowStyled>
                  <Styles.FormattedCurrencyStyled color="#888a94" amount={budgetItem.budgetAmount || 0} />
                  {extendedBudgetItemsLoading ? (
                    <Skeleton className="w-200" />
                  ) : (
                    <Styles.FormattedCurrencyStyled
                      color="#888a94"
                      amount={
                        calculateBudgetPlannedBetweenDates(
                          extendedBudgetItems?.find((eb) => eb.budgetItemId === budgetItem.budgetItemId)
                            ?.budgetDailyItems,
                          start,
                          end,
                        ) || 0
                      }
                    />
                  )}
                  <EmptyTableSpacer />
                  <EmptyTableSpacer />
                  <BudgetItemTDM
                    editedBudgetItem={editedBudgetItem}
                    setEditedBudgetItem={setEditedBudgetItem}
                    budgetItem={budgetItem}
                    start={start}
                    end={end}
                    portfolioId={portfolioId}
                  />
                </GridRow>
              );
            })}
        </Collapse>
      </GridWrap>
    </WrapStyled>
  );
};

const TypographyFontStyled = css`
  font-size: 11px;
  color: #b7bac7;
  font-weight: 600;
`;

export const WrapStyled = styled.div<{
  extraColumn?: boolean;
}>`
  width: 100%;

  .NEXYCSSGrid {
    min-width: 100%;
    padding: 0 24px;
    grid-template-columns: 1fr 110px 1fr 1fr 1fr 1fr 1.4fr 0.3fr;
  }
`;
export const TypographyStyled = styled(Typography)`
  position: relative;
  ${TypographyFontStyled};
`;
export const TypographyStyledAligned = styled(Typography)`
  position: relative;
  text-align: right;
  padding-right: 20px;
  ${TypographyFontStyled}
`;

const EmptyTableSpacer = styled.div``;

const SpendProgressBarContainer = styled.div`
  width: 240px;
  @media (max-width: 1620px) {
    width: 180px;
  }
`;
