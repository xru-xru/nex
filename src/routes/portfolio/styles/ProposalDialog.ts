import styled from 'styled-components';

import Dialog from 'components/Dialog';
import DialogActions from 'components/DialogActions';
import DialogContent from 'components/DialogContent';

import { colorByKey } from 'theme/utils';

export const DialogStyled = styled(Dialog)<{
  readonly isSuccess?: boolean;
}>`
  .NEXYPaper {
    width: ${({ isSuccess }) => (isSuccess ? '550px' : '610px')};
    height: ${({ isSuccess }) => (isSuccess ? '420px' : '330px')};
  }
  .NEXYFormControl {
    width: 100%;
  }
`;
export const DialogActionsStyled = styled(DialogActions)`
  background: ${colorByKey('ghostWhite')};
`;

export const DialogContentStyled = styled(DialogContent)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const DialogTitleStyled = styled.div`
  font-size: 18px;
  padding: 32px;
`;

export const NoteStyled = styled.div`
  font-size: 16px;
  margin-top: 16px;
  color: ${colorByKey('cloudyBlue')};
`;
export const SuccessNoteStyled = styled.div`
  ${NoteStyled};
  display: flex;
  flex-direction: column;
  text-align: center;

  h3 {
    color: ${colorByKey('black')};
    font-size: 32px;
    font-weight: 400;
    margin: 10px 0 20px;
  }
  div {
    font-size: 16px;
    color: #8a8c9e;
    font-weight: 400;
  }
  button {
    margin-top: 20px;
  }
`;
