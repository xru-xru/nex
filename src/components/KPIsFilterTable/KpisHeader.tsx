import { HELP_CENTER_URLS } from 'configs/helpCenterUrls';

import { useGlobalDate, withDateProvider } from 'context/DateProvider';

import InputSearchFilter from './components/InputSearchFilter';
import CreateCustomKpi from 'components/CustomKpi/CreateCustomKpi';
import { DateSelector } from 'components/DateSelector';
import HelpCenter from 'components/HelpCenter/HelpCenter';
import { PageHeader, PageHeaderActions, PageHeaderTitle } from 'components/PageHeader';
import Typography from 'components/Typography';

type Props = {
  saveToParams?: boolean;
  showCreateCustomKpi?: boolean;
};

const KpisFilterHeader = ({ saveToParams, showCreateCustomKpi }: Props) => {
  const { from, to, setDateRangeChange } = useGlobalDate();
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>
          <Typography variant="h1" component="h2">
            Metrics
          </Typography>
          <HelpCenter url={HELP_CENTER_URLS.METRIC.HOW_TO_USE_METRICS} />
        </PageHeaderTitle>
        <PageHeaderActions>
          <DateSelector dateFrom={from} dateTo={to} onDateChange={setDateRangeChange} hideFutureQuickSelection />
          {showCreateCustomKpi && <CreateCustomKpi />}
        </PageHeaderActions>
      </PageHeader>
      <div>
        <InputSearchFilter saveToParams={saveToParams} />
      </div>
    </>
  );
};

export default withDateProvider(KpisFilterHeader);
