import React, { Dispatch, FC, SetStateAction } from 'react';
import { SidePanelActions } from '../../../../../components/SidePanel';
import Button from '../../../../../components/Button';
import ButtonAsync from '../../../../../components/ButtonAsync';
import { toast } from 'sonner';
import usePortfolioMetaStore from '../../../../../store/portfolio-meta';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components-ui/Select';
import { toNumber } from 'lodash';

interface StepAssignImpactGroupProps {
  selectedImpactGroupId: number | null;
  setSelectedImpactGroupId: Dispatch<SetStateAction<number>>;
  onPreviousStep: () => void;
  onComplete: () => void;
}

const StepAssignImpactGroup: FC<StepAssignImpactGroupProps> = ({
  selectedImpactGroupId,
  setSelectedImpactGroupId,
  onPreviousStep,
  onComplete,
}) => {
  const {
    portfolioMeta: { impactGroups },
  } = usePortfolioMetaStore();

  const handleSubmit = () => {
    if (!selectedImpactGroupId) {
      toast.warning('Please select an impact group');
      return;
    }
    onComplete();
  };

  const handleSkipImpactGroupAssignment = () => {
    setSelectedImpactGroupId(null);
    onComplete();
  };

  return (
    <>
      <div className="p-6">
        <div>
          <div className="mb-2 text-mdlg text-neutral-800">Assign impact group (Optional)</div>
          <div className="text-md mb-4 font-light text-neutral-300">
            Select an impact group to assign to your selected manual contents.
          </div>
        </div>

        <Select
          onValueChange={(value) => setSelectedImpactGroupId(toNumber(value))}
          value={selectedImpactGroupId?.toString() || undefined}
        >
          <SelectTrigger className="max-w-md border-neutral-100 bg-white p-2">
            <SelectValue placeholder="Select impact group" />
          </SelectTrigger>
          <SelectContent>
            {impactGroups?.map((ig) => (
              <SelectItem key={ig?.impactGroupId} value={ig?.impactGroupId?.toString()}>
                <div className="max-w-48 truncate">{ig?.name}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2 text-[10px] text-neutral-300">
          Note: A content needs to be assigned an impact group to be enabled for optimization.
        </div>
      </div>

      <SidePanelActions>
        <Button variant="contained" color="tertiary" onClick={onPreviousStep}>
          Go back
        </Button>
        <div className="flex items-center gap-2">
          <ButtonAsync variant="contained" color="secondary" onClick={handleSkipImpactGroupAssignment}>
            Skip impact group assignment
          </ButtonAsync>
          <ButtonAsync variant="contained" color="primary" onClick={handleSubmit} disabled={!selectedImpactGroupId}>
            Apply impact group assignment
          </ButtonAsync>
        </div>
      </SidePanelActions>
    </>
  );
};

export default StepAssignImpactGroup;
