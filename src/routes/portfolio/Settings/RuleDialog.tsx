import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import { LabelLight } from '../../../components/InputLabel/styles';
import TextField from '../../../components/TextField';
import ButtonAsync from '../../../components/ButtonAsync';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components-ui/Select';

type DialogMode = 'content-name' | 'impact-name' | 'impact-assign' | 'attribution-name';

interface RuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: DialogMode;
  name: string;
  setName: (name: string) => void;
  selectedImpactGroupId: number | null;
  setSelectedImpactGroupId: (id: number) => void;
  impactGroups: any[];
  onSave: () => void;
  loading: boolean;
}

const getDialogConfig = (mode: DialogMode) => {
  switch (mode) {
    case 'attribution-name':
      return {
        title: 'Change attribution rule name',
        description: 'Give your attribution rule a new name.',
        showName: true,
        showImpactGroup: false,
      };
    case 'content-name':
      return {
        title: 'Change content rule name',
        description: 'Give your content rule a new name.',
        showName: true,
        showImpactGroup: false,
      };
    case 'impact-name':
      return {
        title: 'Change impact group rule name',
        description: 'Give your impact group rule a new name.',
        showName: true,
        showImpactGroup: true,
      };
    case 'impact-assign':
      return {
        title: 'Assign impact group',
        description: 'Select an impact group from the dropdown to assign to the matching contents.',
        showName: false,
        showImpactGroup: true,
      };
    default:
      return {
        title: '',
        description: '',
        showName: false,
        showImpactGroup: false,
      };
  }
};

export const RuleDialog = ({
  isOpen,
  onClose,
  mode,
  name,
  setName,
  selectedImpactGroupId,
  setSelectedImpactGroupId,
  impactGroups,
  onSave,
  loading,
}: RuleDialogProps) => {
  const config = getDialogConfig(mode);

  const isSaveDisabled = loading || (config.showName && !name) || (config.showImpactGroup && !selectedImpactGroupId);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">{config.description}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          {config.showName && (
            <>
              <LabelLight>Rule name</LabelLight>
              <TextField
                placeholder="Type rule name..."
                className="my-2 !w-full"
                value={name}
                name="name"
                id="rule-name"
                labelVariant="light"
                onChange={(e) => setName(e?.target?.value)}
              />
            </>
          )}

          {config.showImpactGroup && (
            <div className={config.showName ? 'mt-4' : ''}>
              <LabelLight>Select Impact Group</LabelLight>
              <Select
                value={selectedImpactGroupId?.toString()}
                onValueChange={(impactGroupId) => setSelectedImpactGroupId(Number(impactGroupId))}
              >
                <SelectTrigger className="w-full border-neutral-100 bg-white p-2 shadow-sm">
                  <SelectValue placeholder="Select impact group" />
                </SelectTrigger>
                <SelectContent>
                  {impactGroups?.map((impactGroup) => (
                    <SelectItem key={impactGroup.impactGroupId} value={impactGroup.impactGroupId?.toString()}>
                      <span>{impactGroup.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction>
            <ButtonAsync onClick={onClose} disabled={loading} variant="contained" color="secondary" size="small">
              Cancel
            </ButtonAsync>
          </AlertDialogAction>

          <AlertDialogAction>
            <ButtonAsync
              onClick={onSave}
              disabled={isSaveDisabled}
              loading={loading}
              variant="contained"
              color="primary"
              size="small"
            >
              Save changes
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
