import styled from 'styled-components';

export default styled.fieldset`
  border: none;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;
