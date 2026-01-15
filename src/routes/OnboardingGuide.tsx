import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { withRouter } from 'react-router-dom';

import dayjs from 'dayjs';
import { BooleanParam, useQueryParams } from 'use-query-params';

import { NexoyaIntegration } from '../types';

import { useProviders } from '../context/ProvidersProvider';
import { useIntegrationsQuery } from '../graphql/integration/queryIntegrations';
import { useTeamQuery } from 'graphql/team/queryTeam';
import { useUserQuery } from 'graphql/user/queryUser';

import { useTranslation } from '../hooks/useTranslation';
import { READABLE_FORMAT } from '../utils/dates';
import translate from '../utils/translate';
import { userInitials } from '../utils/user';
import { useTenantName } from '../hooks/useTenantName';

import AvatarRow from '../components/AvatarRow';
import AvatarUser from '../components/AvatarUser';
import Button from '../components/Button';
import ButtonAdornment from '../components/ButtonAdornment';
import { useDialogState } from '../components/Dialog';
import GridHeader from '../components/GridHeader';
import GridWrap from '../components/GridWrap';
import LoadingPlaceholder from '../components/LoadingPlaceholder/LoadingPlaceholder';
import { LogoIcon } from '../components/Logo';
import MainContent from '../components/MainContent';
import * as Styles from '../components/PerformanceTable/styles';
import ScrollToTop from '../components/ScrollToTop';
import Tooltip from '../components/Tooltip';
import Typography from '../components/Typography';
import SvgPlusRegular from '../components/icons/PlusRegular';
import { TypographyStyledAligned } from './portfolio/components/BudgetItem/BudgetItemsTable';

import { LoadingContent } from './portfolio/styles/OptimizationProposal';

import MembersCount from './dashboard0/MembersCount';
import OnboardingSuccessDialog from './onboard/OnboardingSuccessDialog';
import {
  AvatarsLoadingStyled,
  GreetingsWrapper,
  GridContainer,
  LoadingWrapStyled,
  MembersWrapper,
  OnboardingGuideWrapper,
  StatusTag,
  StyledGridRow,
  TableWrapper,
  TeamCardWrapper,
  TextStyled,
} from './onboard/styles';
import { PATHS } from './paths';
import NoDataFound from './portfolio/NoDataFound';
import useOrganizationStore from '../store/organization';

const formatDeadline = (task) => {
  if (task.status === 'DONE') {
    return ' - ';
  }
  const daysTillDue = dayjs(task.deadline).endOf('day').diff(dayjs().endOf('day'), 'day');

  let dueText: string;
  if (daysTillDue < 0) {
    dueText = `Due ${Math.abs(daysTillDue)} days ago`;
  } else if (daysTillDue === 0) {
    dueText = 'Due today';
  } else if (daysTillDue === 1) {
    dueText = 'Due tomorrow';
  } else {
    dueText = `Due in ${daysTillDue} days`;
  }

  return dueText;
};

const isIntegrationConnected = (integration: NexoyaIntegration[], providerId) =>
  integration?.find((int) => int.provider_id === providerId)?.connected;

const OnboardingGuide = () => {
  const { organization } = useOrganizationStore();
  const tenantName = useTenantName();

  const [queryParams, setQueryParams] = useQueryParams({
    finishedOnboarding: BooleanParam,
  });
  const { isOpen, toggleDialog, closeDialog } = useDialogState();

  const { data, loading } = useTeamQuery({
    withMembers: true,
    withOrg: false,
  });
  const { data: integrationData } = useIntegrationsQuery({
    withUser: true,
    withConnection: true,
  });
  const onboardingTasks = data?.team?.onboarding?.onboardingTasks;
  const integrations = integrationData?.integrations;

  const { data: userData } = useUserQuery({ fetchPolicy: 'network-only' });
  const { providerById } = useProviders();
  const { translations } = useTranslation();
  const history = useHistory();

  const members = data?.team?.members?.filter((member) => !member.email.includes(tenantName.toLowerCase())) || [];
  const displayMembers = members.slice(0, 4);

  // if the org is in ACTIVE, don't show the integrations page and don't mutate the org state again
  // don't show the onboarding guide if the org is in ACTIVE

  useEffect(() => {
    if (queryParams.finishedOnboarding) {
      toggleDialog();
    }
  }, [queryParams]);

  if (loading) {
    return (
      <LoadingWrapStyled>
        <LogoIcon infinite={true} duration={1500} />
        <LoadingContent>
          <Typography variant="h1">Getting everything ready...</Typography>
          <Typography variant="h5">It might take a couple of seconds to load your onboarding guide.</Typography>
        </LoadingContent>
      </LoadingWrapStyled>
    );
  }

  return (
    <ScrollToTop>
      <MainContent className="sectionToPrint">
        <OnboardingGuideWrapper>
          <GreetingsWrapper>
            <div>
              <Typography as="h2">
                Welcome to {organization?.tenant?.name}, {userData?.user?.firstname}!
              </Typography>
              <Typography
                variant="subtitle"
                withEllipsis={false}
                style={{ maxWidth: 600, whiteSpace: 'break-spaces', marginTop: 8 }}
              >
                Your team is currently in the onboarding phase. Here you'll find all the steps needed before you can
                start your cross-channel optimization journey with {organization?.tenant?.name}.
              </Typography>
            </div>

            <TeamCardWrapper>
              <div style={{ padding: 24 }}>
                <TextStyled component="h3">Your team</TextStyled>
                {loading ? (
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
                  <div>
                    <MembersWrapper>
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
                    </MembersWrapper>
                    <MembersCount displayMembers={displayMembers} members={members} />
                  </div>
                )}
              </div>
              <Button
                data-cy="inviteMorePeopleBtn"
                color="primary"
                variant="contained"
                to={PATHS.APP.SETTINGS}
                style={{
                  whiteSpace: 'nowrap',
                  width: '100%',
                  borderRadius: 0,
                }}
                startAdornment={
                  <ButtonAdornment position="start">
                    <SvgPlusRegular />
                  </ButtonAdornment>
                }
              >
                Invite more people
              </Button>
            </TeamCardWrapper>
          </GreetingsWrapper>
          <TableWrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography as="h3" style={{ fontSize: 24 }}>
                Onboarding guide
              </Typography>
            </div>
            <GridContainer>
              <GridWrap>
                <GridHeader style={{ justifyItems: 'start' }}>
                  <TypographyStyledAligned>
                    <span>Description</span>
                  </TypographyStyledAligned>
                  <TypographyStyledAligned>
                    <span>Deadline</span>
                  </TypographyStyledAligned>
                  <TypographyStyledAligned>
                    <span>Status</span>
                  </TypographyStyledAligned>
                  <TypographyStyledAligned>
                    <span>Responsible</span>
                  </TypographyStyledAligned>
                </GridHeader>
                {onboardingTasks?.length ? (
                  onboardingTasks?.map((task, index) => (
                    <StyledGridRow hasDescription={task.description} key={index}>
                      <div className="sm:max-w-24 lg:max-w-32 xl:max-w-full">
                        <Typography withEllipsis withTooltip>
                          {task.title}
                        </Typography>
                      </div>
                      <Styles.ContentRowStyled style={{ color: '#888a94' }}>
                        <Tooltip
                          variant="dark"
                          placement="right"
                          content={dayjs(task.deadline).format(READABLE_FORMAT)}
                          style={{
                            maxWidth: 500,
                            wordBreak: 'break-word',
                          }}
                        >
                          <span>
                            <Typography>{formatDeadline(task)}</Typography>
                          </span>
                        </Tooltip>
                      </Styles.ContentRowStyled>
                      <Styles.ContentRowStyled style={{ color: '#888a94' }}>
                        <StatusTag
                          status={isIntegrationConnected(integrations, task?.providerId) ? 'DONE' : task.status}
                        >
                          {isIntegrationConnected(integrations, task?.providerId)
                            ? 'Done'
                            : task.status?.toLowerCase()?.replace('_', ' ')}
                        </StatusTag>
                      </Styles.ContentRowStyled>
                      <Styles.ContentRowStyled style={{ color: '#888a94' }}>
                        <Typography style={{ fontWeight: 500 }}>{task.responsible}</Typography>
                      </Styles.ContentRowStyled>
                      {task.providerId ? (
                        <div className="flex w-full items-center justify-end">
                          <Button
                            color="secondary"
                            variant="contained"
                            size="small"
                            disabled={isIntegrationConnected(integrations, task?.providerId)}
                            onClick={() => {
                              history.push(PATHS.APP.SETTINGS_INTEGRATIONS + `&providerId=${task?.providerId}`);
                            }}
                          >
                            Connect {translate(translations, providerById(task.providerId)?.name)}
                          </Button>
                        </div>
                      ) : task.externalLink ? (
                        <Styles.ContentRowStyled style={{ justifySelf: 'flex-end' }}>
                          <Button
                            color="secondary"
                            variant="contained"
                            size="small"
                            onClick={() => {
                              window.open(task.externalLink?.url, '_blank');
                            }}
                          >
                            {task.externalLink?.title}
                          </Button>
                        </Styles.ContentRowStyled>
                      ) : null}
                    </StyledGridRow>
                  ))
                ) : (
                  <NoDataFound
                    title="Oops, your onboarding tasks aren't defined yet"
                    subtitle="Don't worry, your customer success manager will set everything up soon."
                  />
                )}
              </GridWrap>
            </GridContainer>
          </TableWrapper>
        </OnboardingGuideWrapper>
      </MainContent>
      <OnboardingSuccessDialog
        isOpen={isOpen}
        onClose={() => {
          setQueryParams({ finishedOnboarding: null });
          closeDialog();
        }}
      />
    </ScrollToTop>
  );
};

export default withRouter(OnboardingGuide);
