import { NexoyaTeamMember } from 'types';

import Menu, { useDropdownMenu } from '../../../components/DropdownMenu';
import MenuItem from '../../../components/MenuItem';
import ButtonIcon from 'components/ButtonIcon';
import SvgEllipsisV from 'components/icons/EllipsisV';

type Props = {
  member: NexoyaTeamMember;
  onDelete: (member: NexoyaTeamMember) => void;
};

/**
 * Component used to render an elipsis button with
 * a dropdown menu with all available actions for a team member.
 */
export function TeamMemberOptionsMenu({ member, onDelete }: Props) {
  // hooks
  const { open, closeMenu, toggleMenu, anchorEl } = useDropdownMenu();

  return (
    <>
      <div
        ref={anchorEl}
        style={{
          marginLeft: 12,
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
          color="danger"
          onClick={() => {
            onDelete(member);
            closeMenu();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
