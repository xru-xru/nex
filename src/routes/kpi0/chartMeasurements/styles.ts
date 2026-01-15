import styled, { css } from 'styled-components';

import theme from '../../../theme/theme';

type WrapType = {
  readonly transitionState: 'entering' | 'entered' | 'exited' | 'exiting';
};
export const OverlayWrapStyled = styled.div<WrapType>`
  position: absolute;
  z-index: ${theme.layers.body};
  top: 0;
  left: 0
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.4);
  display: flex;
  justify-content: center;
  transition: opacity 0.3s;

  ${({ transitionState }) => {
    if (transitionState === 'entering' || transitionState === 'entered')
      return css`
        opacity: 1;
      `;
    if (transitionState === 'exited' || transitionState === 'exiting')
      return css`
        opacity: 0;
      `;
    return '';
  }};
`;
export const InnerWrapStyled = styled.div<WrapType>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 500px;
  transform: translateZ(0);
  transition: filter 0.2s, transform 0.3s;

  ${({ transitionState }: any) => {
    if (transitionState === 'entering' || transitionState === 'entered')
      return css`
        filter: blur(0);
        transform: scale(1);
      `;
    if (transitionState === 'exited' || transitionState === 'exiting')
      return css`
        filter: blur(5px);
        transform: scale(0.9);
      `;
    return '';
  }};

  h3 {
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 24px;
  }

  p {
    text-align: center;
    max-width: 400px;
    margin-bottom: 25px;
  }
`;
