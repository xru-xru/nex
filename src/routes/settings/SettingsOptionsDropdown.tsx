import { get } from 'lodash';

import { useTeamQuery } from '../../graphql/team/queryTeam';

import Button from '../../components/Button';
import ButtonIcon from '../../components/ButtonIcon';
import Dialog from '../../components/Dialog';
import useDialogState from '../../components/Dialog/useDialogState';
import DialogActions from '../../components/DialogActions';
import DialogContent from '../../components/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import Menu, { useDropdownMenu } from '../../components/DropdownMenu';
import MenuItem from '../../components/MenuItem';
import Typography from '../../components/Typography';
import SvgEllipsisV from '../../components/icons/EllipsisV';
import useUserStore from '../../store/user';

const SettingsOptionsDropdown = () => {
  const { data } = useTeamQuery({
    withMembers: true,
    withOrg: true,
  });
  const team = data?.team;
  const { user } = useUserStore();
  const { open, closeMenu, toggleMenu, anchorEl } = useDropdownMenu();
  const { isOpen, closeDialog, openDialog } = useDialogState({
    initialState: false,
  });
  return (
    <>
      <div
        ref={anchorEl}
        style={{
          marginRight: 12,
        }}
      >
        <ButtonIcon
          onClick={toggleMenu}
          style={{
            fontSize: 18,
          }}
        >
          <SvgEllipsisV />
        </ButtonIcon>
      </div>
      <Menu
        container={anchorEl.current}
        anchorEl={anchorEl.current}
        open={open}
        onClose={closeMenu}
        placement="bottom-end"
        color="dark"
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            openDialog();
          }}
        >
          Support
        </MenuItem>
      </Menu>
      <Dialog isOpen={isOpen} onClose={closeDialog}>
        <DialogTitle>
          <Typography variant="h2" component="h2">
            Support information
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              marginBottom: 15,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3
              style={{
                fontWeight: 'bold',
                borderBottom: '1px solid #eee',
                marginBottom: '10px',
                paddingBottom: '5px',
              }}
            >
              Organization
            </h3>
            <span>
              {get(team, 'organization.name', '')} (ID: {get(team, 'organization.org_id', 0)})
            </span>
          </div>
          <div
            style={{
              marginBottom: 15,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3
              style={{
                fontWeight: 'bold',
                borderBottom: '1px solid #eee',
                marginBottom: '10px',
                paddingBottom: '5px',
              }}
            >
              Team
            </h3>
            <span>
              {team?.name} (ID: {team?.team_id})
            </span>
          </div>
          <div
            style={{
              marginBottom: 15,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3
              style={{
                fontWeight: 'bold',
                borderBottom: '1px solid #eee',
                marginBottom: '10px',
                paddingBottom: '5px',
              }}
            >
              User
            </h3>
            <span>
              E-Mail: {user.email} (ID: {user.user_id})
            </span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsOptionsDropdown;
