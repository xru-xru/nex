import styled from 'styled-components';

import { useReportNew, withReportNewProvider } from '../../context/ReportNewProvider';

import usePresenterMode from '../../hooks/usePresenterMode';

import Button from '../../components/Button';
import Dialog, { useDialogState } from '../../components/Dialog';
import DialogTitle from '../../components/DialogTitle';
import Typography from '../../components/Typography';

import CreateReportSidepanel from './createReportButton/CreateReportSidepanel';
import SelectReportType from './createReportButton/SelectReportType';
import SuccessMessage from './createReportButton/SuccessMessage';

const DialogStyled = styled(Dialog)`
  .NEXYPaper {
    width: 750px;
  }
`;

function CreateReportButton() {
  const { isOpen } = useDialogState({
    initialState: false,
  });
  const { dialogState, resetAll } = useReportNew();
  const { isPresenterMode } = usePresenterMode();

  function handleToggleDialog() {
    if (!isOpen) {
      resetAll();
    }

    dialogState.toggleDialog();
  }

  if (isPresenterMode) return null;
  return (
    <>
      <Button id="createAReport" color="primary" variant="contained" onClick={handleToggleDialog}>
        Create a report
      </Button>
      <DialogStyled isOpen={dialogState.isOpen} onClose={handleToggleDialog}>
        <DialogTitle>
          <Typography component="h3">Select report type</Typography>
        </DialogTitle>
        <SelectReportType />
      </DialogStyled>
      <CreateReportSidepanel />
      <SuccessMessage />
    </>
  );
}

export default withReportNewProvider(CreateReportButton);
