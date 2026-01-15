import { HELP_CENTER_URLS } from 'configs/helpCenterUrls';
import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaUser } from 'types';

import { useTeamQuery } from 'graphql/team/queryTeam';
import { userInitials } from 'utils/user';

import AvatarRow from 'components/AvatarRow';
import AvatarUser from 'components/AvatarUser';
import Button from 'components/Button';
import ButtonAdornment from 'components/ButtonAdornment';
import DashboardTips from 'components/DashboardTips';
import HelpCenter from 'components/HelpCenter/HelpCenter';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from 'components/PageHeader';
import Text from 'components/Text';
import Typography from 'components/Typography';
import SvgPlusRegular from 'components/icons/PlusRegular';
import DashboardKpis from 'routes/dashboard0/DashboardKpis';
import DashboardPortfolios2 from 'routes/dashboard0/DashboardPortfolios';
import MembersCount from 'routes/dashboard0/MembersCount';
import { PATHS } from 'routes/paths';

import { colorByKey } from 'theme/utils';
import useUserStore from '../../store/user';

const LoadingWrapStyled = styled.div`
  & > div:nth-child(2) {
    height: 24px;
    opacity: 0.2;
  }
`;
const AvatarsLoadingStyled = styled.div`
  display: flex;
  margin-bottom: 18px;

  & > * {
    border-radius: 50%;
    width: 44px;
    height: 44px;
    margin-left: -18px;
    border: 2px solid white;

    &:nth-child(1) {
      margin-left: -2px;
    }

    &:nth-child(2) {
      background: #eff2f3;
    }

    &:nth-child(3) {
      background: #f8f9fa;
    }

    &:nth-child(4) {
      background: #fafafa;
    }
  }
`;
const InfoSectionStyled = styled.section`
  display: grid;
  grid-column-gap: 24px;
  grid-row-gap: 24px;
  //grid-template-columns: 1fr 1fr 1fr;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: 64px;
`;
const InfoWrapStyled = styled.div`
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: ${colorByKey('paleGrey')};
  padding: 24px;
  flex-grow: 1;
  min-height: 200px;
`;

function OldDashboard() {
  const { data: teamData, loading } = useTeamQuery({
    withMembers: true,
  });
  const { user } = useUserStore();
  const username: string = user?.firstname || '';
  const members: NexoyaUser[] = get(teamData, 'data.team.members', []) || [];
  const displayMembers: NexoyaUser[] = members.slice(0, 4);

  return (
    <>
      <PageHeader>
        <div data-cy="dashboardPageHeader">
          <PageHeaderTitle>
            <Typography variant="h1" component="h2">
              Welcome back{username ? `, ${username}` : null}!
            </Typography>
            <HelpCenter url={HELP_CENTER_URLS.DASHBOARD.HOW_TO_USE_DASHBOARD} />
          </PageHeaderTitle>
          <PageHeaderDescription>
            <Typography variant="subtitle">Here is what happened lately...</Typography>
          </PageHeaderDescription>
        </div>
      </PageHeader>
      <InfoSectionStyled data-cy="dashboardSections">
        <InfoWrapStyled data-cy="dashboardTeamSection">
          <Text
            component="h3"
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: 0.8,
              marginBottom: '18',
            }}
          >
            Your team
          </Text>
          {loading || !user ? (
            <LoadingWrapStyled>
              <AvatarsLoadingStyled>
                <LoadingPlaceholder />
                <LoadingPlaceholder />
                <LoadingPlaceholder />
                <LoadingPlaceholder />
              </AvatarsLoadingStyled>
              <LoadingPlaceholder />
            </LoadingWrapStyled>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  marginBottom: '18',
                }}
              >
                <AvatarRow
                  style={{
                    marginRight: 24,
                  }}
                >
                  {displayMembers.map((user) => (
                    <AvatarUser
                      size={44}
                      key={`avatar-${user.user_id}`}
                      email={user.email}
                      fallback={userInitials(user)}
                    />
                  ))}
                </AvatarRow>
                <Button
                  data-cy="inviteMorePeopleBtn"
                  color="primary"
                  to={PATHS.APP.SETTINGS}
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                  startAdornment={
                    <ButtonAdornment position="start">
                      <SvgPlusRegular />
                    </ButtonAdornment>
                  }
                >
                  Invite more people
                </Button>
              </div>
              <MembersCount displayMembers={displayMembers} members={members} />
            </>
          )}
        </InfoWrapStyled>
        <DashboardTips />
      </InfoSectionStyled>
      <DashboardPortfolios2 />
      <DashboardKpis />
    </>
  );
}

export default OldDashboard;
