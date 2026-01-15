import { Dispatch, SetStateAction } from 'react';

import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useTeam } from '../../../../context/TeamProvider';
import { useCreateBudgetItemMutation } from '../../../../graphql/budget/mutationCreateBudgetItem';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import { GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import ButtonAsync from '../../../../components/ButtonAsync';
import { useDialogState } from '../../../../components/Dialog';
import DialogTitle from '../../../../components/DialogTitle';
import SidePanel, { SidePanelActions, SidePanelContent } from '../../../../components/SidePanel';
import Text from '../../../../components/Text';
import VerticalStepper from '../../../../components/VerticalStepper';

import { BUDGET_ITEM_CREATION_STEPS } from '../../../../configs/budget';
import { BudgetItemDetailsCreate } from './BudgetItemDetailsCreate';
import BudgetItemSuccessCreateDialog from './BudgetItemSuccessCreateDialog';
import { useBudgetItemStore } from '../../../../store/budget-item';
import { StepperWrapper, StepWrapper } from '../../../portfolios/CreatePortfolio';
import DOMPurify from 'dompurify';

interface Props {
  portfolioId: number;
  start: Date | string;
  end: Date | string;
  budgetItemDrawerOpen: boolean;
  setBudgetItemDrawerOpen: Dispatch<SetStateAction<boolean>>;
}
export const BudgetItemCreate = ({ portfolioId, start, end, budgetItemDrawerOpen, setBudgetItemDrawerOpen }: Props) => {
  const { teamId } = useTeam();
  const { isOpen, openDialog, closeDialog } = useDialogState({
    initialState: false,
  });
  const { createBudgetItem, loading } = useCreateBudgetItemMutation({ portfolioId, start, end });

  const {
    budgetItemState: { name, startDate, endDate, budgetAmount, pacing },
    lastBudgetNumber,
    budgetItemState,
    resetState,
  } = useBudgetItemStore();

  const disableSubmit = () => {
    if (!budgetAmount || !name || !startDate || !endDate || !pacing || loading) {
      return true;
    }
  };

  const handleFinish = async () => {
    const variables = {
      teamId: teamId,
      portfolioId: portfolioId,
      name: DOMPurify.sanitize(name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
      pacing,
      budgetAmount: parseFloat(lastBudgetNumber),
      endDate: dayjs(endDate).utc().format(GLOBAL_DATE_FORMAT),
      startDate: dayjs(startDate).format(GLOBAL_DATE_FORMAT),
    };
    createBudgetItem({
      variables,
    })
      .then(() => {
        setBudgetItemDrawerOpen(false);
        openDialog();
        track(EVENT.ADD_BUDGET_ITEM, variables);
      })
      .catch((e) => toast.error(e.message));
  };

  return (
    <>
      <SidePanel
        isOpen={budgetItemDrawerOpen}
        onClose={() => {
          setBudgetItemDrawerOpen(false);
          resetState();
        }}
        paperProps={{
          style: {
            width: 'calc(100% - 218px)',
            paddingBottom: '78px',
          },
        }}
        data-cy="createPortfolioDialog"
      >
        <DialogTitle
          style={{
            paddingBottom: '48px',
          }}
        >
          <Text component="h3">Add a new budget item</Text>
        </DialogTitle>
        <SidePanelContent>
          <StepperWrapper>
            <VerticalStepper current={1} steps={BUDGET_ITEM_CREATION_STEPS} data-cy="budgetItemCreationSteps" />
          </StepperWrapper>
          <StepWrapper>
            <BudgetItemDetailsCreate portfolioId={portfolioId} start={start} end={end} />
          </StepWrapper>
        </SidePanelContent>
        <SidePanelActions>
          <ButtonAsync
            id="next"
            variant="contained"
            color="primary"
            loading={loading}
            disabled={disableSubmit()}
            onClick={handleFinish}
            style={{
              marginLeft: 'auto',
            }}
          >
            Finish
          </ButtonAsync>
        </SidePanelActions>
      </SidePanel>
      <BudgetItemSuccessCreateDialog
        onClose={() => {
          resetState();
          closeDialog();
        }}
        budgetItem={{ ...budgetItemState, name: name }}
        isOpen={isOpen}
        onStartNewProcess={() => {
          resetState();
          closeDialog();
          setTimeout(() => setBudgetItemDrawerOpen(true), 400);
        }}
      />
    </>
  );
};
