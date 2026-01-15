import React from 'react';

import dayjs from 'dayjs';
import { get } from 'lodash';
import styled from 'styled-components';
import { ArrayParam, DateParam, useQueryParams } from 'use-query-params';

import { useSelectedKpisQuery } from '../graphql/kpi/querySelectedKpis';
import { useSelectedKpisQuery as useSelectedKpisQuery1 } from '../graphql/kpi/querySelectedKpis';

import {
  distanceRange,
  /* djsAnchors, format, isSame */
} from '../utils/dates';
import { decodeKpisQuery } from '../utils/kpi';

import AvatarProvider from '../components/AvatarProvider';
import Button from '../components/Button';
import ButtonAdornment from '../components/ButtonAdornment';
import KPIsCompareDatesChart from '../components/Charts/KPIsCompareDatesChart';
import { DateSelector } from '../components/DateSelector';
import Menu, { useDropdownMenu } from '../components/DropdownMenu';
import ErrorMessage from '../components/ErrorMessage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import MenuItem from '../components/MenuItem';
import PageHeaderIcon from '../components/PageHeader/PageHeaderIcon';
import PageHeaderTitle from '../components/PageHeader/PageHeaderTitle';
import Typography from '../components/Typography';
import TypographyTranslation from '../components/TypographyTranslation';
import SvgBalanceScaleRegular from '../components/icons/BalanceScaleRegular';
import SvgCaretDown from '../components/icons/CaretDown';

import { colorByKey } from '../theme/utils';

import { AvatarLoader, HeaderStyled, LoadingStyled, LoadingWrapStyled, SubtitleLoader, TitleLoader } from './KPI';

const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: ${colorByKey('paleGrey50')};
  padding: 24px;
  margin-bottom: 32px;
  .NEXYDatepickerCompare {
    &.NEXYButton {
      color: ${colorByKey('greenTeal')};
    }
  }
  .NEXYButtonCompared {
    color: ${colorByKey('purpleishBlue')};
    padding: 12px 16px;
    .NEXYButtonAdornment.start,
    .NEXYButtonLabel {
      margin-right: 16px;
    }
    .NEXYButtonAdornment.end {
      margin-left: auto;
    }

    &:active,
    &.active {
      box-shadow: 0 0 0 2px ${colorByKey('purpleishBlue')};
    }
  }
`;
const SpanStyled = styled.span`
  display: block-inline;
  margin: 0 24px 0 24px;
  color: ${colorByKey('blueGrey')};
`;
type Props = {
  skipQuery: boolean;
};
type State = {
  dateFrom: Date;
  dateTo: Date;
};
const COMPARE_PERIODS = {
  LAST_PERIOD: 'LAST_PERIOD',
  PREV_3_MONTHS: 'PREV_3_MONTHS',
  PREV_6_MONTHS: 'PREV_6_MONTHS',
  PREV_YEAR: 'PREV_YEAR',
};

function formatResponse(df, dt) {
  return {
    dateFrom: df.toDate(),
    dateFromFormatted: df.format('D MMM YYYY'),
    dateTo: dt.toDate(),
    dateToFormatted: dt.format('D MMM YYYY'),
  };
}

function getLastPeriod(from, to, periodLength) {
  const df = dayjs(from)
    .subtract(periodLength + 1, 'day')
    .startOf('day');
  const dt = dayjs(to)
    .subtract(periodLength + 1, 'day')
    .endOf('day');
  return formatResponse(df, dt);
}

function getPrev3Months(from, to) {
  const df = dayjs(from).subtract(3, 'month').startOf('day');
  const dt = dayjs(to).subtract(3, 'month').endOf('day');
  return formatResponse(df, dt);
}

function getPrev6Months(from, to) {
  const df = dayjs(from).subtract(6, 'month').startOf('day');
  const dt = dayjs(to).subtract(6, 'month').endOf('day');
  return formatResponse(df, dt);
}

function getPrevYear(from, to) {
  const df = dayjs(from).subtract(1, 'year').startOf('day');
  const dt = dayjs(to).subtract(1, 'year').endOf('day');
  return formatResponse(df, dt);
}

function KPIsCompareDates({ skipQuery }: Props) {
  // Menu date stuff
  const { anchorEl, open, toggleMenu, closeMenu } = useDropdownMenu();
  // Query params date stuff
  const [queryParams, setQueryParams] = useQueryParams({
    kpi: ArrayParam,
    dateFromCompare: DateParam,
    dateToCompare: DateParam,
  });
  // Internal date stuff
  const { dateFrom: dateFromDR, dateTo: dateToDR } = distanceRange({
    distance: 7,
    startOf: 'day',
    endOf: false,
  });
  const [dates, setDates] = React.useState<State>({
    dateFrom: queryParams.dateFromCompare || dateFromDR,
    dateTo: queryParams.dateToCompare || dateToDR,
  });

  function handleDateChange({ from, to }) {
    setDates((s) => ({ ...s, dateFrom: from, dateTo: to }));
    setQueryParams({
      dateFromCompare: from,
      dateToCompare: to,
    });
  }

  const RANGE_LENGTH = dayjs(queryParams.dateToCompare).diff(dayjs(queryParams.dateFromCompare), 'day');
  const [comparePeriod, setComparePeriod] = React.useState(COMPARE_PERIODS.LAST_PERIOD);
  const datesLastPeriod = React.useMemo(
    () => getLastPeriod(dates.dateFrom, dates.dateTo, RANGE_LENGTH),
    [dates, RANGE_LENGTH]
  );
  const datesLast3Months = React.useMemo(() => getPrev3Months(dates.dateFrom, dates.dateTo), [dates]);
  const datesLast6Months = React.useMemo(() => getPrev6Months(dates.dateFrom, dates.dateTo), [dates]);
  const datesLastYear = React.useMemo(() => getPrevYear(dates.dateFrom, dates.dateTo), [dates]);

  function getPrevRange() {
    switch (comparePeriod) {
      case COMPARE_PERIODS.LAST_PERIOD:
        return datesLastPeriod;

      case COMPARE_PERIODS.PREV_3_MONTHS:
        return datesLast3Months;

      case COMPARE_PERIODS.PREV_6_MONTHS:
        return datesLast6Months;

      case COMPARE_PERIODS.PREV_YEAR:
        return datesLastYear;

      default:
        return {
          dateFrom: null,
          dateTo: null,
        };
    }
  }

  // query stuff - there are two queries because we need to fetch same data from same query
  // only the date ranges are different
  const selectedKpisQuery = queryParams.kpi || [];
  const kpisInput = decodeKpisQuery(selectedKpisQuery);
  const skip = get(selectedKpisQuery, 'length', 0) === 0 || skipQuery;
  // get data for initial date range of kpi
  const { data, error, loading } = useSelectedKpisQuery({
    skip,
    kpis: kpisInput,
    dateFrom: dates.dateFrom,
    dateTo: dates.dateTo,
  });
  // get data for compared date range of kpi
  const {
    data: data1, // error: error1,
    // loading: loading1,
  } = useSelectedKpisQuery1({
    skip,
    kpis: kpisInput,
    dateFrom: getPrevRange().dateFrom,
    dateTo: getPrevRange().dateTo,
  });
  const kpis0 = get(data, 'kpis', []);
  const kpi0 = get(kpis0, '[0]', {});
  const kpi0data = get(kpi0, 'detail.data', []);
  const kpis1 = get(data1, 'kpis', []);
  const kpi1 = get(kpis1, '[0]', {});
  const kpi1data = get(kpi1, 'detail.data', []);
  const chartData = React.useMemo(
    () =>
      kpi0data.map((item, index) => {
        // TODO: REMOVE Math.floor
        return {
          initialDate: item.timestamp,
          initialValue: item.value || 0,
          compareDate: get(kpi1data, `[${index}].timestamp`, null),
          compareValue: get(kpi1data, `[${index}].value`, 0) || 0,
        };
      }),
    [kpi0data, kpi1data]
  );

  function getLabel(compPer) {
    switch (compPer) {
      case COMPARE_PERIODS.LAST_PERIOD:
        return `Previous period - ${datesLastPeriod.dateFromFormatted} - ${datesLastPeriod.dateToFormatted}`;

      case COMPARE_PERIODS.PREV_3_MONTHS:
        return `3 months before - ${datesLast3Months.dateFromFormatted} - ${datesLast3Months.dateToFormatted}`;

      case COMPARE_PERIODS.PREV_6_MONTHS:
        return `6 months before - ${datesLast6Months.dateFromFormatted} - ${datesLast6Months.dateToFormatted}`;

      case COMPARE_PERIODS.PREV_YEAR:
        return `Year before - ${datesLastYear.dateFromFormatted} - ${datesLastYear.dateToFormatted}`;

      default:
        return '';
    }
  }

  return (
    <>
      {loading ? (
        <LoadingWrapStyled>
          <HeaderStyled>
            <LoadingStyled>
              <AvatarLoader />
              <div>
                <TitleLoader />
                <SubtitleLoader />
              </div>
            </LoadingStyled>
          </HeaderStyled>
          <div className="section">
            <LoadingPlaceholder />
          </div>
          <div className="section">
            <LoadingPlaceholder />
          </div>
        </LoadingWrapStyled>
      ) : (
        <>
          <PageHeaderTitle
            style={{
              marginLeft: 24,
              marginBottom: '24',
            }}
          >
            <Typography variant="h2" data-cy="compareDatesPanelTitle">
              Compare dates for
            </Typography>
            <PageHeaderIcon>
              <AvatarProvider
                providerId={kpi0.provider_id}
                size={32}
                style={{
                  marginLeft: 12,
                }}
              />
            </PageHeaderIcon>
            <TypographyTranslation
              variant="h2"
              text={kpi0.name}
              style={{
                marginRight: 12,
              }}
            />
          </PageHeaderTitle>
          <WrapStyled>
            <DateSelector
              dateFrom={dates.dateFrom}
              dateTo={dates.dateTo}
              hideFutureQuickSelection
              className="NEXYDatepickerCompare"
              onDateChange={handleDateChange}
              panelProps={{
                side: 'bottom',
                align: 'start',
              }}
            />

            <SpanStyled>vs</SpanStyled>
            <Button
              id="previousPeriodPicker"
              variant="contained"
              color="secondary"
              onClick={toggleMenu}
              active={open}
              flat={true}
              className="NEXYButtonCompared" //disabled={loading}
              startAdornment={
                <ButtonAdornment position="start">
                  <SvgBalanceScaleRegular />
                </ButtonAdornment>
              }
              endAdornment={
                <ButtonAdornment position="end">
                  <SvgCaretDown
                    style={{
                      transform: `rotate(${open ? '180' : '0'}deg)`,
                    }}
                  />
                </ButtonAdornment>
              }
              ref={anchorEl}
            >
              {getLabel(comparePeriod)}
            </Button>
            <Menu
              anchorEl={anchorEl.current}
              open={open}
              onClose={closeMenu}
              placement="bottom-start"
              color="dark"
              popperProps={{
                style: {
                  zIndex: 1301,
                },
              }}
            >
              <MenuItem
                data-cy="previous-period"
                key="previous-period"
                style={{
                  minWidth: 125,
                }}
                onClick={() => {
                  setComparePeriod(COMPARE_PERIODS.LAST_PERIOD);
                  closeMenu();
                }}
              >
                {getLabel(COMPARE_PERIODS.LAST_PERIOD)}
              </MenuItem>
              <MenuItem
                data-cy="3-months"
                key="3-months"
                style={{
                  minWidth: 125,
                }}
                onClick={() => {
                  setComparePeriod(COMPARE_PERIODS.PREV_3_MONTHS);
                  closeMenu();
                }}
              >
                {getLabel(COMPARE_PERIODS.PREV_3_MONTHS)}
              </MenuItem>
              <MenuItem
                data-cy="6-months"
                key="6-months"
                style={{
                  minWidth: 125,
                }}
                onClick={() => {
                  setComparePeriod(COMPARE_PERIODS.PREV_6_MONTHS);
                  closeMenu();
                }}
              >
                {getLabel(COMPARE_PERIODS.PREV_6_MONTHS)}
              </MenuItem>
              <MenuItem
                data-cy="1-year"
                key="1-year"
                style={{
                  minWidth: 125,
                }}
                onClick={() => {
                  setComparePeriod(COMPARE_PERIODS.PREV_YEAR);
                  closeMenu();
                }}
              >
                {getLabel(COMPARE_PERIODS.PREV_YEAR)}
              </MenuItem>
            </Menu>
          </WrapStyled>
          <KPIsCompareDatesChart
            data={chartData}
            style={{
              margin: '0 24px',
            }}
          />
        </>
      )}
      {error && <ErrorMessage error={error} />}
    </>
  );
}

export default KPIsCompareDates;
