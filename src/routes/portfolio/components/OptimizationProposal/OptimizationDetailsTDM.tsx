import { toast } from 'sonner';
import styled from 'styled-components';

import MenuList from 'components/ArrayMenuList';
import ButtonIcon from 'components/ButtonIcon';
import { useMenu } from 'components/Menu';
import MenuItem from 'components/MenuItem';
import Panel from 'components/Panel';
import Spinner from 'components/Spinner';
import SvgEllipsisV from 'components/icons/EllipsisV';

type Props = {
  remove?: boolean;
  collectionId: string;
  isWorking: boolean;
  onConfirm: (collectionId: string) => void;
  contentTitle: string;
  callback?: () => void;
};
const ActionWrapStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SvgEllipsisVStyled = styled(SvgEllipsisV)`
  font-size: 18px;
`;

export function OptimizationDetailsTDM({ remove, collectionId, isWorking, onConfirm, contentTitle }: Props) {
  const { anchorEl, open, toggleMenu, closeMenu } = useMenu();
  return (
    <div ref={anchorEl}>
      <ActionWrapStyled>
        {isWorking ? (
          <div style={{ width: '36px' }}>
            <Spinner size="20px" />
          </div>
        ) : (
          <ButtonIcon onClick={toggleMenu} active={open} style={{ position: 'static' }}>
            <SvgEllipsisVStyled />
          </ButtonIcon>
        )}
      </ActionWrapStyled>
      <Panel
        anchorEl={anchorEl.current}
        open={open}
        onClose={closeMenu}
        placement="bottom-end"
        popperProps={{
          positionFixed: true,
          style: {
            zIndex: 2200,
          },
        }}
        style={{
          minWidth: 138,
          boxShadow: 'none',
        }}
      >
        <MenuList color="dark">
          <MenuItem
            onClick={() => {
              navigator.clipboard.writeText(contentTitle).then(() => toast.message('Copied to clipboard'));
              toggleMenu();
            }}
            color="dark"
          >
            Copy name to clipboard
          </MenuItem>
          <MenuItem
            onClick={() => {
              onConfirm(collectionId);
              toggleMenu();
            }}
            color="dark"
          >
            {remove ? 'Skip content from proposal application' : 'Add to proposal application'}
          </MenuItem>
        </MenuList>
      </Panel>
    </div>
  );
}
