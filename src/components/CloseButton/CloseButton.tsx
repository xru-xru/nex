import clsx from 'clsx';
import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import { CancelIcon } from '../icons';

type Props = {
  onClose?: (ev: React.SyntheticEvent<any>, type: string) => void;
  className?: string;
};
const classes = {
  root: 'NEXYCloseButton',
};
const CloseButtonStyled = styled.div`
  padding: 16px;
  font-size: 12px;
  color: ${colorByKey('lightPeriwinkle')};
  z-index: 1;

  cursor: pointer;
  position: absolute;
  right: 0;
  transition: background 0.3s ease;
  border-bottom-left-radius: 6px;

  &:hover {
    background: rgba(223, 225, 237, 0.25);
  }
`;

const CloseButton = ({ onClose, className }: Props) => {
  return (
    <CloseButtonStyled
      className={clsx(className, classes.root)}
      // @ts-ignore
      onClick={onClose}
      data-cy="closeBtn"
    >
      <CancelIcon />
    </CloseButtonStyled>
  );
};

export default CloseButton;
