import styled from 'styled-components';

import { NexoyaSimulationState } from '../../../../types';

import MenuList from 'components/ArrayMenuList';
import ButtonIcon from 'components/ButtonIcon';
import { useMenu } from 'components/Menu';
import MenuItem from 'components/MenuItem';
import Panel from 'components/Panel';
import Spinner from 'components/Spinner';
import SvgEllipsisV from 'components/icons/EllipsisV';
import dayjs from 'dayjs';
import useUserStore from '../../../../store/user';

const ActionWrapStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SvgEllipsisVStyled = styled(SvgEllipsisV)`
  font-size: 18px;
`;

interface Props {
  loading: boolean;
  simulationId: number;
  state: NexoyaSimulationState;
  isArchived: boolean;
  endDate: string;
  monitoringUrl?: string;
  handleStart?: () => void;
  handleExplore?: (simulationId: number) => void;
  handleEdit?: (simulationId: number) => void;
  handleArchive?: () => void;
  handleSetMonitorLink?: () => void;
  handleChangeVisibility: () => void;
  onlyVisibleToSupportUsers: boolean;
}

export function SimulationTDM({
  loading,
  simulationId,
  isArchived,
  handleStart,
  handleExplore,
  handleEdit,
  handleArchive,
  handleSetMonitorLink,
  handleChangeVisibility,
  onlyVisibleToSupportUsers,
  monitoringUrl,
  state,
  endDate,
}: Props) {
  const { anchorEl, open, toggleMenu, closeMenu } = useMenu();
  const isEndDateInThePast = dayjs(endDate).isBefore(dayjs());

  const { isSupportUser } = useUserStore();

  return (
    <div ref={anchorEl}>
      <ActionWrapStyled>
        {loading ? (
          <div style={{ width: '36px' }}>
            <Spinner size="20px" />
          </div>
        ) : (
          <ButtonIcon
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
            active={open}
            style={{ position: 'static' }}
          >
            <SvgEllipsisVStyled />
          </ButtonIcon>
        )}
      </ActionWrapStyled>
      <Panel
        container={anchorEl.current}
        anchorEl={anchorEl.current}
        open={open}
        onClose={closeMenu}
        placement="bottom-end"
        style={{
          minWidth: 138,
        }}
      >
        <MenuList color="dark">
          {state === NexoyaSimulationState.Pending ? (
            <MenuItem
              key="start-simulation"
              onClick={(e) => {
                e.stopPropagation();
                handleStart();
                closeMenu();
              }}
              color="dark"
            >
              Start simulation
            </MenuItem>
          ) : null}
          {state !== NexoyaSimulationState.Running && state !== NexoyaSimulationState.Pending ? (
            <MenuItem
              key="explore-simulation"
              onClick={(e) => {
                e.stopPropagation();
                handleExplore(simulationId);
                closeMenu();
              }}
              color="dark"
            >
              Explore simulation
            </MenuItem>
          ) : null}
          <MenuItem
            key="edit-simulation"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(simulationId);
              toggleMenu();
            }}
            color="dark"
          >
            Edit
          </MenuItem>
          {state !== NexoyaSimulationState.Running && !isArchived ? (
            <MenuItem
              key="archive-simulation"
              onClick={(e) => {
                e.stopPropagation();
                handleArchive();
                closeMenu();
              }}
              color="dark"
            >
              Archive
            </MenuItem>
          ) : null}
          {isArchived && !isEndDateInThePast ? (
            <MenuItem
              key="unarchive-simulation"
              onClick={(e) => {
                e.stopPropagation();
                handleArchive();
                closeMenu();
              }}
              color="dark"
            >
              Unarchive
            </MenuItem>
          ) : null}
          {monitoringUrl ? (
            <MenuItem
              key="monitor-simulation"
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
                window.open(monitoringUrl, '_blank');
              }}
              color="dark"
            >
              Monitor simulation
            </MenuItem>
          ) : null}
          {isSupportUser ? (
            <MenuItem
              key="set-monitor-link"
              color="dark"
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
                handleSetMonitorLink();
              }}
            >
              Set monitor link
            </MenuItem>
          ) : null}
          {onlyVisibleToSupportUsers && isSupportUser ? (
            <MenuItem
              key="toggle-visibility"
              color="dark"
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
                handleChangeVisibility();
              }}
            >
              Make visible to all users
            </MenuItem>
          ) : null}
        </MenuList>
      </Panel>
    </div>
  );
}
