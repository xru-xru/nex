import React from 'react';
import { Link } from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';

import { get } from 'lodash';
import styled from 'styled-components';
import { DateParam } from 'use-query-params';

import { NexoyaMeasurement, NexoyaMeasurementDetail } from '../../types/types';

import useCustomTheme from '../../hooks/useCustomTheme';
import useTeamColor from '../../hooks/useTeamColor';
import { buildKpiKey } from '../../utils/buildReactKeys';
import isCurrencyDatatype from '../../utils/isCurrencyDatatype';

import { buildKpiPath } from '../../routes/paths';

import theme from '../../theme/theme';
import { colorByKey } from '../../theme/utils';

import ButtonLoadMore from '../ButtonLoadMore/ButtonLoadMore';
import ErrorBoundary from '../ErrorBoundary';
import FormattedCurrency from '../FormattedCurrency';
import KpiChip from '../KpiReportChip';
import LoadingPlaceholder from '../LoadingPlaceholder/LoadingPlaceholder';
import NumberValue from '../NumberValue';
import KpiReportTableCell from './KpiReportTableCell';

type Props = {
  kpis: NexoyaMeasurement[];
  from: Date;
  to: Date;
  handleLoadMore?: () => void;
  showLoadMore?: boolean;
  showTotals?: boolean;
  isLoading?: boolean;
  showCollection?: boolean;
  showCollectionType?: boolean;
  showLegend?: boolean;
};
const LoadingWrapStyled = styled.div`
  & > div {
    height: 52px;
    margin-bottom: 12px;

    &:nth-child(1) {
      opacity: 1;
    }
    &:nth-child(2) {
      opacity: 0.75;
    }
    &:nth-child(3) {
      opacity: 0.5;
    }
    &:nth-child(4) {
      opacity: 0.25;
    }
  }
`;
const TitleStyled = styled.span`
  height: 59px;
  display: block;
  padding: 22px 5px;
  border-bottom: 1px solid #eee;
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  color: #949394;
`;
const OuterTableWrapStyled = styled.div`
  margin-bottom: 50px;

  td {
    position: relative;
    height: 50px;
    padding: 8px 24px;
  }

  td:hover::after {
    content: '';
    position: absolute;
    background-color: ${colorByKey('ghostWhite')};
    left: 0;
    top: -5000px;
    height: 10000px;
    width: 100%;
    z-index: ${theme.layers.base};
  }

  td,
  tr {
    min-width: 120px;
  }
`;
interface LinkStyledKpiReportTableProps {
  isLast: boolean;
}
const LinkStyled = styled.div<LinkStyledKpiReportTableProps>`
  padding: 4px 10px;
  //display: inline-flex;
  flex-direction: column;
  width: 100%;
  transition: color 0.1s;
  height: 59px;
  display: flex;
  border-bottom: ${({ isLast }) => (isLast ? 'none' : '1px solid #eee')};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const TotalColumnStyled = styled.div`
  box-shadow: 5px 0 10px -5px #ccc;
  z-index: ${theme.layers.body};
  div:last-child {
    border-bottom: none;
  }
`;
const TotalColumnItemStyled = styled.div`
  border-bottom: 1px solid #eee;
  padding: 0 15px;
  height: 59px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  min-width: 120px;
`;

// NOTE:
// This is a copy of table from src/routes/report/reportKpi/ReportData.js
// But reworked so it just accepts kpis and displays details
function KpiReportTable({
  kpis,
  from,
  to,
  handleLoadMore,
  showLoadMore = false,
  isLoading = false,
  showTotals = false,
  showCollection = false,
  showCollectionType = false,
  showLegend = false,
}: Props) {
  const { hasTheme, customTheme } = useCustomTheme();
  const getTeamColor = useTeamColor();
  const itemData = React.useMemo(
    () => ({
      kpisForTable: [...[kpis[0]], ...kpis],
      showTotals,
    }),
    [kpis, showTotals]
  );

  if (isLoading) {
    return (
      <LoadingWrapStyled>
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </LoadingWrapStyled>
    );
  }

  function getLineColor(index) {
    return showLegend ? getTeamColor(index) : null;
  }

  function getCustomColors() {
    // TODO this needs to be abstracted
    return hasTheme
      ? {
          success: customTheme.colors[6],
          danger: customTheme.colors[2],
          default: customTheme.colors[3],
        }
      : null;
  }

  return (
    <OuterTableWrapStyled>
      <ErrorBoundary>
        <div
          style={{
            display: 'flex',
            overflowY: 'hidden',
          }}
        >
          <div
            style={{
              maxWidth: 550,
            }}
          >
            <TitleStyled
              style={{
                textAlign: 'left',
                paddingLeft: 20,
              }}
            >
              Metric
            </TitleStyled>
            <div>
              {kpis.map((k, index) => (
                <LinkStyled key={buildKpiKey(k, 'chip-table')} isLast={index === kpis.length - 1}>
                  {k.collection ? (
                    <Link
                      to={buildKpiPath(k, {
                        dateFrom: from && DateParam.encode(new Date(from)),
                        dateTo: to && DateParam.encode(new Date(to)),
                      })}
                      data-cy="metricNameLink"
                    >
                      <KpiChip
                        kpi={k}
                        withCollection={showCollection}
                        withCollectionType={showCollectionType}
                        color={getLineColor(index)}
                      />
                    </Link>
                  ) : (
                    <KpiChip
                      kpi={k}
                      withCollection={showCollection}
                      withCollectionType={showCollectionType}
                      color={getLineColor(index)}
                    />
                  )}
                </LinkStyled>
              ))}
            </div>
          </div>
          <TotalColumnStyled>
            <TitleStyled
              style={{
                textAlign: 'right',
                paddingRight: 15,
              }}
            >
              Total
            </TitleStyled>
            {kpis.map((k, index) => {
              const kpiDetail: NexoyaMeasurementDetail = get(k, 'detail', {});
              const valueChangePercentage = get(kpiDetail, 'valueChangePercentage', 0) || 0;
              return (
                <TotalColumnItemStyled key={`${index}${kpiDetail.valueSum}`}>
                  {isCurrencyDatatype(k.datatype) ? (
                    <FormattedCurrency amount={showTotals ? kpiDetail.valueSumUptoEndDate : kpiDetail.value} />
                  ) : (
                    <NumberValue
                      value={showTotals ? kpiDetail.valueSumUptoEndDate : kpiDetail.value}
                      datatype={k.datatype}
                      arrowWithColor
                    />
                  )}
                  {!showTotals && (
                    <NumberValue
                      value={valueChangePercentage}
                      datatype={{
                        suffix: true,
                        symbol: '%',
                      }}
                      customColors={getCustomColors()}
                      textWithColor
                      showChangePrefix
                      variant={
                        valueChangePercentage > 0
                          ? 'positive'
                          : kpiDetail.valueChangePercentage === 0
                          ? 'default'
                          : 'negative'
                      }
                    />
                  )}
                </TotalColumnItemStyled>
              );
            })}
          </TotalColumnStyled>
          <div
            style={{
              width: 'calc(100% - 490px)',
            }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <Grid
                  columnCount={get(itemData, 'kpisForTable.[0].detail.data.length', 0)}
                  columnWidth={120}
                  height={height}
                  rowCount={itemData.kpisForTable.length}
                  rowHeight={59}
                  width={width}
                  itemData={itemData}
                >
                  {KpiReportTableCell}
                </Grid>
              )}
            </AutoSizer>
          </div>
        </div>
        {showLoadMore ? (
          <ButtonLoadMore
            isLoading={isLoading}
            onClick={() => {
              if (handleLoadMore) handleLoadMore();
            }}
          />
        ) : null}
      </ErrorBoundary>
    </OuterTableWrapStyled>
  );
}

export default KpiReportTable;
