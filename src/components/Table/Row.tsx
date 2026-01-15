import styled from 'styled-components';
import { nexyColors } from '../../theme';

export const Row = styled.div<{ isSortable?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ isSortable }) => (isSortable ? nexyColors.seasalt : 'inherit')};
    cursor: ${({ isSortable }) => (isSortable ? 'pointer' : 'default')};
    border-radius: 5px;
    transition: all 0.2s;
  }
`;
