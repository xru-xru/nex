import React from 'react';

import {
  DetailsDialogTitle,
  DynamicText,
  StepDescription,
  StepWrapper,
  StyledDialogActions,
  StyledDialogContent,
  StyledStep,
} from '../../routes/portfolio/components/Funnel/styles';

import Button from '../Button';
import Dialog from '../Dialog';
import useDialogState from '../Dialog/useDialogState';
import DialogTitle from '../DialogTitle';

export const PossibleFixDialog = () => {
  const { isOpen, closeDialog, openDialog } = useDialogState({
    initialState: true,
  });

  return (
    <>
      <Button variant="contained" color="primary" size="small" onClick={openDialog}>
        Possible solution
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        paperProps={{
          style: {
            width: 639,
            textAlign: 'center',
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-cy="deleteDialog"
      >
        <DialogTitle>
          <DetailsDialogTitle>There seems to be a network related issue</DetailsDialogTitle>
        </DialogTitle>
        <StyledDialogContent>
          <StepWrapper>
            <StyledStep>1</StyledStep>
            <StepDescription>
              Contact your IT support team to ensure that there are no network issues impacting the service.
              <br />
              <br />
              <DynamicText>
                Discuss any potential connectivity problems or firewall settings that might affect the application's
                performance.
              </DynamicText>
            </StepDescription>
          </StepWrapper>
          <StepWrapper>
            <StyledStep>2</StyledStep>
            <StepDescription>
              Request your IT team to whitelist <DynamicText>*.nexoya.io</DynamicText> to ensure uninterrupted service
              access.
              <br />
              <br />
              This step is crucial for ensuring that our service communicates effectively with your network without any
              hitches.
            </StepDescription>
          </StepWrapper>
          <StepWrapper>
            <StyledStep>3</StyledStep>
            <StepDescription>
              After completing these steps, if the issue persists, please reach out to our support team for further
              assistance.
            </StepDescription>
          </StepWrapper>
        </StyledDialogContent>
        <StyledDialogActions variant="primary">
          <Button onClick={closeDialog} variant="contained" color="primary">
            OK
          </Button>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};
