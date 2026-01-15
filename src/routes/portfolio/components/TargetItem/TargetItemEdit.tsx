import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import { toast } from "sonner";

import { NexoyaPortfolioTargetItem } from "../../../../types";

import { useTeam } from "../../../../context/TeamProvider";
import { useEditTargetItemMutation } from "../../../../graphql/target/mutationEditTargetItem";

import { GLOBAL_DATE_FORMAT } from "../../../../utils/dates";

import ButtonAsync from "../../../../components/ButtonAsync";
import DialogTitle from "../../../../components/DialogTitle";
import SidePanel, { SidePanelActions, SidePanelContent } from "../../../../components/SidePanel";
import Text from "../../../../components/Text";

import { TargetItemDetailsEdit } from "./TargetItemDetailsEdit";
import { areTargetItemValuesEqual } from "./utils";
import { toNumber } from "lodash";

interface Props {
  portfolioId: number;
  isSidePanelOpen: boolean;
  closeSidePanel: () => void;
  targetItem: NexoyaPortfolioTargetItem;
  onSuccess: (editTargetItem: NexoyaPortfolioTargetItem) => void;
}

export const TargetItemEdit = ({ portfolioId, isSidePanelOpen, closeSidePanel, targetItem, onSuccess }: Props) => {
  const { teamId } = useTeam();
  const { editTargetItem, loading } = useEditTargetItemMutation({
    portfolioId,
  });

  const [intermediateTargetAmount, setIntermediateTargetAmount] = useState<number | null>(null);
  const [lastTargetNumber, setLastTargetNumber] = useState<string | undefined>(targetItem.value?.toString());
  const [lastMaxBudgetNumber, setLastMaxBudgetNumber] = useState<string | undefined>(targetItem.value?.toString());
  const [targetItemState, setTargetItemState] = useState<NexoyaPortfolioTargetItem | null>(targetItem);

  useEffect(() => {
    if (!isSidePanelOpen) {
      setTargetItemState(null);
      setLastTargetNumber(null);
    }
  }, [isSidePanelOpen]);

  const handleChangeValueByKey = React.useCallback((ev: any) => {
    const { name, value } = ev.target;
    setTargetItemState((s) => ({ ...s, [name]: value }));
  }, []);

  const { name, value, start, end } = targetItemState || {};

  const disableSubmit = () => {
    // @ts-ignore
    if (!value || !name || !start || !end || loading || intermediateTargetAmount < targetItemState?.spendSoFar) {
      return true;
    }
  };

  const handleFinish = async () => {
    editTargetItem({
      variables: {
        targetItemId: targetItem.targetItemId,
        teamId: teamId,
        portfolioId: portfolioId,
        ...(areTargetItemValuesEqual('name', targetItem, targetItemState) ? {} : { name }),
        ...(areTargetItemValuesEqual('end', targetItem, targetItemState)
          ? {}
          : { end: dayjs(end).utc().format(GLOBAL_DATE_FORMAT) }),
        ...(areTargetItemValuesEqual('start', targetItem, targetItemState)
          ? {}
          : { start: dayjs(start).format(GLOBAL_DATE_FORMAT) }),
        ...(targetItem.value === toNumber(lastTargetNumber) ? {} : { value: toNumber(lastTargetNumber) }),
        ...(targetItem.maxBudget === toNumber(lastMaxBudgetNumber) ? {} : { maxBudget: toNumber(lastMaxBudgetNumber) }),
      },
    })
      .then(() => {
        closeSidePanel();
        onSuccess(targetItemState);
        setTargetItemState(null);
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
          setLastTargetNumber(null);
          setTargetItemState(null);
        }}
        paperProps={{
          style: {
            width: 848,
            paddingBottom: '78px',
          },
        }}
        data-cy="targetItemEditSidePanel"
      >
        <DialogTitle
          style={{
            padding: '20px 20px 20px 32px',
            boxShadow: '0px 1px 0px 0px rgba(42, 42, 50, 0.08)',
          }}
        >
          <Text component="h3">Edit target item</Text>
        </DialogTitle>
        <SidePanelContent>
          <TargetItemDetailsEdit
            portfolioId={portfolioId}
            targetItemState={targetItemState}
            handleChangeValueByKey={handleChangeValueByKey}
            lastTargetNumber={lastTargetNumber}
            setLastTargetNumber={setLastTargetNumber}
            intermediateTargetAmount={intermediateTargetAmount}
            setIntermediateTargetAmount={setIntermediateTargetAmount}
            setLastMaxBudgetNumber={setLastMaxBudgetNumber}
            lastMaxBudgetNumber={lastMaxBudgetNumber}
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
