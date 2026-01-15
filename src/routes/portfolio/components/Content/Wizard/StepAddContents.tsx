import React, { FC } from 'react';
import ContentSelectionV2 from '../../../../../components/ContentSelection/ContentSelectionV2';
import { SidePanelActions } from '../../../../../components/SidePanel';
import ButtonAsync from '../../../../../components/ButtonAsync';
import { toast } from 'sonner';
import { DataTableFilterOption } from '../PortfolioRule/types';
import { NexoyaContentFilter } from '../../../../../types';

interface StepAddContentsProps {
  selectedContentIds: number[];
  setSelectedContentIds: (ids: number[]) => void;
  selectedProviderIds: number[];
  setSelectedProviderIds: (ids: number[]) => void;
  selectedAccountIds: number[];
  setSelectedAccountIds: (ids: number[]) => void;
  selectedOptions: DataTableFilterOption[];
  setSelectedOptions: (options: DataTableFilterOption[]) => void;
  pendingFilters: NexoyaContentFilter[];
  setPendingFilters: (filters: NexoyaContentFilter[]) => void;
  onNextStep: () => void;
}

const StepAddContents: FC<StepAddContentsProps> = ({
  selectedContentIds,
  setSelectedContentIds,
  selectedProviderIds,
  setSelectedProviderIds,
  selectedAccountIds,
  setSelectedAccountIds,
  selectedOptions,
  setSelectedOptions,
  pendingFilters,
  setPendingFilters,
  onNextStep,
}) => {
  const handleSubmit = () => {
    if (!selectedContentIds.length) {
      toast.warning('Please select at least one content');
      return;
    }
    onNextStep();
  };

  return (
    <>
      <div className="pr-6">
        <ContentSelectionV2
          selectedContentIds={selectedContentIds}
          setSelectedProviderIds={setSelectedProviderIds}
          selectedProviderIds={selectedProviderIds}
          setSelectedContentIds={setSelectedContentIds}
          selectedAccountIds={selectedAccountIds}
          setSelectedAccountIds={setSelectedAccountIds}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          pendingFilters={pendingFilters}
          setPendingFilters={setPendingFilters}
          allowMultipleProviderSelection
          excludePortfolioContents={true}
          configType="other"
        />
      </div>
      <SidePanelActions>
        <ButtonAsync
          id="addContentsBtn"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!selectedContentIds.length}
          style={{
            marginLeft: 'auto',
          }}
        >
          Add new contents and continue with assignments
        </ButtonAsync>
      </SidePanelActions>
    </>
  );
};

export default StepAddContents;
