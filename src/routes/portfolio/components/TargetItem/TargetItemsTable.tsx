import React, { useState } from 'react';

import dayjs from 'dayjs';
import styled, { css } from 'styled-components';

import { NexoyaPortfolioTargetItem } from '../../../../types';

import { READABLE_FORMAT } from '../../../../utils/dates';

import GridHeader from '../../../../components/GridHeader';
import GridWrap from '../../../../components/GridWrap';
import * as Styles from '../../../../components/PerformanceTable/styles';
import { PortfolioTargetTypeSwitch } from '../../../../components/PortfolioTypeSwitch';
import GridRow from 'components/GridRow';
import Typography from 'components/Typography';

import { nexyColors } from '../../../../theme';
import { TargetItemTDM } from './TargetItemTDM';
import { renderTargetItemStatus } from './utils';

interface Props {
  portfolioId: number;
  targetItems: NexoyaPortfolioTargetItem[];
  selectedPeriodSpend: (targetItem: NexoyaPortfolioTargetItem) => number;
}

export const TargetItemsTable = ({ targetItems, portfolioId, selectedPeriodSpend }: Props) => {
  const [editedTargetItem, setEditedTargetItem] = useState<NexoyaPortfolioTargetItem>();

  const isNotInPast = (targetItem: NexoyaPortfolioTargetItem) => {
    const today = dayjs();
    return today.isAfter(dayjs(targetItem.start), 'day');
  };

  return (
    <WrapStyled>
      <GridWrap>
        <GridHeader style={{ justifyItems: 'start' }}>
          <TypographyStyled>
            <span>Target item</span>
          </TypographyStyled>
          <TypographyStyledAligned>
            <span>Status</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Timeframe</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Total Budget limit</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Selected period spend</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Daily target</span>
          </TypographyStyledAligned>
          <TypographyStyledAligned>
            <span>Latest achieved</span>
          </TypographyStyledAligned>
        </GridHeader>

        {[...(targetItems || [])]
          ?.sort((a, b) => new Date(b.end).getTime() - new Date(a.start).getTime())
          ?.map((targetItem) => {
            return (
              <GridRow style={{ justifyItems: 'start', padding: '12px 24px' }} key={targetItem.targetItemId}>
                <Styles.ContentRowStyled>
                  <Typography style={{ maxWidth: 160 }} withTooltip={targetItem.name.length > 20}>
                    {targetItem.name}
                  </Typography>
                </Styles.ContentRowStyled>
                <Styles.ContentRowStyled>{renderTargetItemStatus(targetItem.status)}</Styles.ContentRowStyled>

                <Styles.ContentRowStyled style={{ color: '#888a94' }}>
                  <Typography withTooltip>
                    {dayjs(targetItem.start).format(READABLE_FORMAT)} - {dayjs(targetItem.end).format(READABLE_FORMAT)}
                  </Typography>
                </Styles.ContentRowStyled>
                <Styles.FormattedCurrencyStyled color="#888a94" amount={targetItem.maxBudget || 0} />
                {isNotInPast(targetItem) ? (
                  <Styles.FormattedCurrencyStyled color="#888a94" amount={selectedPeriodSpend(targetItem) || 0} />
                ) : (
                  <Typography style={{ color: nexyColors.coolGray, opacity: 0.5 }}>Pending</Typography>
                )}

                <PortfolioTargetTypeSwitch
                  renderForROASType={() => (
                    <Styles.NumberValueStyled color="#888a94" value={targetItem.value || 0} symbol="%" />
                  )}
                  renderForCPAType={() => (
                    <Styles.FormattedCurrencyStyled color="#888a94" amount={targetItem.value || 0} />
                  )}
                />
                <Styles.ContentRowStyled>
                  {isNotInPast(targetItem) ? (
                    <PortfolioTargetTypeSwitch
                      renderForROASType={() => (
                        <Styles.NumberValueStyled color="#888a94" value={targetItem.achieved || 0} symbol="%" />
                      )}
                      renderForCPAType={() => (
                        <Styles.FormattedCurrencyStyled color="#888a94" amount={targetItem?.achieved || 0} />
                      )}
                    />
                  ) : (
                    <Typography style={{ color: nexyColors.coolGray, opacity: 0.5 }}>Pending</Typography>
                  )}
                </Styles.ContentRowStyled>

                <TargetItemTDM
                  targetItem={targetItem}
                  editedTargetItem={editedTargetItem}
                  setEditedTargetItem={setEditedTargetItem}
                  portfolioId={portfolioId}
                />
              </GridRow>
            );
          })}
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
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.2fr;
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
