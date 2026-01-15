import React, { useEffect, useState } from 'react';

import { useTeamQuery } from '../graphql/team/queryTeam';

const OnboardingContext = React.createContext(null);

export const ONBOARDING_IDS = {
  USER_DETAILS_ID: 'name',
  JOIN_TEAM_ID: 'join',
  INTEGRATION_ID: 'integrations',
};
export const TOTAL_ONBOARDING_STEPS = [
  { id: ONBOARDING_IDS.USER_DETAILS_ID, name: 'User details' },
  { id: ONBOARDING_IDS.JOIN_TEAM_ID, name: 'Join the team' },
  { id: ONBOARDING_IDS.INTEGRATION_ID, name: 'Integrations' },
];

function OnboardingProvider(props: any) {
  const [onboardingSteps, setOnboardingSteps] = useState(TOTAL_ONBOARDING_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const { data, loading } = useTeamQuery({
    withMembers: false,
    withOrg: false,
  });

  // if the onboarding state is active, don't show the integrations step
  useEffect(() => {
    if (loading) return;

    if (!data?.team?.onboarding?.onboardingTasks?.length) {
      setOnboardingSteps(TOTAL_ONBOARDING_STEPS.slice(0, 2));
    } else {
      setOnboardingSteps(TOTAL_ONBOARDING_STEPS);
    }
  }, [data, loading]);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  const handlePreviousStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const value = {
    loading,
    currentStep,
    onboardingSteps,
    handleNextStep,
    handlePreviousStep,
  };
  return <OnboardingContext.Provider value={value} {...props} />;
}

function withOnboardingContext(Component: any) {
  return (props: any) => (
    <OnboardingProvider>
      <Component {...props} />
    </OnboardingProvider>
  );
}

function useOnboardingContext(): Record<string, any> {
  const context = React.useContext(OnboardingContext);

  if (context === undefined) {
    throw new Error('useKpisFilter: must be used within <KpisFilter Provider />');
  }

  return context;
}

export { OnboardingProvider, withOnboardingContext, useOnboardingContext };
