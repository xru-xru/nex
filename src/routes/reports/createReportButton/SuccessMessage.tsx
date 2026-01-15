import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { useReportNew } from '../../../context/ReportNewProvider';

import Button from '../../../components/Button';
import Dialog from '../../../components/Dialog';
import DialogContent from '../../../components/DialogContent';

import { buildReportPath } from '../../paths';

const DialogContentStyled = styled(DialogContent)`
  padding: 25px;
  text-align: center;
  width: 100%;

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
`;
const ActionsWrapStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  .NEXYButton {
    margin: 0 5px;
    white-space: nowrap;
  }
`;

function SuccessMessage() {
  const {
    formMeta,
    report: { reportId },
    dialogState,
    successDialogState,
    resetAll,
  } = useReportNew();
  if (!reportId) return null;
  return (
    <Dialog
      isOpen={successDialogState.isOpen}
      onClose={() => {
        resetAll();
        successDialogState.toggleDialog();
      }}
      paperProps={{
        style: {
          width: 455,
        },
      }}
    >
      <DialogContentStyled data-cy="reportSuccessDialogContent">
        <span role="img" aria-label="hands emoji">
          🙌
        </span>
        <h3>Whoop whoop!</h3>
        <p>
          You successfully created a report by the name <strong>{formMeta.values.name}</strong>
        </p>
        <ActionsWrapStyled>
          <Button
            id="createAnother"
            variant="contained"
            onClick={() => {
              resetAll();
              dialogState.toggleDialog();
              successDialogState.toggleDialog();
            }}
          >
            Create another
          </Button>
          <Button id="seeItNow" variant="contained" color="primary" to={buildReportPath(reportId)} component={Link}>
            See it now
          </Button>
        </ActionsWrapStyled>
      </DialogContentStyled>
    </Dialog>
  );
}

export default SuccessMessage;
