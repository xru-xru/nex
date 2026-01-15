import styled from 'styled-components';

import { useOnboardingContext } from '../../context/OnboardingProvider';

import OnboardIntegrations from './OnboardIntegrations';
import OnboardingFoundTeam from './OnboardingFoundTeam';
import OnboardingName from './OnboardingName';
import { OnboardingSocialProof } from './OnboardingSocialProof';
import { useTeamQuery } from '../../graphql/team/queryTeam';

const OnboardingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const Onboarding = () => {
  const { currentStep } = useOnboardingContext();

  useTeamQuery();

  const renderOnboardingStep = () => {
    switch (currentStep) {
      case 0:
        return <OnboardingName />;
      case 1:
        return <OnboardingFoundTeam />;
      // TODO: Is this worth adding in an extra step?
      // return <OnboardingInviteOthers />;
      case 2:
        return <OnboardIntegrations />;
    }
  };

  return (
    <OnboardingWrapper>
      {renderOnboardingStep()}
      <OnboardingSocialProof />
    </OnboardingWrapper>
  );
};
