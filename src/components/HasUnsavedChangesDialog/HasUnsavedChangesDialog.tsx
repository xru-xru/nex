import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components-ui/AlertDialog';
import React from 'react';
import Button from '../Button';

const HasUnsavedChangesDialog = ({ open, cancelNavigation, confirmNavigation }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
              You have unsaved changes, are you sure you want to leave this page? Changes you made will not be saved.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction>
            <Button onClick={cancelNavigation} variant="contained" color="secondary" size="small">
              Continue editing
            </Button>
          </AlertDialogAction>

          <AlertDialogAction>
            <Button onClick={confirmNavigation} variant="contained" color="danger" size="small">
              Leave page
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HasUnsavedChangesDialog;
