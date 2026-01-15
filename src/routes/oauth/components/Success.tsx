import styled, { keyframes } from 'styled-components';

import SvgCheck from '../../../components/icons/Check';

const SuccessWrapStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 25px;

  h3 {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 10px;
  }
`;
const checkmark = keyframes`
    0% {
      stroke-dashoffset: 228.619;
    }
    100% {
      stroke-dashoffset: 0;
      stroke: #10a7ee;
    }
`;
const CheckAnimStyled = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;

  svg {
    font-size: 100px;
    stroke-width: 6px;
  }

  path {
    stroke: #10a7ee;
    stroke-dasharray: 228.619;
    stroke-dashoffset: 228.619;
    animation: ${checkmark} 0.75s ease;
    animation-fill-mode: forwards;
  }
`;

function Success() {
  return (
    <SuccessWrapStyled>
      <CheckAnimStyled>
        <SvgCheck />
      </CheckAnimStyled>
      <h3>Done!</h3>
      <p>You can now close this window</p>
    </SuccessWrapStyled>
  );
}

export default Success;
