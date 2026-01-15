import React from 'react';

import styled from 'styled-components';

import Tooltip from '../../components/Tooltip';
import InfoCircle from '../../components/icons/InfoCircle';

import Button from '../Button';
import Checkbox from '../Checkbox';
import DialogActions from '../DialogActions';
import Stepper from '../Stepper';

type Props = {
  step: number;
  totalSteps: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onSelectFooterCheckbox: () => void;
  onDeselectFooterCheckbox: () => void;
  onCreateKpi: any;
  handleToggleDialog: () => void;
  allowNext: boolean;
  includeSearch: boolean;
  isError: boolean;
};
// TODO: this is a copy from creating a report. if used again
// we need to create a new component which is a stepper in the modal
const DialogActionsStyled = styled(DialogActions)`
  min-height: 66px;
  min-width: 500px;
  background: #fafbfe;
  display: flex;
  align-items: center;
  padding: 16px 24px;
  position: relative;
`;
const InfoCircleStyled = styled(InfoCircle)`
  color: #0ec76a;
  margin-left: 5px;
`;
// TODO: this is a copy from creating a report. if used again
// we need to create a new component which is a stepper in the modal
const StepperWrapStyled = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;

  & > div {
    width: 60px;
    margin: 0 auto;
  }

  & > span {
    margin-top: 6px;
    display: inline-block;
  }
`;

function Footer({
  step,
  totalSteps,
  onNextStep,
  onPreviousStep,
  onSelectFooterCheckbox,
  onDeselectFooterCheckbox,
  onCreateKpi,
  allowNext,
  includeSearch,
  isError,
}: Props) {
  const [tooltipRef, setTooltipRef] = React.useState(null);
  if (isError) return null;
  return (
    <DialogActionsStyled ref={setTooltipRef}>
      {step > 1 ? (
        <Button
          variant="contained"
          style={{
            marginRight: 'auto',
          }}
          onClick={onPreviousStep}
          id="previousStepBtn"
        >
          Previous step
        </Button>
      ) : (
        <>
          <Checkbox
            checked={includeSearch}
            onClick={() => {
              if (includeSearch) {
                onDeselectFooterCheckbox();
              } else {
                onSelectFooterCheckbox();
              }
            }}
            label="Automatically add new metrics"
            data-cy="autoAddMetricsCheckbox"
          />
          <Tooltip
            variant="dark"
            content="By activating this, new metrics with the same name & search criteria will be automatically added to your custom KPI and calculated accordingly."
            container={tooltipRef}
            data-cy="footerTooltip"
          >
            <span>
              <InfoCircleStyled />
            </span>
          </Tooltip>
        </>
      )}
      <StepperWrapStyled>
        <Stepper current={step} steps={totalSteps} />
        <span>
          Step {step} of {totalSteps}
        </span>
      </StepperWrapStyled>
      <Button
        color="primary"
        variant="contained"
        disabled={!allowNext}
        style={{
          marginLeft: 'auto',
        }}
        onClick={step === 3 ? onCreateKpi : onNextStep}
        id="nextStepBtn"
      >
        {step === 3 ? 'Create KPI' : 'Next step'}
      </Button>
    </DialogActionsStyled>
  );
}

export default Footer;
