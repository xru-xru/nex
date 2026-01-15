import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 124px;
  padding: 24px;
  overflow: hidden;
  background-color: ${colorByKey('paleGrey40')};
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: ${colorByKey('paleGrey40')};

  & > div {
    background-color: ${colorByKey('paleGrey')};
    border-radius: 4px;
    width: 39px;
    height: 11px;
  }

  & > div:first-child {
    margin-bottom: 24px;
  }

  & > div:nth-child(2) {
    width: 80px;
    height: 20px;
    margin-bottom: 12px;
  }
`;

function EmptyCardPlaceholder() {
  return (
    <WrapperStyled>
      <div />
      <div />
      <div />
    </WrapperStyled>
  );
}

export default EmptyCardPlaceholder;
