import React, { ReactNode } from 'react';

import styled from 'styled-components';

type Props = {
  children: ReactNode;
  stretch?: string;
  inline?: boolean;
  style?: Record<string, any>;
  className?: string;
};

interface WrapStyledFormGroupProps {
  stretch: string;
  inline: boolean;
}
const WrapStyled = styled.div<WrapStyledFormGroupProps>`
  display: flex;
  flex-direction: ${({ inline }) => (inline ? 'row' : 'column')};
  align-items: ${({ inline }) => (inline ? 'center' : 'inherit')};
  width: ${({ stretch }) => stretch};
  margin-bottom: 25px;
`;

const FormGroup = ({ children, stretch = '100%', inline = false, ...rest }: Props) => (
  <WrapStyled stretch={stretch} inline={inline} {...rest}>
    {children}
  </WrapStyled>
);

export default FormGroup;
