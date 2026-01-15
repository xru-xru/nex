import { Fragment } from 'react';
import { useHistory } from 'react-router';
import 'react-router-dom';

import { get } from 'lodash';

import { useIntegrationsQuery } from '../../graphql/integration/queryIntegrations';
import { useTeamQuery } from '../../graphql/team/queryTeam';
import { useSetUserStateMutation } from '../../graphql/user/mutationSetUserState';
import { useTenantName } from '../../hooks/useTenantName';

import { userState } from '../../constants/userState';

import Button from '../../components/Button';
import Divider from '../../components/Divider';
import { Logo } from '../../components/Logo';
import OnboardingStepper from '../../components/OnboardingStepper';
import { Subtitle } from '../../components/Typography/styles';

import { PATHS } from '../paths';
import CardIntegration from './CardIntegration';
import {
  IntWrapStyled,
  LoadingPlaceholderStyled,
  LogoWrapper,
  OnboardingContentWrapper,
  OnboardingContentWrapperContainer,
  OnboardingForm,
  OnboardingFormWrapper,
  Tip,
  Title,
} from './styles';

const OnboardIntegrations = () => {
  const history = useHistory();
  const tenantName = useTenantName();
  const { data, refetch, initLoading, refetchLoading } = useIntegrationsQuery({
    type: 'auto',
    withConnection: true,
  });
  const { data: teamData } = useTeamQuery({
    withMembers: false,
    withOrg: false,
  });
  const integrations = get(data, 'integrations', []);
  const onboardingTasksProviderIds = teamData?.team?.onboarding?.onboardingTasks
    ?.map((task) => task?.providerId)
    ?.filter(Boolean);

  const someConnected = integrations.some((i) => i.connected);
  const [setUserState] = useSetUserStateMutation({
    userState: userState.ACTIVE,
  });

  async function submitNextStep() {
    try {
      const res = await (setUserState as Function)();

      if (get(res, 'data.setUserState', false)) {
        history.push(PATHS.APP.ONBOARD_GUIDE + '?finishedOnboarding=1');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <>
      <OnboardingFormWrapper>
        <OnboardingForm>
          <LogoWrapper>
            <Logo animationDisabled={true} />
          </LogoWrapper>
          <OnboardingContentWrapperContainer>
            <OnboardingContentWrapper>
              <div style={{ width: '100%' }}>
                <OnboardingStepper />
                <Title>{tenantName} works with a bunch of integrations</Title>
                <Subtitle style={{ marginBottom: 40, maxWidth: 450 }}>
                  You can either integrate your tools now or you can do it later in the app, no need to rush.
                </Subtitle>
                <div>
                  <IntWrapStyled>
                    {initLoading ? (
                      <>
                        <LoadingPlaceholderStyled />
                        <LoadingPlaceholderStyled />
                        <LoadingPlaceholderStyled />
                        <LoadingPlaceholderStyled />
                        <LoadingPlaceholderStyled />
                      </>
                    ) : (
                      <>
                        {integrations
                          ?.filter((integration) =>
                            onboardingTasksProviderIds?.length
                              ? onboardingTasksProviderIds?.includes(integration.provider_id)
                              : true,
                          )
                          .slice(0, 5)
                          .map((int) => (
                            <Fragment key={int.integration_id}>
                              <CardIntegration refetchAll={refetch} integration={int} loading={refetchLoading} />
                              <Divider margin="4px" />
                            </Fragment>
                          ))}
                        <Tip>More tools are waiting for you after you sign up</Tip>
                      </>
                    )}
                  </IntWrapStyled>
                </div>
              </div>
              <div style={{ maxWidth: 450 }}>
                <Button
                  style={{ marginBottom: 30, width: '100%' }}
                  color={someConnected ? 'primary' : 'white'}
                  variant="contained"
                  disabled={refetchLoading}
                  onClick={submitNextStep}
                >
                  Continue
                </Button>
                <Button style={{ width: '100%' }} onClick={submitNextStep} color="tertiary" variant="text">
                  I'll do this later
                </Button>
              </div>
            </OnboardingContentWrapper>
          </OnboardingContentWrapperContainer>
        </OnboardingForm>
      </OnboardingFormWrapper>
    </>
  );
};

export default OnboardIntegrations;
