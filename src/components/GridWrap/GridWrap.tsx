import React, { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import styled, { css } from 'styled-components';

type Props = {
  className?: string;
  gridTemplateColumns?: string;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYGridWrap',
};
interface WrapStyledGridWrapProps {
  gridTemplateColumns?: string;
  showShadow?: boolean;
}
const WrapStyled = styled.div<WrapStyledGridWrapProps>`
  display: grid;
  overflow-x: auto;
  padding-bottom: 25px;

  ${(props) =>
    props.gridTemplateColumns
      ? css`
          .NEXYCSSGrid {
            //min-width: 100%;
            grid-template-columns: ${props.gridTemplateColumns};
          }
        `
      : undefined}
`;
const ShadowWrapper = styled.div<WrapStyledGridWrapProps>`
  box-shadow: ${({ showShadow }) => (showShadow ? 'inset -7px 0 9px -7px rgba(0,0,0,0.4)' : 'none')};
  transition: 0.2s box-shadow;
`;

function GridWrap({ gridTemplateColumns, className, ...rest }: Props) {
  const scrollContainerRef = useRef();
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    checkScroll();
    // @ts-ignore
    scrollContainerRef?.current?.addEventListener('scroll', checkScroll);
    // @ts-ignore
    return () => scrollContainerRef?.current?.removeEventListener('scroll', checkScroll);
  }, [scrollContainerRef]);

  const checkScroll = () => {
    // @ts-ignore
    const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
    const shadowNeeded = scrollWidth > clientWidth;
    setShowShadow(shadowNeeded && scrollLeft < scrollWidth - clientWidth);
  };
  return (
    <ShadowWrapper showShadow={showShadow}>
      <WrapStyled
        ref={scrollContainerRef}
        // showShadow={showShadow}
        gridTemplateColumns={gridTemplateColumns}
        className={clsx(className, classes.root)}
        {...rest}
      />
    </ShadowWrapper>
  );
}

export default GridWrap;
