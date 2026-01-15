import { get } from 'lodash';

import { ReportType } from '../../../types/types.custom';

import { useReportNew } from '../../../context/ReportNewProvider';

import { format } from '../../../utils/dates';
import { getUIDateRange } from '../../../utils/report';

import Divider from '../../../components/Divider';
import { HeaderBrick, HeaderBrickWrap } from '../../../components/HeaderBrick';
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '../../../components/PageHeader';
import Typography from '../../../components/Typography';
import SvgDuration from '../../../components/icons/Duration';

import ChannelList from './ChannelList';
import KpiList from './KpiList';

function ReportReview() {
  const { formMeta, type, kpisDateRange } = useReportNew();
  const dateRange = getUIDateRange(kpisDateRange.dateRange);

  const displayDate = {
    start_date: get(dateRange, 'range.dateFrom', ''),
    end_date: get(dateRange, 'range.dateTo', ''),
  };

  function overviewTitle(type: ReportType): string {
    const mappedOverviewTitle = {
      KPI: 'Metrics included',
      CHANNEL: 'Selected Channels',
    };
    return mappedOverviewTitle[type];
  }

  return (
    <div>
      <PageHeader>
        <div>
          <PageHeaderTitle>
            <Typography variant="h1" component="h2">
              {formMeta.values.name}
            </Typography>
          </PageHeaderTitle>
          <PageHeaderDescription addTitleIconSpace={false}>
            <Typography variant="subtitle">{formMeta.values.description || 'No report description'}</Typography>
          </PageHeaderDescription>
        </div>
      </PageHeader>
      <HeaderBrickWrap>
        <HeaderBrick
          data-cy="funnelReviewDateRange"
          icon={
            <SvgDuration
              style={{
                fontSize: '32',
              }}
            />
          }
          label="Date range"
          content={`${format(displayDate.start_date, 'DD MMM YYYY')} - ${format(displayDate.end_date, 'DD MMM YYYY')}`}
        />
      </HeaderBrickWrap>
      <Divider />
      <Typography variant="h2">{type.value && `${overviewTitle(type.value)}`}</Typography>
      {type.value === 'KPI' ? <KpiList /> : <ChannelList />}
    </div>
  );
}

export default ReportReview;
