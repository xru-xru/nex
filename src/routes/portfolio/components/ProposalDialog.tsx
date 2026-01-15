import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import TextField from '../../../components/TextField';
import ButtonAsync from '../../../components/ButtonAsync';
import SvgCheckCircle from '../../../components/icons/CheckCircle';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { getBudgetProposalTargetBiddingApplyTypes } from '../../../utils/portfolioEdit';
import { useTenantName } from '../../../hooks/useTenantName';

interface Props {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const CONFIRMATION_KEYWORD = 'Apply';

const ProposalDialog = ({ isOpen, loading, onClose, onSubmit }: Props) => {
  const [confirmationKeyword, setConfirmationKeyword] = useState('');
  const tenantName = useTenantName();

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const selectedOptimizationApplyType = getBudgetProposalTargetBiddingApplyTypes(tenantName).find(
    (applyType) => applyType?.type === portfolioMeta?.budgetProposalTargetBiddingApplyMode,
  );

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="min-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to proceed?</AlertDialogTitle>
          <div>
            <div className="mb-3 mt-2 flex flex-col rounded-md border border-neutral-100 bg-neutral-50 p-3">
              <div className="flex items-center gap-2">
                <SvgCheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-md leading-5 text-neutral-800">{selectedOptimizationApplyType?.title}</span>
              </div>
              <span className="ml-6 font-normal leading-5 text-neutral-700">
                {selectedOptimizationApplyType?.proposalDescription}
              </span>
            </div>
          </div>
          <TextField
            fullWidth
            autoComplete="off"
            type="text"
            id="confirmation"
            name="confirmation"
            placeholder="Apply"
            label={
              <span style={{ fontSize: 13, fontWeight: 400 }}>
                To automatically shift all the budgets, type the word{' '}
                <span className="rounded-md border border-neutral-100 bg-neutral-50 px-1 py-0.5 font-mono font-medium text-red-600">
                  {CONFIRMATION_KEYWORD}
                </span>
              </span>
            }
            value={confirmationKeyword}
            onChange={(e) => setConfirmationKeyword(e.target.value)}
          />
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full !justify-between">
          <AlertDialogAction>
            <ButtonAsync onClick={onClose} variant="contained" color="secondary" size="small" disabled={loading}>
              Cancel
            </ButtonAsync>
          </AlertDialogAction>
          <AlertDialogAction>
            <ButtonAsync
              onClick={onSubmit}
              variant="contained"
              color="primary"
              size="small"
              disabled={loading || confirmationKeyword !== CONFIRMATION_KEYWORD}
              loading={loading}
            >
              I understand changes will be applied automatically
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProposalDialog;
