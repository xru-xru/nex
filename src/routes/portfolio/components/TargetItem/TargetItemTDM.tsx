import React from 'react';

import dayjs from 'dayjs';
import { toast } from 'sonner';

import { NexoyaPortfolioTargetItem, NexoyaTargetItemStatus } from '../../../../types';

import { useTeam } from '../../../../context/TeamProvider';
import { useDeleteTargetItemMutation } from '../../../../graphql/target/mutationDeleteTargetItem';
import { useEndTargetItemMutation } from '../../../../graphql/target/mutationEndTargetItem';

import { useDialogState } from '../../../../components/Dialog';
import MenuList from 'components/ArrayMenuList';
import ButtonIcon from 'components/ButtonIcon';
import { useMenu } from 'components/Menu';
import MenuItem from 'components/MenuItem';
import Panel from 'components/Panel';
import SvgEllipsisV from 'components/icons/EllipsisV';

import { TargetItemDeleteDialog } from './TargetItemDeleteDialog';
import { TargetItemEdit } from './TargetItemEdit';
import { TargetItemEndDialog } from './TargetItemEndDialog';
import { TargetItemSuccessEditDialog } from './TargetItemSuccessEditDialog';

interface Props {
  portfolioId: number;
  targetItem: NexoyaPortfolioTargetItem;
  setEditedTargetItem: (editedTargetItem: NexoyaPortfolioTargetItem) => void;
  editedTargetItem: NexoyaPortfolioTargetItem;
}

export function TargetItemTDM({ portfolioId, targetItem, setEditedTargetItem, editedTargetItem }: Props) {
  const { anchorEl: anchorElTDM, open: openTDM, toggleMenu: toggleMenuTDM, closeMenu: closeMenuTDM } = useMenu();
  const { teamId } = useTeam();
  const { deleteTargetItem, loading: deleteTargetItemLoading } = useDeleteTargetItemMutation({
    portfolioId,
  });
  const { endTargetItem, loading: endTargetItemLoading } = useEndTargetItemMutation({ portfolioId });
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
    isOpen: isEndTargetItemDialogOpen,
    openDialog: openEndTargetItemDialog,
    closeDialog: closeEndTargetItemDialog,
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
          <MenuItem key="edit-target-item" onClick={() => openEdit()}>
            Edit
          </MenuItem>
          {(targetItem?.status === NexoyaTargetItemStatus.Active ||
            targetItem?.status === NexoyaTargetItemStatus.ActiveNoOptimization) &&
          dayjs(targetItem?.start).isBefore(dayjs()) ? (
            <MenuItem key="end-target-item" onClick={() => openEndTargetItemDialog()}>
              End
            </MenuItem>
          ) : null}
          <MenuItem key="delete-target-item" onClick={() => openDialog()}>
            Delete
          </MenuItem>
        </MenuList>
      </Panel>
      {isEditOpen ? (
        <TargetItemEdit
          targetItem={targetItem}
          portfolioId={portfolioId}
          isSidePanelOpen={isEditOpen}
          closeSidePanel={closeEdit}
          onSuccess={(editedTargetItem) => {
            setEditedTargetItem(editedTargetItem);
            openSuccessDialog();
          }}
        />
      ) : null}
      <TargetItemEndDialog
        loading={endTargetItemLoading}
        targetItem={targetItem}
        isOpen={isEndTargetItemDialogOpen}
        onClose={closeEndTargetItemDialog}
        handleEnd={() => {
          endTargetItem({
            variables: {
              targetItemId: targetItem.targetItemId,
              portfolioId,
              teamId,
            },
          })
            .then(() => {
              closeEndTargetItemDialog();
              toast.message('Target item has been ended', {
                description: 'This does not affect the actual spending on your advertising channels.',
              });
            })
            .catch(() => {
              toast.error('An error occurred while ending the target item');
            });
        }}
      />
      <TargetItemDeleteDialog
        loading={deleteTargetItemLoading}
        handleDelete={() => {
          deleteTargetItem({
            variables: {
              targetItemId: targetItem.targetItemId,
              teamId,
              portfolioId,
            },
          })
            .then(() => {
              closeDialog();
              toast.success('The target item has been deleted');
            })
            .catch(() => {
              closeDialog();
              toast.error('An error occurred while deleting the target item');
            });
        }}
        targetItem={targetItem}
        isOpen={isOpen}
        onClose={closeDialog}
      />
      {isSuccessDialogOpen ? (
        <TargetItemSuccessEditDialog
          editedTargetItem={editedTargetItem}
          isOpen={isSuccessDialogOpen}
          onClose={closeSuccessDialog}
        />
      ) : null}
    </div>
  );
}
