import React from 'react';

import styled from 'styled-components';

type Props = {
  children?: any;
};
type BoxProps = {
  ref?: any;
  alignItems?: string;
  justifyContent?: string;
  flexWrap?: string;
  flexDirection?: string;
  textAlign?: string;
};

// TODO expand this with time as usage dictates
const Box = styled.div<BoxProps>`
  display: flex;
  align-items: ${({ alignItems }) => (alignItems ? alignItems : '')};
  justify-content: ${({ justifyContent }) => (justifyContent ? justifyContent : '')};
  flex-wrap: ${({ flexWrap }) => (flexWrap ? flexWrap : '')};
  flex-direction: ${({ flexDirection }) => (flexDirection ? flexDirection : '')};
`;

const Flex = React.forwardRef<Props, any>(function Flex(props, ref) {
  const { children, ...rest } = props;
  return (
    <Box ref={ref as any} {...rest}>
      {children}
    </Box>
  );
});

export default Flex;
