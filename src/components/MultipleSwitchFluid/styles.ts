import styled from 'styled-components';

import { colorByKey } from 'theme/utils';

export const Wrapper = styled.div<{
  readonly notAllowed?: boolean;
}>`
  display: inline-flex;
  background: rgba(227, 228, 232, 0.4);
  padding: 2px;
  border-radius: 5px;
  vertical-align: middle;
  cursor: ${({ notAllowed }) => (notAllowed ? 'not-allowed' : 'pointer')};
`;

export const Section = styled.div<{ active?: boolean }>`
  position: relative;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  z-index: 1;
  border-radius: 5px;
  transition: all 0.15s ease;

  background: ${({ active }) => (active ? 'white' : '')};
  box-shadow: ${({ active }) => (active ? '0px 2px 4px 0px rgba(54, 55, 59, 0.11)' : '')};
  span {
    color: ${({ active }) => (active ? '#2A2A32' : colorByKey('coolGray'))};
  }
`;
