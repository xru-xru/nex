import clsx from 'clsx';
import styled, { css } from 'styled-components';

import Button from '../Button';
import ButtonLoader from '../ButtonLoader';

type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: (ev: React.SyntheticEvent<HTMLButtonElement>) => any;
  className?: string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'dark' | 'danger';
  variant?: 'text' | 'contained';
  loading?: boolean;
  id?: string;
  style?: Record<string, unknown>;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYButtonAsync',
};

interface ButtonAsyncStyledProps {
  readonly loading?: boolean;
}

const ButtonAsyncStyled = styled(Button)<ButtonAsyncStyledProps>`
  position: relative;

  ${(
    { loading } // $FlowFixMe
  ) =>
    loading &&
    css`
      & > span span:first-child {
        opacity: 0;
        visibility: hidden;
      }

      & > span span:nth-child(2) {
        display: flex !important;
      }
    `}

  & > span span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }

  & > span span:nth-child(2) {
    display: none;
  }
`;

const ButtonAsync: React.FC<Props> = ({
  onClick,
  disabled = false,
  children,
  loading,
  color,
  variant,
  className,
  id,
  ref,
  ...rest
}) => {
  return (
    <ButtonAsyncStyled
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      color={color}
      variant={variant}
      className={clsx(className, classes.root)}
      id={id}
      ref={ref}
      {...rest}
    >
      <span>{children}</span>
      <ButtonLoader color={color} variant={variant} />
    </ButtonAsyncStyled>
  );
};

export default ButtonAsync;
