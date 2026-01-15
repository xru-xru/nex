import styled from 'styled-components';

import Button from '../../components/Button';
import DialogContent from '../../components/DialogContent';

// TODO: Replace SuccessMessage from createReport with this one and remove that one
// This is a generic version of success message component, used in wizards
type Props = {
  headerText?: string;
  successText?: string;
  resetText?: string;
  confirmText?: string;
  resetAction: () => void;
  confirmAction?: () => void;
  confirmPath?: string;
};
const DialogContentStyled = styled(DialogContent)`
  padding: 25px;
  text-align: center;

  [role='img'] {
    font-size: 40px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 28px;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 25px;
  }

  button {
    margin: 0 5px;
  }
`;

function SuccessMessage(props: Props) {
  const {
    headerText = 'Whoop whoop!',
    successText = 'You successfully completed your action',
    resetText = 'Start again',
    resetAction,
    confirmText = 'Confirm',
    confirmAction,
  } = props;
  return (
    <DialogContentStyled data-cy="successMessage">
      <span role="img" aria-label="hands emoji">
        🙌
      </span>
      <h3>{headerText}</h3>
      <p>{successText}</p>
      <Button id="resetAction" variant="contained" onClick={resetAction}>
        {resetText}
      </Button>
      <Button id="confirmAction" variant="contained" color="primary" onClick={confirmAction}>
        {confirmText}
      </Button>
    </DialogContentStyled>
  );
}

export default SuccessMessage;
