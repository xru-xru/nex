import { RouterHistory, withRouter } from 'react-router-dom';

import { NexoyaDashboardUrl } from 'types';

import { useTeamQuery } from 'graphql/team/queryTeam';

import usePresenterMode from 'hooks/usePresenterMode';

import CustomDashboard from '../components/CustomDashboard';
import OldDashboard from '../components/Dashboard/OldDashboard';
import Spinner from '../components/Spinner';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import MainContent from 'components/MainContent';
import ScrollToTop from 'components/ScrollToTop';

import { PATHS } from './paths';
import useUserStore from '../store/user';

type Props = {
  history: RouterHistory;
};

const Dashboard = ({ history }: Props) => {
  const { user } = useUserStore();
  const {
    data: teamData,
    error,
    loading,
  } = useTeamQuery({
    withMembers: true,
  });
  const { isPresenterMode } = usePresenterMode();

  if (isPresenterMode) {
    history.push(PATHS.APP.REPORTS);
  }
  const customDashboardUrls: NexoyaDashboardUrl[] = teamData?.team.dashboardUrls;
  const hasCustomDashboards = customDashboardUrls && !!customDashboardUrls.length;

  if (loading || !user) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <Spinner />;
      </div>
    );
  }

  return (
    <ScrollToTop>
      <MainContent className="sectionToPrint">
        {!loading && hasCustomDashboards ? <CustomDashboard data={customDashboardUrls} /> : <OldDashboard />}
      </MainContent>
      {error ? <ErrorMessage error={error} /> : null}
    </ScrollToTop>
  );
};

export default withRouter(Dashboard);
