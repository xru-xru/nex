import styled from 'styled-components';

import Dialog from '../../../../components/Dialog';
import DialogActions from '../../../../components/DialogActions';

import { nexyColors } from '../../../../theme';

export const DialogStyled = styled(Dialog)`
  border-radius: 12px !important;
  border: 1px solid red !important;
`;

export const DialogContentStyled = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const DialogHeaderStyled = styled.div`
  box-shadow: 0 1px 0 0 rgba(42, 42, 50, 0.08);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
`;

export const DialogTitle = styled.h3`
  color: ${nexyColors.neutral900};
  display: flex;
  align-items: center;
  gap: 8px;

  /* Headings/H3 */
  font-size: 20px;
  font-weight: 500;
  line-height: 120%; /* 24px */
  letter-spacing: -0.1px;
`;

export const DialogSubtitleStyled = styled.div`
  color: rgba(19, 19, 19, 0.7);
  font-size: 14px;
  font-weight: 400;
  line-height: 145%; /* 20.3px */
`;

export const DialogActionsStyled = styled(DialogActions)`
  box-shadow: 1px -1px 0 0 rgba(42, 42, 50, 0.08);
  padding: 20px 24px;
  gap: 16px;
`;

export const DateSelectorWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .NEXYButtonLabel {
    width: 100%;
  }
`;

export const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const ErrorStatusWrapper = styled.div<{ skipped: boolean }>`
  border-radius: 5px;
  border: 1px solid #eaeaea;
  background: #fdf5fa;
  padding: 8px;
  font-weight: 400;
  display: flex;
  gap: 6px;
  align-items: flex-start;
  white-space: pre-line;

  text-decoration: ${({ skipped }) => (skipped ? 'line-through' : 'unset')};
`;
export const StatusWrapperStyled = styled.div`
  border-radius: 5px;
  border: 1px solid #eaeaea;
  background: #fafafa;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StatusesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DatepickerLabelStyled = styled.div`
  color: ${nexyColors.neutral900};
  font-size: 14px;
  letter-spacing: 0.28px;
`;
