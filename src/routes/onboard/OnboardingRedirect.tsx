import { Redirect, useLocation } from 'react-router';

import { useTeamQuery } from '../../graphql/team/queryTeam';
import { useUserQuery } from '../../graphql/user/queryUser';

import { userState } from '../../constants/userState';

import Dashboard from '../Dashboard';
import { PATHS } from '../paths';
import useUserStore from '../../store/user';

export const OnboardingRedirect = () => {
  const location = useLocation();
  const { data: userData, loading: userLoading } = useUserQuery({ fetchPolicy: 'network-only' });
  const { data: teamData, loading } = useTeamQuery({
    withMembers: false,
    withOrg: false,
  });

  const { isSupportUser } = useUserStore();
  const isOnboarding = teamData?.team?.onboarding?.onboardingTasks?.length;
  const hasCustomDashboardLinks = teamData?.team?.dashboardUrls?.length;

  if (!loading && !userLoading) {
    if (userData?.user?.state === userState.ONBOARDING) {
      return <Redirect to={PATHS.WIZARD.ONBOARD} />;
    }
    if (isOnboarding && !isSupportUser) {
      return <Redirect to={PATHS.APP.ONBOARD_GUIDE} />;
    }
    if (!hasCustomDashboardLinks) {
      return <Redirect to={PATHS.APP.PORTFOLIOS} />;
    }
    if (location.pathname === PATHS.AUTH.SIGN_UP && hasCustomDashboardLinks) {
      return <Redirect to={PATHS.APP.HOME} />;
    }
  }

  return <Dashboard />;
};
