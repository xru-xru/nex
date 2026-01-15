import React from 'react';

import dayjs from 'dayjs';
import { toast } from 'sonner';

import { NexoyaBudgetItem, NexoyaBudgetItemStatus } from '../../../../types';

import { useTeam } from '../../../../context/TeamProvider';
import { useDeleteBudgetItemMutation } from '../../../../graphql/budget/mutationDeleteBudgetItem';
import { useEndBudgetItemMutation } from '../../../../graphql/budget/mutationEndBudgetItem';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';

import { useDialogState } from '../../../../components/Dialog';
import MenuList from 'components/ArrayMenuList';
import ButtonIcon from 'components/ButtonIcon';
import { useMenu } from 'components/Menu';
import MenuItem from 'components/MenuItem';
import Panel from 'components/Panel';
import SvgEllipsisV from 'components/icons/EllipsisV';

import { BudgetItemDeleteDialog } from './BudgetItemDeleteDialog';
import { BudgetItemEdit } from './BudgetItemEdit';
import { BudgetItemEndDialog } from './BudgetItemEndDialog';
import { BudgetItemSuccessEditDialog } from './BudgetItemSuccessEditDialog';

interface Props {
  portfolioId: number;
  budgetItem: NexoyaBudgetItem;
  start: Date;
  end: Date;
  setEditedBudgetItem: (editedBudgetItem: NexoyaBudgetItem) => void;
  editedBudgetItem: NexoyaBudgetItem;
}

export function BudgetItemTDM({ portfolioId, start, end, budgetItem, setEditedBudgetItem, editedBudgetItem }: Props) {
  const { anchorEl: anchorElTDM, open: openTDM, toggleMenu: toggleMenuTDM, closeMenu: closeMenuTDM } = useMenu();
  const { teamId } = useTeam();
  const { deleteBudgetItem, loading: deleteBudgetItemLoading } = useDeleteBudgetItemMutation({
    portfolioId,
    start,
    end,
  });
  const { endBudgetItem, loading: endBudgetItemLoading } = useEndBudgetItemMutation({ portfolioId, start, end });
  const { isOpen, openDialog, closeDialog } = useDialogState({
    initialState: false,
  });
  const {
    isOpen: isSuccessDialogOpen,
    openDialog: openSuccessDialog,
    closeDialog: closeSuccessDialog,
  } = useDialogState({
    initialState: false,
  });
  const {
    isOpen: isEndBudgetItemDialogOpen,
    openDialog: openEndBudgetItemDialog,
    closeDialog: closeEndBudgetItemDialog,
  } = useDialogState({
    initialState: false,
  });
  const {
    isOpen: isEditOpen,
    openDialog: openEdit,
    closeDialog: closeEdit,
  } = useDialogState({
    initialState: false,
  });

  return (
    <div ref={anchorElTDM} style={{ display: 'flex', justifyContent: 'flex-end', justifySelf: 'flex-end' }}>
      <ButtonIcon
        active={openTDM}
        onClick={(e) => {
          e.stopPropagation();
          toggleMenuTDM();
        }}
      >
        <SvgEllipsisV
          style={{
            fontSize: 18,
          }}
        />
      </ButtonIcon>
      <Panel
        container={anchorElTDM.current}
        anchorEl={anchorElTDM.current}
        open={openTDM}
        onClose={closeMenuTDM}
        placement="bottom-end"
        style={{
          minWidth: 138,
        }}
      >
        <MenuList color="dark">
          <MenuItem key="edit-budget-item" onClick={() => openEdit()}>
            Edit
          </MenuItem>
          {budgetItem?.status === NexoyaBudgetItemStatus.Active ||
          (budgetItem?.status === NexoyaBudgetItemStatus.ActiveNoOptimization &&
            dayjs(budgetItem?.startDate).isBefore(dayjs())) ? (
            <MenuItem key="end-budget-item" onClick={() => openEndBudgetItemDialog()}>
              End
            </MenuItem>
          ) : null}
          <MenuItem key="delete-budget-item" onClick={() => openDialog()}>
            Delete
          </MenuItem>
        </MenuList>
      </Panel>
      {isEditOpen ? (
        <BudgetItemEdit
          budgetItem={budgetItem}
          portfolioId={portfolioId}
          start={start}
          end={end}
          isSidePanelOpen={isEditOpen}
          closeSidePanel={closeEdit}
          onSuccess={(editedBudgetItem) => {
            setEditedBudgetItem(editedBudgetItem);
            track(EVENT.UPDATE_BUDGET_ITEM, {
              portfolioId,
              editedBudgetItem,
            });
            openSuccessDialog();
          }}
        />
      ) : null}
      <BudgetItemEndDialog
        loading={endBudgetItemLoading}
        budgetItem={budgetItem}
        isOpen={isEndBudgetItemDialogOpen}
        onClose={closeEndBudgetItemDialog}
        handleEnd={() => {
          endBudgetItem({
            variables: {
              budgetItemId: budgetItem.budgetItemId,
              portfolioId,
              teamId,
            },
          })
            .then(() => {
              closeEndBudgetItemDialog();
              track(EVENT.END_BUDGET_ITEM, {
                budgetItemId: budgetItem.budgetItemId,
                portfolioId,
              });
              toast.message('Budget item has been ended', {
                description: 'This does not affect the actual spending on your advertising channels.',
              });
            })
            .catch(() => {
              toast.error('An error occurred while ending the budget item');
            });
        }}
      />
      <BudgetItemDeleteDialog
        loading={deleteBudgetItemLoading}
        handleDelete={() => {
          deleteBudgetItem({
            variables: {
              budgetItemId: budgetItem.budgetItemId,
              teamId,
              portfolioId,
            },
          })
            .then(() => {
              closeDialog();
              toast.success('The budget item has been deleted');
              track(EVENT.REMOVE_BUDGET_ITEM, {
                budgetItemId: budgetItem.budgetItemId,
                portfolioId,
              });
            })
            .catch(() => {
              closeDialog();
              toast.error('An error occurred while deleting the budget item');
            });
        }}
        budgetItem={budgetItem}
        isOpen={isOpen}
        onClose={closeDialog}
      />
      {isSuccessDialogOpen ? (
        <BudgetItemSuccessEditDialog
          editedBudgetItem={editedBudgetItem}
          isOpen={isSuccessDialogOpen}
          onClose={closeSuccessDialog}
        />
      ) : null}
    </div>
  );
}
