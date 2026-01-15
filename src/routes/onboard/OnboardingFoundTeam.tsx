import { useHistory } from 'react-router';

import { ONBOARDING_IDS, useOnboardingContext } from '../../context/OnboardingProvider';
import { useTeamQuery } from '../../graphql/team/queryTeam';
import { useSetUserStateMutation } from '../../graphql/user/mutationSetUserState';
import { useTenantName } from '../../hooks/useTenantName';

import { userState } from '../../constants/userState';

import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import { Logo } from '../../components/Logo';
import OnboardingStepper from '../../components/OnboardingStepper';
import Tooltip from '../../components/Tooltip';
import { Subtitle } from '../../components/Typography/styles';
import { PATHS } from 'routes/paths';

import { nexyColors } from '../../theme';
import {
  LogoWrapper,
  OnboardingContentWrapper,
  OnboardingContentWrapperContainer,
  OnboardingForm,
  OnboardingFormWrapper,
  TeamCard,
  TeamCardContent,
  Title,
} from './styles';

function OnboardingFoundTeam() {
  const history = useHistory();
  const tenantName = useTenantName();

  const { data } = useTeamQuery({
    withMembers: true,
    withOrg: false,
  });
  const { handleNextStep, onboardingSteps } = useOnboardingContext();
  const team = data?.team;
  const members = team?.members?.filter((member) => !member.email.includes(tenantName.toLowerCase())) || [];
  const displayMembers = members.slice(0, 4);
  const [setUserState] = useSetUserStateMutation({
    userState: userState.ACTIVE,
  });

  const handleSubmit = () => {
    // if the latest onboarding step is not the integration, then we redirect to the app, otherwise we handleNextStep()
    if (onboardingSteps[onboardingSteps?.length - 1]?.id !== ONBOARDING_IDS.INTEGRATION_ID) {
      (setUserState as Function)().then(() => {
        history.push(PATHS.APP.HOME);
      });
    } else {
      handleNextStep();
    }
  };

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
                <Title>Congrats on joining your team!</Title>
                <Subtitle style={{ marginBottom: 40, maxWidth: 450 }}>
                  Join your team by continuing through the steps. And no worries, you can set up everything else in the
                  app as well.
                </Subtitle>
                <div style={{ maxWidth: 450 }}>
                  <TeamCard>
                    <TeamCardContent>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Avatar size={52} src={team?.logo} />
                        <div>
                          <p>{team?.name}</p>
                          <Tooltip
                            variant="dark"
                            placement="right"
                            content={displayMembers
                              ?.map((member) => member.firstname + ' ' + member.lastname?.[0])
                              ?.join(', ')}
                          >
                            <p
                              style={{
                                fontWeight: 400,
                                fontSize: 12,
                                color: nexyColors.secondaryText,
                              }}
                            >
                              {displayMembers?.length} members
                            </p>
                          </Tooltip>
                        </div>
                      </div>
                      <div style={{ fontSize: 24 }}>🎉</div>
                    </TeamCardContent>
                    <Button
                      style={{ width: '100%', marginTop: 17, borderRadius: 0 }}
                      onClick={handleSubmit}
                      color="primary"
                      variant="contained"
                    >
                      Join and continue
                    </Button>
                  </TeamCard>
                </div>
              </div>
            </OnboardingContentWrapper>
          </OnboardingContentWrapperContainer>
        </OnboardingForm>
      </OnboardingFormWrapper>
    </>
  );
}

export default OnboardingFoundTeam;
