import React from 'react';

import styled from 'styled-components';

import { NexoyaReport } from '../../types/types';

import { KpisFilterProvider2 } from '../../context/KpisFilterProvider';

import { format } from '../../utils/dates';
import { getUIDateRange } from '../../utils/report';
import { userInitials, userName } from '../../utils/user';

import Avatar from '../../components/Avatar';
import AvatarUser from '../../components/AvatarUser';
import Divider from '../../components/Divider/Divider';
import { HeaderBrick, HeaderBrickWrap } from '../../components/HeaderBrick';
import LoadingPlaceholder from '../../components/LoadingPlaceholder';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderIcon,
  PageHeaderTitle,
} from '../../components/PageHeader';
import Share from '../../components/Share';
import Typography from '../../components/Typography';
import SvgDuration from '../../components/icons/Duration';
import SvgKpi from '../../components/icons/Kpi';

import DownloadButton from './reportKpi/DownloadButton';
import KpisPicker from './reportKpi/KpisPicker';
import ReportData from './reportKpi/ReportData';
import EditReportDetails from './shared/EditReportDetails';
import ReportOptions from './shared/ReportOptions';
import { checkAndConvertDates } from './utils';

type Props = {
  report: NexoyaReport;
  refetching: boolean;
  refetch: (...args: any) => any;
};
const WrapLoadingStyled = styled.div`
  & > div:first-child {
    margin-bottom: 25px;

    div {
      height: 50px;
      width: 75%;
    }
  }

  & > div:last-child {
    & > div:nth-child(1) {
      height: 50px;
      width: 25%;
      opacity: 0.75;
      margin-bottom: 25px;
    }

    & > div:nth-child(2) {
      opacity: 0.35;
      height: 400px;
      margin-bottom: 25px;
    }

    & > div:nth-child(3) {
      opacity: 0.2;
      height: 50px;
    }
  }
`;

function ReportKpi({ report, refetching, refetch }: Props) {
  const [miniRoute, setMiniRoute] = React.useState('report');
  // TODO: We need to have a nice unified way. This needs to be refactored
  const UIDateRange = getUIDateRange(report.dateRange);
  const dateRange = checkAndConvertDates(report.dateRange);
  return (
    <div>
      <EditReportDetails
        isOpen={miniRoute === 'editReport'}
        onClose={() => setMiniRoute('report')}
        reportId={report.report_id}
        name={report.name}
        description={report.description || ''}
        refetch={refetch}
        dateRange={dateRange}
      />
      <PageHeader>
        <div>
          <PageHeaderTitle>
            <PageHeaderIcon>
              <Avatar size={32}>
                <SvgKpi />
              </Avatar>
            </PageHeaderIcon>
            <Typography variant="h1" component="h2" data-cy="reportName">
              {report.name}
            </Typography>
          </PageHeaderTitle>
          <PageHeaderDescription addTitleIconSpace>
            <Typography variant="subtitle" withEllipsis={false} data-cy="reportDescription">
              {report.description || 'No report description'}
            </Typography>
          </PageHeaderDescription>
        </div>
        <PageHeaderActions>
          <DownloadButton
            report={report}
            disabled={refetching || report.kpis.length === 0 || miniRoute === 'editKpis'}
          />
          <Share type="report" itemId={report.report_id} />
          <ReportOptions
            reportName={report.name}
            reportId={report.report_id}
            onEdit={() => setMiniRoute('editReport')}
          />
        </PageHeaderActions>
      </PageHeader>
      <HeaderBrickWrap withTitleIconSpace>
        <HeaderBrick
          data-cy="reportDateRange"
          icon={
            <SvgDuration
              style={{
                fontSize: 32,
              }}
            />
          }
          label="Date range"
          content={`${format(UIDateRange.range.dateFrom, 'DD MMM YYYY')} - ${format(
            UIDateRange.range.dateTo,
            'DD MMM YYYY'
          )}`}
        />
        <HeaderBrick
          data-cy="reportUpdatedBy"
          icon={<AvatarUser email={report?.updatedBy?.email} fallback={userInitials(report?.updatedBy)} size={32} />}
          label="Updated by"
          content={userName(report.updatedBy, {
            abbreviate: true,
          })}
        />
      </HeaderBrickWrap>
      <Divider />
      {miniRoute === 'editKpis' ? (
        <KpisFilterProvider2>
          <KpisPicker
            reportId={report.report_id}
            dateFrom={UIDateRange.range.dateFrom}
            dateTo={UIDateRange.range.dateTo}
            selectedKpis={report.kpis}
            onClose={() => setMiniRoute('report')}
            refetchQuery={refetch}
          />
        </KpisFilterProvider2>
      ) : miniRoute === 'report' ? (
        refetching ? (
          <WrapLoadingStyled>
            <div>
              <LoadingPlaceholder />
              <LoadingPlaceholder
                style={{
                  width: '100%',
                }}
              />
              <LoadingPlaceholder
                style={{
                  width: '100%',
                }}
              />
            </div>
          </WrapLoadingStyled>
        ) : (
          <ReportData dateRange={UIDateRange} kpis={report.kpis} onSelectKpis={() => setMiniRoute('editKpis')} />
        )
      ) : null}
    </div>
  );
}

export default ReportKpi;
