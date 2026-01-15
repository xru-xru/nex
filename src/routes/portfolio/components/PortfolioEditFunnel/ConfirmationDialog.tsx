import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components-ui/AlertDialog';
import ButtonAsync from '../../../../components/ButtonAsync';
import React from 'react';
import SvgWarning from '../../../../components/icons/Warning';
import { nexyColors } from '../../../../theme';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  type: 'discard' | 'apply';
  description: string;
  disabled?: boolean;
  titleText?: string;
  ctaText?: string;
  warning?: string;
  loading?: boolean;
}

export const ConfirmationDialog = ({
  type,
  onConfirm,
  onCancel,
  isOpen,
  description,
  ctaText,
  titleText,
  disabled,
  warning,
  loading,
}: Props) => {
  const title = titleText ? titleText : type === 'discard' ? 'Discard changes?' : 'Apply changes';
  const cta = ctaText ? ctaText : type === 'discard' ? 'Discard' : 'Apply';

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-sm font-normal leading-5 text-neutral-400">{description}</span>
            {warning ? (
              <div className="mt-4 flex flex-row gap-2 rounded-md border border-[#FDDBBA] bg-[#FEF6EE] p-2 text-sm font-normal leading-5 text-neutral-500">
                <SvgWarning
                  style={{ color: nexyColors.pumpkinOrange, width: 18, height: 18, marginTop: 2 }}
                  className="warningIcon"
                />
                {warning}
              </div>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>
            <ButtonAsync disabled={disabled} onClick={onCancel} variant="contained" color="secondary" size="small">
              Cancel
            </ButtonAsync>
          </AlertDialogAction>

          <AlertDialogAction>
            <ButtonAsync
              disabled={disabled}
              onClick={onConfirm}
              loading={loading}
              variant="contained"
              color={type === 'discard' ? 'danger' : 'primary'}
              size="small"
            >
              {cta}
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
