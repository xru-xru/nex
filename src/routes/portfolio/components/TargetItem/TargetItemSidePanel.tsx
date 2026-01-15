import React from 'react';

import dayjs from 'dayjs';
import { useTeam } from '../../../../context/TeamProvider';
import { useCreateTargetItemMutation } from '../../../../graphql/target/mutationCreateTargetItem';

import { GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import ButtonAsync from '../../../../components/ButtonAsync';
import { useDialogState } from '../../../../components/Dialog';
import DialogTitle from '../../../../components/DialogTitle';
import SidePanel, { SidePanelActions, SidePanelContent } from '../../../../components/SidePanel';
import Text from '../../../../components/Text';
import VerticalStepper from '../../../../components/VerticalStepper';

import { TARGET_ITEM_CREATION_STEPS } from '../../../../configs/target';
import { StepperWrapper, StepWrapper } from '../../../portfolios/CreatePortfolio';
import { TargetItemDetailsCreate } from './TargetItemDetailsCreate';
import TargetItemSuccessDialog from './TargetItemSuccessDialog';
import { toNumber } from 'lodash';
import { useTargetItemStore } from '../../../../store/target-item';

interface Props {
  portfolioId: number;
  targetItemDrawerOpen: boolean;
  setTargetItemDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const TargetItemSidePanel = ({ portfolioId, targetItemDrawerOpen, setTargetItemDrawerOpen }: Props) => {
  const { teamId } = useTeam();
  const { isOpen, openDialog, closeDialog } = useDialogState({
    initialState: false,
  });
  const { createTargetItem, loading } = useCreateTargetItemMutation({ portfolioId });

  const {
    targetItemState: { targetItemName, start, end, value, maxBudget },
    lastTargetNumber,
    lastMaxBudgetNumber,
    targetItemState,
    resetState,
  } = useTargetItemStore();

  const disabled = () => {
    if (!targetItemName || !start || !end || !value || !maxBudget || loading) {
      return true;
    }
  };

  const handleFinish = async () => {
    createTargetItem({
      variables: {
        teamId: teamId,
        portfolioId: portfolioId,
        name: targetItemName,
        value: toNumber(lastTargetNumber) || value,
        maxBudget: toNumber(lastMaxBudgetNumber),
        end: dayjs(end).utc().format(GLOBAL_DATE_FORMAT),
        start: dayjs(start).format(GLOBAL_DATE_FORMAT),
      },
    }).then(() => {
      setTargetItemDrawerOpen(false);
      openDialog();
    });
  };

  return (
    <>
      <SidePanel
        isOpen={targetItemDrawerOpen}
        onClose={() => {
          setTargetItemDrawerOpen(false);
          resetState();
        }}
        paperProps={{
          style: {
            width: '60%',
            paddingBottom: '78px',
          },
        }}
        data-cy="createPortfolioDialog"
      >
        <DialogTitle
          style={{
            padding: '20px 20px 20px 24px',
            boxShadow: '0px 1px 0px 0px rgba(42, 42, 50, 0.08)',
          }}
        >
          <Text component="h3">Add a new target item</Text>
        </DialogTitle>
        <SidePanelContent>
          <StepperWrapper>
            <VerticalStepper current={1} steps={TARGET_ITEM_CREATION_STEPS} data-cy="targetItemCreationSteps" />
          </StepperWrapper>
          <StepWrapper>
            <TargetItemDetailsCreate portfolioId={portfolioId} />
          </StepWrapper>
        </SidePanelContent>
        <SidePanelActions>
          <ButtonAsync
            id="next"
            variant="contained"
            color="primary"
            disabled={disabled()}
            onClick={handleFinish}
            loading={loading}
            style={{
              marginLeft: 'auto',
            }}
          >
            Finish
          </ButtonAsync>
        </SidePanelActions>
      </SidePanel>
      <TargetItemSuccessDialog
        onClose={() => {
          resetState();
          closeDialog();
        }}
        targetItem={{
          ...targetItemState,
          name: targetItemName,
          maxBudget: lastMaxBudgetNumber,
          value: lastTargetNumber || value,
        }}
        isOpen={isOpen}
        onStartNewProcess={() => {
          resetState();
          closeDialog();
          setTimeout(() => setTargetItemDrawerOpen(true), 400);
        }}
      />
    </>
  );
};
