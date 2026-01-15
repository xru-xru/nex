import React from 'react';

import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';

import usePresenterMode from '../../hooks/usePresenterMode';

import Menu, { useDropdownMenu } from '../DropdownMenu';
import MenuItem from '../MenuItem';
import ContextMenuIcon from '../icons/EllipsisV';
import DeleteCustomKpi from './DeleteCustomKpi';
import EditCustomKpiMeta from './EditCustomKpiMeta';

type Props = {
  kpi: NexoyaMeasurement;
};
const ContextMenuIconStyled = styled(ContextMenuIcon)`
  font-size: 16px;
  line-height: 35px;
  margin: 0 10px;
  cursor: pointer;
`;
const MenuStyled = styled(Menu)`
  top: 15px;
`;

function ContextEditMenu({ kpi }: Props) {
  const { anchorEl, open, toggleMenu, closeMenu } = useDropdownMenu();
  const [isEditPanelOpen, setIsEditPanelOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { isPresenterMode } = usePresenterMode();
  if (isPresenterMode) return null;
  return (
    <div ref={anchorEl} data-cy="editMenu">
      {/*
      // @ts-ignore */}
      <ContextMenuIconStyled onClick={toggleMenu} />
      <MenuStyled
        anchorEl={anchorEl.current}
        container={anchorEl.current}
        open={open}
        onClose={closeMenu}
        placement="bottom-end"
        color="dark"
      >
        <MenuItem
          style={{
            minWidth: 125,
          }}
          onClick={() => {
            setIsEditPanelOpen(true);
            closeMenu();
          }}
          data-cy="editKpi"
        >
          Edit KPI
        </MenuItem>
        <MenuItem
          style={{
            minWidth: 125,
          }}
          onClick={() => {
            setIsDeleteDialogOpen(true);
            closeMenu();
          }}
          data-cy="deleteKpi"
        >
          Delete KPI
        </MenuItem>
      </MenuStyled>
      <EditCustomKpiMeta kpi={kpi} isEditPanelOpen={isEditPanelOpen} closeEditPanel={setIsEditPanelOpen} />
      <DeleteCustomKpi kpi={kpi} isDeleteDialogOpen={isDeleteDialogOpen} closeDeleteDialog={setIsDeleteDialogOpen} />
    </div>
  );
}

export default ContextEditMenu;
