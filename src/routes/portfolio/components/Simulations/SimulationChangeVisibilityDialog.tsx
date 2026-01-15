import React from 'react';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import Button from '../../../../components/Button';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components-ui/AlertDialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  handleSave: () => void;
  loading: boolean;
};

export function SimulationChangeVisibilityDialog({ isOpen, onClose, handleSave, loading }: Props) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Make simulation visible to all users</AlertDialogTitle>
          <AlertDialogDescription>
            <span>This will make the simulation visible to all users. This action is irreversible.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            <Button disabled={loading} size="small" variant="contained" color="secondary">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleSave()} disabled={loading}>
            <Button disabled={loading} size="small" variant="contained" color="primary">
              Change visibility
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
