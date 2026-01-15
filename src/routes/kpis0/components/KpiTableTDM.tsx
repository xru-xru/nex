import styled from 'styled-components';

import { copyToClipboard } from 'utils/helpers';

import MenuList from 'components/ArrayMenuList';
import ButtonAdornment from 'components/ButtonAdornment';
import ButtonIcon from 'components/ButtonIcon';
import { useMenu } from 'components/Menu';
import MenuItem from 'components/MenuItem';
import Panel from 'components/Panel';
import SvgCloneRegular from 'components/icons/CloneRegular';
import SvgEllipsisV from 'components/icons/EllipsisV';

type Props = {
  collectionId: string | number;
};
const ActionWrapStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SvgEllipsisVStyled = styled(SvgEllipsisV)`
  font-size: 18px;
`;

function KpiTableTDM({ collectionId }: Props) {
  const { anchorEl, open, toggleMenu, closeMenu } = useMenu();
  return (
    <div ref={anchorEl}>
      <ActionWrapStyled>
        <ButtonIcon onClick={toggleMenu} active={open}>
          <SvgEllipsisVStyled />
        </ButtonIcon>
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
          <MenuItem
            onClick={() => {
              copyToClipboard(collectionId);
              toggleMenu();
            }}
            buttonProps={{
              startAdornment: (
                <ButtonAdornment position="start">
                  <SvgCloneRegular />
                </ButtonAdornment>
              ),
            }}
            color="dark"
          >
            Copy ID
          </MenuItem>
        </MenuList>
      </Panel>
    </div>
  );
}

export default KpiTableTDM;
