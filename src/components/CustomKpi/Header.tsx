import styled from 'styled-components';

import DialogTitle from '../DialogTitle';
import Text from '../Text';

type Props = {
  step: number;
  isKpiCreated: boolean;
  isError: boolean;
};
// TODO: this is a copy from creating a report. if used again
// we need to create a new component which is a stepper in the modal
const DialogTitleStyled = styled(DialogTitle)`
  padding: 24px 24px;
  h3 {
    font-size: 32px;
  }
`;

function Header({ step, isKpiCreated, isError }: Props) {
  return (
    <DialogTitleStyled>
      {!isError ? (
        <Text component="h3">
          {step === 1
            ? 'Define your filter'
            : step === 2
            ? 'Calculation'
            : step === 3 && !isKpiCreated
            ? 'Name your new KPI'
            : 'KPI successfully created'}
        </Text>
      ) : null}
    </DialogTitleStyled>
  );
}

export default Header;
