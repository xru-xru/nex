import { CollectionProvider } from '../context/CollectionsProvider';
import { withReportsFilterProvider } from '../context/ReportsFilterProvider';

import ErrorBoundary from '../components/ErrorBoundary';
import HelpCenter from '../components/HelpCenter/HelpCenter';
import MainContent from '../components/MainContent';
import { PageHeader, PageHeaderActions, PageHeaderTitle } from '../components/PageHeader';
import Typography from '../components/Typography';
import ScrollToTop from 'components/ScrollToTop';

import { HELP_CENTER_URLS } from '../configs/helpCenterUrls';
import CreateReportButton from './reports/CreateReportButton';
import ReportsFilter from './reports/ReportsFilter';
import ReportsResults from './reports/ReportsResults';

function Reports() {
  return (
    <ScrollToTop>
      <CollectionProvider>
        <MainContent>
          <PageHeader>
            <PageHeaderTitle>
              <Typography variant="h1" component="h2">
                Reports
              </Typography>
              <HelpCenter url={HELP_CENTER_URLS.REPORT.HOW_TO_USE_REPORTS_SECTION} />
            </PageHeaderTitle>
            <PageHeaderActions>
              <CreateReportButton />
            </PageHeaderActions>
          </PageHeader>
          <ErrorBoundary>
            <ReportsFilter />
            <ReportsResults />
          </ErrorBoundary>
        </MainContent>
      </CollectionProvider>
    </ScrollToTop>
  );
}

export default withReportsFilterProvider(Reports);
