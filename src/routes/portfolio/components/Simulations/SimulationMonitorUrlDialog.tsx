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
import TextField from '../../../../components/TextField';

type Props = {
  isOpen: any;
  onClose: any;
  currentMonitoringUrl?: string;
  handleSave: (url: string) => void;
  loading: boolean;
};

export function SimulationMonitorUrlDialog({ isOpen, onClose, currentMonitoringUrl, handleSave, loading }: Props) {
  const [monitoringUrl, setMonitoringUrl] = React.useState<string>(currentMonitoringUrl || '');

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set monitoring URL</AlertDialogTitle>
          <AlertDialogDescription>
            <TextField
              placeholder="Enter the monitoring URL..."
              className="my-2 !w-full"
              value={monitoringUrl}
              id="simulation-monitoring-url"
              labelVariant="light"
              onChange={(e) => setMonitoringUrl(e?.target?.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            <Button disabled={loading} size="small" variant="contained" color="secondary">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleSave(monitoringUrl)} disabled={loading}>
            <Button disabled={loading} size="small" variant="contained" color="primary">
              Save
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
