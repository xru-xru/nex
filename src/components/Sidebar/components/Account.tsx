import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { track } from '../../../constants/datadog';
import { EVENT } from '../../../constants/events';
import { userInitials } from '../../../utils/user';

import { PATHS } from '../../../routes/paths';

import { sizes } from '../../../theme/device';
import { colorByKey } from '../../../theme/utils';

import auth from '../../../Auth/Auth';
import AvatarUser from '../../AvatarUser';
import ButtonBase from '../../ButtonBase';
import ListItemIcon from '../../ListItemIcon';
import { LaptopLUp } from '../../MediaQuery';
import { useMenu } from '../../Menu';
import Typography from '../../Typography';
import { IntegrationIcon } from '../../icons';
import SvgCog from '../../icons/Cog';
import { useSidebar } from '../../../context/SidebarProvider';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components-ui/DropdownMenu';
import { LogOut, SquareArrowOutUpRight } from 'lucide-react';
import useUserStore from '../../../store/user';
import useOrganizationStore from '../../../store/organization';

const ButtonBaseStyled = styled(ButtonBase)`
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  letter-spacing: 0.4px;

  color: ${colorByKey('blueyGrey')};

  margin-top: 16px;
  padding: 12px 8px !important;

  &:hover {
    color: ${colorByKey('charcoalGrey')};
    background: #f4f4f6;
  }
`;

const AvatarUserStyled = styled(AvatarUser)`
  background: #e3e4e8;
  span {
    font-size: 12px;
  }

  @media (max-width: ${sizes.laptopL}px) {
    margin-right: 0;
  }
`;

const UserInfoContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 8px;
  font-size: 14px;
  p {
    color: #666;
    font-weight: 400;
    margin-top: 4px;
    line-height: 1.2;
  }
`;

const UserInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledTypography = styled(Typography)`
  color: #b0b1bd;
  font-weight: 400;
  font-size: 12px;
  max-width: 130px;
`;

function Account() {
  const { anchorEl, toggleMenu } = useMenu();
  const { isCollapsed } = useSidebar();
  const { customization, organization } = useOrganizationStore();
  const { user } = useUserStore();

  function handleLogOut() {
    // TODO: Auth should be used through react hook.
    auth.logout();
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonBaseStyled ref={anchorEl} onClick={toggleMenu} data-cy="accountTopBarBtn">
          <AvatarUserStyled
            style={{ marginRight: isCollapsed ? 0 : 8 }}
            size={32}
            email={user.email}
            fallback={userInitials(user)}
            data-cy="userAvatarIcon"
          />
          <LaptopLUp>
            <UserInfoStyled>
              <Typography style={{ color: '#41424e', fontSize: 13 }}>
                {user.firstname} {user.lastname}
              </Typography>
              <StyledTypography>{user.email}</StyledTypography>
            </UserInfoStyled>
          </LaptopLUp>
        </ButtonBaseStyled>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg border border-[#E4E4E7] bg-white text-neutral-600 shadow-lg"
        side="right"
        align="end"
        sideOffset={-4}
        alignOffset={32}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="gap-2 text-left text-sm">
            <UserInfoContainerStyled>
              <p>
                {user.firstname} {user.lastname}
              </p>
              <p style={{ color: '#b0b1bd', fontWeight: 400 }}>{user.email}</p>
            </UserInfoContainerStyled>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-100" />
        <DropdownMenuGroup>
          <Link
            to={PATHS.APP.SETTINGS_INTEGRATIONS}
            onClick={() => {
              track(EVENT.ROUTE_SETTINGS_INTEGRATIONS);
              toggleMenu();
            }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <DropdownMenuItem className="focus:!bg-seasalt">
              <ListItemIcon>
                <IntegrationIcon />
              </ListItemIcon>
              Integrations
            </DropdownMenuItem>
          </Link>
          <Link
            to={PATHS.APP.SETTINGS}
            onClick={() => {
              track(EVENT.ROUTE_SETTINGS);
              toggleMenu();
            }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <DropdownMenuItem className="focus:!bg-seasalt">
              <ListItemIcon>
                <SvgCog />
              </ListItemIcon>
              Settings
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-neutral-100" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={() => window.open(customization?.helpPageUrl, '_blank')}
            className="focus:!bg-seasalt"
          >
            <ListItemIcon>
              <SquareArrowOutUpRight className="h-3.5 w-3.5" />
            </ListItemIcon>
            Help page
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-neutral-100" />
        <DropdownMenuItem onSelect={handleLogOut} className="focus:!bg-seasalt">
          <ListItemIcon>
            <LogOut className="h-3.5 w-3.5" />
          </ListItemIcon>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Account;
