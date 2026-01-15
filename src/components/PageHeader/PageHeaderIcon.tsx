import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  children: any;
  className?: string;
};
export const classes = {
  root: 'NEXYPageHeaderIcon',
};
const WrapStyled = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  margin-right: 12px;

  svg {
    font-size: 32px;
  }
`;

function PageHeaderIcon({ className, children, ...rest }: Props) {
  return (
    <WrapStyled data-cy="pageHeaderIcon" className={clsx(className, classes.root)} {...rest}>
      {children}
    </WrapStyled>
  );
}

export default PageHeaderIcon;
