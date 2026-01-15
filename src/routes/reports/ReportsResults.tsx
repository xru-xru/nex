import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaSortField } from '../../types/types';

import { useReportsFilter } from '../../context/ReportsFilterProvider';
import { useReportsQuery } from '../../graphql/report/queryReports';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import { formatDate } from '../../utils/formater';
import { translateType } from '../../utils/report';

import AvatarReport from '../../components/AvatarReport/AvatarReport';
import ButtonBase from '../../components/ButtonBase';
import CSSGrid from '../../components/CSSGrid';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import GridHeader from '../../components/GridHeader';
import GridNameLink from '../../components/GridNameLink';
import GridUser from '../../components/GridUser';
import LoadingPlaceholder from '../../components/LoadingPlaceholder';
import Text from '../../components/Text';
import Typography from '../../components/Typography';
import SvgSort from '../../components/icons/Sort';
import NoResults from './components/NoResults';

import { colorByKey } from '../../theme/utils';

import { buildReportPath } from '../paths';

const LoadingWrapStyled = styled.div`
  padding-top: 8px;

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
const WrapStyled = styled.div`
  overflow-x: auto;
  padding-bottom: 25px;

  .NEXYGridHeader {
    color: ${colorByKey('cloudyBlue80')};
    font-size: 12px;
    letter-spacing: 0.6px;
  }

  .NEXYCSSGrid {
    min-width: 100%;
    grid-template-columns:
      minmax(230px, 1.3fr) minmax(180px, 1fr) minmax(150px, 1fr)
      minmax(150px, 1fr);
    padding: 16px;
  }

  .reportTitle {
    color: ${colorByKey('darkGrey')};
  }
`;
const RowGridStyled = styled(CSSGrid)`
  align-items: center;
  min-height: 54px;
  color: ${colorByKey('blueGrey')};
  font-weight: normal;
  border-bottom: 1px solid ${colorByKey('paleGrey')};
`;
const TypeWrapStyled = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;

  .NEXYAvatarReport {
    margin-right: 8px;
  }
`;
const ButtonSortStyled = styled(ButtonBase)`
  padding: 4px;
  text-transform: inherit;
  font: inherit;
  color: inherit;
  letter-spacing: inherit;
  justify-self: center;

  svg {
    font-size: 8px;
    margin-left: 6px;
  }

  .top {
    color: ${(props) => (props.asc ? '#A6A8AD' : '#D2D3D6')};
  }
  .bottom {
    color: ${(props) => (props.desc ? '#A6A8AD' : '#D2D3D6')};
  }
`;

function ReportsResults() {
  const reportsFilter = useReportsFilter();
  const search = reportsFilter.search;
  const order = reportsFilter.order;
  const { data, loading, error } = useReportsQuery({
    sortBy: {
      field: NexoyaSortField.Name,
      order: order.value,
    },
    where: {
      search: search.value,
    },
  });
  const reports = get(data, 'reports', []);
  return (
    <WrapStyled>
      <GridHeader>
        {/*<Text>Report name</Text>*/}
        <ButtonSortStyled
          style={{
            justifySelf: 'start',
          }}
          asc={order === 'ASC'}
          desc={order === 'DESC'}
          onClick={() => order.setOrder(order.value === 'ASC' ? 'DESC' : 'ASC')}
        >
          Report name <SvgSort />
        </ButtonSortStyled>
        <Text>Report type</Text>
        <Text>Last updated</Text>
        <Text>Last updated by</Text>
      </GridHeader>
      {loading ? (
        <LoadingWrapStyled>
          <LoadingPlaceholder />
          <LoadingPlaceholder />
          <LoadingPlaceholder />
          <LoadingPlaceholder />
        </LoadingWrapStyled>
      ) : (
        <>
          {reports.length === 0 ? (
            <NoResults />
          ) : (
            <>
              {reports.map((report) => {
                const ReportRowComponent = (
                  <RowGridStyled key={report.report_id} data-cy="reportResultRow">
                    <GridNameLink
                      to={buildReportPath(report.report_id)}
                      onClick={() =>
                        track(EVENT.ROUTE_REPORT, {
                          reportId: report.report_id,
                        })
                      }
                    >
                      <Typography withTooltip className="reportTitle">
                        {report.name === '' ? 'No name' : report.name}
                      </Typography>
                    </GridNameLink>
                    <TypeWrapStyled>
                      <AvatarReport size={32} type={report.report_type} />
                      <Typography>{translateType(report.report_type)}</Typography>
                    </TypeWrapStyled>
                    <div>{formatDate(report.updated_at, 'ch-DE')}</div>
                    <GridUser user={report.updatedBy} />
                  </RowGridStyled>
                );

                return ReportRowComponent;
              })}
            </>
          )}
        </>
      )}
      {error ? <ErrorMessage error={error} /> : null}
    </WrapStyled>
  );
}

export default ReportsResults;
