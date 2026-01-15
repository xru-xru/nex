import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { toast } from 'sonner';

import { NexoyaBudgetItem } from '../../../../types';

import { useTeam } from '../../../../context/TeamProvider';
import { useEditBudgetItemMutation } from '../../../../graphql/budget/mutationEditBudgetItem';

import { GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import ButtonAsync from '../../../../components/ButtonAsync';
import DialogTitle from '../../../../components/DialogTitle';
import SidePanel, { SidePanelActions, SidePanelContent } from '../../../../components/SidePanel';
import Text from '../../../../components/Text';

import { BudgetItemDetailsEdit } from './BudgetItemDetailsEdit';
import { areBudgetItemValuesEqual } from './utils';
import { toNumber } from 'lodash';
import DOMPurify from 'dompurify';

interface Props {
  portfolioId: number;
  start: Date | string;
  end: Date | string;
  isSidePanelOpen: boolean;
  closeSidePanel: () => void;
  budgetItem: NexoyaBudgetItem;
  onSuccess: (editBudgetItem: NexoyaBudgetItem) => void;
}

export const BudgetItemEdit = ({
  portfolioId,
  start,
  end,
  isSidePanelOpen,
  closeSidePanel,
  budgetItem,
  onSuccess,
}: Props) => {
  const { teamId } = useTeam();
  const { editBudgetItem, loading } = useEditBudgetItemMutation({
    portfolioId,
    start,
    end,
  });

  const [intermediateBudgetAmount, setIntermediateBudgetAmount] = useState<number | null>(null);
  const [lastBudgetNumber, setLastBudgetNumber] = useState<string | undefined>(budgetItem.budgetAmount?.toString());
  const [budgetItemState, setBudgetItemState] = useState<NexoyaBudgetItem | null>(budgetItem);

  useEffect(() => {
    if (!isSidePanelOpen) {
      setBudgetItemState(null);
      setLastBudgetNumber(null);
    }
  }, [isSidePanelOpen]);

  const handleChangeValueByKey = React.useCallback((ev: any) => {
    const { name, value } = ev.target;
    setBudgetItemState((s) => ({ ...s, [name]: value }));
  }, []);

  const { name, budgetAmount, startDate, endDate } = budgetItemState || {};

  const disableSubmit = () => {
    if (
      !budgetAmount ||
      !name ||
      !startDate ||
      !endDate ||
      loading ||
      intermediateBudgetAmount < budgetItemState?.spendSoFar
    ) {
      return true;
    }
  };

  const handleFinish = async () => {
    editBudgetItem({
      variables: {
        budgetItemId: budgetItem.budgetItemId,
        teamId: teamId,
        portfolioId: portfolioId,
        ...(areBudgetItemValuesEqual('name', budgetItem, budgetItemState)
          ? {}
          : {
              name: DOMPurify.sanitize(name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
            }),
        ...(areBudgetItemValuesEqual('endDate', budgetItem, budgetItemState)
          ? {}
          : { endDate: dayjs(endDate).utc().format(GLOBAL_DATE_FORMAT) }),
        ...(areBudgetItemValuesEqual('startDate', budgetItem, budgetItemState)
          ? {}
          : { startDate: dayjs(startDate).format(GLOBAL_DATE_FORMAT) }),
        ...(budgetItem.budgetAmount === toNumber(lastBudgetNumber) ? {} : { budgetAmount: toNumber(lastBudgetNumber) }),
      },
    })
      .then(() => {
        closeSidePanel();
        onSuccess(budgetItemState);
        setBudgetItemState(null);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  };

  return (
    <>
      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => {
          closeSidePanel();
          setLastBudgetNumber(null);
          setBudgetItemState(null);
        }}
        paperProps={{
          style: {
            width: 848,
            paddingBottom: '78px',
          },
        }}
        data-cy="budgetItemEditSidePanel"
      >
        <DialogTitle
          style={{
            padding: '20px 20px 20px 32px',
            boxShadow: '0px 1px 0px 0px rgba(42, 42, 50, 0.08)',
          }}
        >
          <Text component="h3">Edit budget item</Text>
        </DialogTitle>
        <SidePanelContent>
          <BudgetItemDetailsEdit
            portfolioId={portfolioId}
            start={start}
            end={end}
            budgetItemState={budgetItemState}
            handleChangeValueByKey={handleChangeValueByKey}
            lastBudgetNumber={lastBudgetNumber}
            setLastBudgetNumber={setLastBudgetNumber}
            intermediateBudgetAmount={intermediateBudgetAmount}
            setIntermediateBudgetAmount={setIntermediateBudgetAmount}
          />
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
            Save
          </ButtonAsync>
        </SidePanelActions>
      </SidePanel>
    </>
  );
};
