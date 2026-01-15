import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';

import { PATHS } from '../../routes/paths';
import DashboardKpisTutorial from './components/DashboardKpisTutorial';
import FinishTutorial from './components/FinishTutorial';
import PortfolioTutorial from './components/PortfolioTutorial';
import PortfolioPredictionTutorial from './components/PredictionTutorial';

import Button from '../Button';
import Stepper, { useStepper } from '../Stepper';

const WrapStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px calc((100vw - 820px) / 2);
  width: 100%;
`;
const ContentStyled = styled.div`
  width: 100%;
  max-width: 820px;
  padding-bottom: 30px;
`;
const FooterStyled = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 75px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 calc((100vw - 450px) / 2);
  background: #ffffff;

  .NEXYStepper {
    margin: 0 auto;
    width: 50px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

function Tutorial() {
  const [queryUrl] = useQueryParam('redirect', StringParam);
  const { step, nextStep, setStep } = useStepper();
  const lastStep = step === 3;
  return (
    <WrapStyled>
      <ContentStyled>
        {step === 1 ? (
          <DashboardKpisTutorial />
        ) : step === 2 ? (
          <PortfolioTutorial />
        ) : step === 3 ? (
          <PortfolioPredictionTutorial />
        ) : (
          <FinishTutorial />
        )}
      </ContentStyled>
      <FooterStyled>
        {!lastStep ? (
          <>
            <Button
              to={queryUrl || PATHS.APP.HOME}
              variant="text"
              style={{
                opacity: 0.5,
              }}
            >
              Skip
            </Button>
            <Stepper current={step} steps={3} onStepClick={setStep} withBar={false} />
          </>
        ) : null}
        <Button
          variant="contained"
          color="primary"
          onClick={nextStep}
          to={lastStep ? queryUrl || PATHS.APP.HOME : undefined}
          style={{
            margin: lastStep ? '0 auto' : '0',
          }}
        >
          {lastStep ? 'Get started' : 'Next'}
        </Button>
      </FooterStyled>
    </WrapStyled>
  );
}

export default Tutorial;
