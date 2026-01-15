import React from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import Typography from '../Typography';

type Props = {
  label: string;
  content: any;
  icon?: any;
  className?: string;
};
export const classes = {
  root: 'NEXYHeaderBrick',
};
const WrapStyled = styled.div`
  display: flex;
  align-items: center;
`;
const IconWrapStyled = styled.div`
  margin-right: 12px;
`;
const NameWrapStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    display: block;
  }
`;
const HeaderBrick = React.forwardRef<Props, any>(function HeaderBrick(props, ref) {
  const { label, content, icon, className, ...rest } = props;
  return (
    <WrapStyled ref={ref} className={clsx(className, classes.root)} {...rest}>
      {icon ? <IconWrapStyled>{icon}</IconWrapStyled> : null}
      <NameWrapStyled>
        <Typography component="span">{label}</Typography>
        <Typography variant="h4" component="span">
          {content}
        </Typography>
      </NameWrapStyled>
    </WrapStyled>
  );
});
export default HeaderBrick;
