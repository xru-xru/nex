import React, { ErrorInfo, PureComponent, ReactNode } from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

import { getWithExpiry, setWithExpiry } from '../../utils/localStorage';

import { nexyColors } from '../../theme';
import Button from '../Button';
import Typography from '../Typography';
import SvgError from '../icons/Error';
import { PossibleFixDialog } from './PossibleFixDialog';

type Props = {
  children: ReactNode;
  className?: string;
};
type State = {
  error: Error | null;
  errorInfo: ErrorInfo;
  networkError: boolean;
};
export const classes = {
  root: 'NEXYError',
};
const WrapStyled = styled.div`
  text-align: center;

  svg {
    font-size: 40px;
    margin: 0 auto 10px auto;
  }

  .NEXYH3 {
    margin-bottom: 10px;
  }
`;
const ErrorValueWrapStyled = styled.pre`
  background: ${nexyColors.seasalt};
  padding: 7px;
  border-radius: 4px;
  width: auto;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid #eaeaea;
  font-size: 13px;
  max-height: 50px;
  overflow: auto;
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

class ErrorBoundary extends PureComponent<Props, State> {
  state = {
    error: null,
    errorInfo: null,
    networkError: false,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(error);
    this.setState({
      error,
      errorInfo,
    });

    console.error(errorInfo);
    // reload page on 'loading chunk # failed'
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (
      error?.message?.toLowerCase().includes('network') ||
      error?.message?.toLowerCase().includes('failed to fetch') ||
      error?.message?.toLowerCase().includes('apollo')
    ) {
      this.setState({ networkError: true });
    }

    if (error?.message && chunkFailedMessage.test(error.message)) {
      if (!getWithExpiry('chunk_failed')) {
        setWithExpiry('chunk_failed', 'true', 5000);
        window.location.reload();
      }
    }
  }

  handleClick = () => window.location.replace('/');

  render() {
    const { error, networkError } = this.state;
    const { children, className } = this.props;

    if (error) {
      return (
        <WrapStyled
          style={{
            textAlign: 'center',
          }}
          className={clsx(className, classes.root)}
        >
          <SvgError style={{ color: nexyColors.orangeyRed2 }} />
          <Typography variant="h3">Oops! Something went wrong.</Typography>

          <ErrorValueWrapStyled>{error.toString()}</ErrorValueWrapStyled>
          <br />
          <ButtonGroupStyled>
            <Button
              variant="contained"
              color={networkError ? 'secondary' : 'primary'}
              size="small"
              onClick={this.handleClick}
            >
              Reload the app
            </Button>
            {networkError ? <PossibleFixDialog /> : null}
          </ButtonGroupStyled>
        </WrapStyled>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
