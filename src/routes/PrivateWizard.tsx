import styled from 'styled-components';

import { withOnboardingContext } from '../context/OnboardingProvider';

const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const WizardLayout = ({ children }: any) => {
  return <WrapStyled>{children}</WrapStyled>;
};

export default withOnboardingContext(WizardLayout);
