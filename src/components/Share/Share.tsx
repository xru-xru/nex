import styled from 'styled-components';

import { ShareItemTypes } from '../../types/types.custom';

import { colorByKey } from '../../theme/utils';

import Button from '../Button';
import ButtonAdornment from '../ButtonAdornment';
import { useDialogState } from '../Dialog';
import SvgShare from '../icons/Share';
import ShareDialog from './ShareDialog';

interface Props {
  itemId: number;
  type: ShareItemTypes;
}
const ButtonStyled = styled(Button)`
  &:hover path {
    fill: ${colorByKey('greenTeal4')};
  }
`;

function Share({ type, itemId }: Props) {
  const { isOpen, toggleDialog } = useDialogState();
  return (
    <>
      <ButtonStyled
        color="secondary"
        variant="contained"
        onClick={toggleDialog}
        startAdornment={
          <ButtonAdornment position="start">
            <SvgShare />
          </ButtonAdornment>
        }
      >
        Share
      </ButtonStyled>
      <ShareDialog isOpen={isOpen} toggleDialog={toggleDialog} type={type} itemId={itemId} />
    </>
  );
}

export default Share;
