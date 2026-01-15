import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaRoleDef } from 'types';

import { useTranslationsQuery } from 'graphql/translation/queryTranslations';

import translate from 'utils/translate';

import MenuList from '../../../components/ArrayMenuList';
import MenuItem from '../../../components/MenuItem';
import Button from 'components/Button';
import ButtonAdornment from 'components/ButtonAdornment';
import { useDropdownMenu } from 'components/DropdownMenu';
import Panel from 'components/Panel';
import SvgCaretDown from 'components/icons/CaretDown';

import { colorByKey } from '../../../theme/utils';

const StyledName = styled.p`
  text-align: left;
  color: ${colorByKey('white')};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: 24px;
`;
const StyledDescription = styled.p`
  text-align: left;
  color: ${colorByKey('blueyGrey')};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.6px;
  line-height: 18px;
`;

type Props = {
  allRoles: NexoyaRoleDef[];
  currentRoleName: string;
  onChange: (newRole: NexoyaRoleDef) => void;
};

/**
 * Component used to render a dropdown to select
 * team role values
 */
export function TeamRoleSelector({ allRoles, currentRoleName, onChange }: Props) {
  // hooks
  const { anchorEl, open, toggleMenu, closeMenu } = useDropdownMenu();
  const { data } = useTranslationsQuery();

  // state
  const translations = get(data, 'translations', []);

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        flat
        type="button"
        onClick={toggleMenu}
        active={open} // disabled={loading}
        endAdornment={
          <ButtonAdornment position="end">
            <SvgCaretDown
              style={{
                transform: `rotate(${open ? '180' : '0'}deg)`,
              }}
            />
          </ButtonAdornment>
        }
        style={{
          width: '100%',
          justifyContent: 'space-between',
        }}
        ref={anchorEl}
      >
        {translate(translations, currentRoleName)}
      </Button>
      <Panel
        open={open}
        color="dark"
        anchorEl={anchorEl.current}
        placement="bottom-start"
        style={{
          minWidth: 360,
          maxHeight: 500,
        }}
        popperProps={{
          style: {
            zIndex: 1301,
          },
        }}
      >
        <MenuList color="dark">
          {allRoles.map((roleDef) => (
            <MenuItem
              key={`role-def-${roleDef.name}`}
              data-cy={`role-def-${roleDef.name}`}
              style={{
                minWidth: 125,
              }}
              onClick={() => {
                if (roleDef.name !== currentRoleName) onChange(roleDef);
                closeMenu();
              }}
            >
              <StyledName>{translate(translations, roleDef.name)}</StyledName>
              <StyledDescription>{translate(translations, roleDef.description)}</StyledDescription>
            </MenuItem>
          ))}
        </MenuList>
      </Panel>
    </>
  );
}
