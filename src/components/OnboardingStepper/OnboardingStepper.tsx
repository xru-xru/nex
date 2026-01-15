import styled from 'styled-components';

import { useOnboardingContext } from '../../context/OnboardingProvider';

import { BrickLoader } from '../../routes/Portfolio';

const OnboardingStepsWrapper = styled.div`
  display: grid;
  align-items: center;
  justify-content: start;
  grid-auto-flow: column;
  gap: calc(0.5 * 0.5rem);
  padding: calc(5 * 0.5rem) 0;
`;

const Step = styled.div<{ status }>`
  background-color: ${(props) => {
    switch (props.status) {
      case 'completed':
        return 'rgba(14,199,106,0.8)';
      default:
        return 'hsla(260,11%,95%,1)';
    }
  }};
  border-radius: 4px;
  width: 6rem;
  height: 0.6rem;
`;

const OnboardingStepper = () => {
  const { currentStep, onboardingSteps, loading } = useOnboardingContext();

  const getStepStatus = (currentStep, idx) => (idx <= currentStep ? 'completed' : 'pending');

  return (
    <OnboardingStepsWrapper>
      {loading ? (
        <>
          <BrickLoader style={{ width: '18rem', height: '0.6rem' }} />
        </>
      ) : (
        onboardingSteps.map((_, idx) => <Step key={idx} status={getStepStatus(currentStep, idx)} />)
      )}
    </OnboardingStepsWrapper>
  );
};

export default OnboardingStepper;
