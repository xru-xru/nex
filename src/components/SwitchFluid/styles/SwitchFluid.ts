import styled from 'styled-components';

import { colorByKey } from 'theme/utils';

export const Wrapper = styled.div<{
  readonly notAllowed?: boolean;
}>`
  display: inline-flex;
  background: #f5f6fc;
  padding: 2px;
  border-radius: 4px;
  vertical-align: middle;
  cursor: ${({ notAllowed }) => (notAllowed ? 'not-allowed' : 'pointer')};
`;

export const Left = styled.div`
  position: relative;
  padding: 3px 0 3px 3px;
  display: flex;
  align-items: center;
  z-index: 1;

  .content::before {
    content: ' ';
    position: absolute;
    transform: scaleX(0);
    transform-origin: right;
    top: 0;
    width: 100%;
    right: auto;
    bottom: 0;
    background: white;
    transition: transform 200ms;
    z-index: -1;
  }
  .content.active::before {
    content: ' ';
    position: absolute;
    transform: scaleX(1);
    top: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: -1;
    border-radius: 4px;
    box-shadow: 0 2px 3px 0 rgba(136, 138, 148, 0.15);
  }

  .content.active + span {
    color: ${colorByKey('raisinBlack')};
  }
  span {
    padding: 0 6px;
    color: ${colorByKey('blueGrey')};
  }
`;

export const Right = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px;
  z-index: 1;

  .content::before {
    content: ' ';
    position: absolute;
    width: 0;
    top: 0;
    left: 0;
    bottom: 0;
    background: white;
    transition: width 200ms;
    z-index: -1;
  }

  .content.active::before {
    content: ' ';
    position: absolute;
    width: calc(100% - 3px);
    left: auto;
    top: 0;
    bottom: 0;
    background: white;
    z-index: -1;
    border-radius: 4px;
    box-shadow: 0 2px 3px 0 rgba(136, 138, 148, 0.15);
  }

  .content.active + span {
    color: ${colorByKey('raisinBlack')};
  }
  span {
    padding: 0 6px;
    color: ${colorByKey('blueGrey')};
  }
`;
