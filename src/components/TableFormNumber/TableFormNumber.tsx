import React, { PureComponent } from 'react';

import { FetchResult } from '@apollo/client';
import { get } from 'lodash';
import styled, { css } from 'styled-components';

import { NexoyaDataType } from '../../types/types';

import validateNumberInput from './utils/validateNumberInput';

import theme from '../../theme/theme';

import ButtonIcon from '../ButtonIcon';
import InputBase from '../Form/InputBase';
import Spinner from '../Spinner';
import { DoneIcon } from '../icons';

type Props = {
  defaultValue: number | null | undefined;
  loading: boolean;
  name: string;
  onSubmit: (value: number) => Promise<FetchResult>;
  // Comment: I need the return value from mutation to update the component state
  placeholder: string;
  validationFunc?: (value: string) => boolean;
  datatype?: NexoyaDataType | null | undefined;
};
type State = {
  isEdited: boolean;
  value: string;
  cachedPropValue: number;
};
interface TableInputStyledTableFormNumberProps {
  isEdited: boolean;
}
const TableInputStyled = styled(InputBase)<TableInputStyledTableFormNumberProps>`
  text-align: center;
  box-shadow: ${({ isEdited, theme }) => (isEdited ? `0px 2px 0px ${theme.colors.primary}` : '0 1px 0 #d0cece')};
  transition: box-shadow 0.22s;

  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #d2d2d2;
  }
  &::-moz-placeholder {
    /* Firefox 19+ */
    color: #d2d2d2;
  }
  &:-ms-input-placeholder {
    /* IE 10+ */
    color: #d2d2d2;
  }
  &:-moz-placeholder {
    /* Firefox 18- */
    color: #d2d2d2;
  }

  &:focus {
    box-shadow: 0px 2px 0px ${({ theme }) => theme.colors.primary};
  }
`;
const ConfirmBtnStyled = styled(ButtonIcon)<TableInputStyledTableFormNumberProps>`
  position: absolute;
  right: -10px;
  top: -6px;
  transform: translateY(50%);
  opacity: 0;
  visibility: hidden;
  z-index: ${theme.layers.body};
  ${({ isEdited }) =>
    isEdited &&
    css`
      opacity: 1;
      visibility: visible;
    `}
`;
ConfirmBtnStyled.displayName = 'ConfirmBtnStyled';

const SUFFIX_SYMBOLS = ['%', 's', 'ms', '°C', 'km/h', 'mm', 'cm'];

class TableFormNumber extends PureComponent<Props, State> {
  state = {
    isEdited: false,
    value: String(this.props.defaultValue),
    cachedPropValue: this.props.defaultValue || 0, // This is to keep track of the original value in case we need to update on refetchQueries (then we don't know what the original original was)
  };
  input: any = React.createRef();

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.defaultValue !== prevState.cachedPropValue) {
      return {
        value: nextProps.defaultValue,
        cachedPropValue: nextProps.defaultValue,
      };
    }

    return null;
  }

  getCleanValue = (value: string): string => {
    return value.replace(' ', '').replace(get(this, 'props.datatype.symbol', ''), '');
  };
  // Comment: We want to show the placeholder if there is anything lower than 0.01 in the input or null.
  handleFocus = (ev: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;

    if (Number(this.getCleanValue(value)) === 0) {
      this.setState({
        value: '',
      });
    }
  };
  // TODO: Maybe needs to be extracted as an incoming prop. Leaving like this for speed of implementation.
  // Comment: We want to show '0' if there is no value in the input.
  handleBlur = (ev: any) => {
    if (!ev.currentTarget.contains(ev.relatedTarget)) {
      const { value } = this.input.current;

      if (this.getCleanValue(value) === '') {
        this.setState({
          value: '0',
        });
      } else {
        this.setState({
          value: this.getCleanValue(String(this.state.cachedPropValue)),
          isEdited: false,
        });
      }
    }
  };
  handleChange = (ev: React.SyntheticEvent<HTMLInputElement>) => {
    const { defaultValue, validationFunc } = this.props;
    const { value } = ev.currentTarget;
    const cleanValue = this.getCleanValue(value);
    const isValid = typeof validationFunc === 'function' ? validationFunc(cleanValue) : validateNumberInput(cleanValue);

    if (isValid) {
      this.setState({
        value: this.getCleanValue(String(cleanValue)),
        isEdited: Number(defaultValue) !== Number(cleanValue),
      });
    }
  };
  handleSubmit = async (ev: React.SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const { onSubmit } = this.props;
    const { value } = this.state;

    // TODO: Come back to this and make sure this becomes easier for later developers. At the moment, it is not the most straight forward API.
    // Comment: we are expecting the higher component will do the action needed for on submit. We only pass value and expect return value.
    if (typeof onSubmit === 'function') {
      const result = await onSubmit(Number(this.getCleanValue(value)));

      // TODO: This needs to be checked if case of an error the "results" doesn't cast to true
      // Comment: we need to remove "isEdited" sate after success mutation;
      if (result) {
        this.setState({
          isEdited: false,
          value,
        });
      }
    }
  };

  render() {
    const { placeholder, name, loading, datatype } = this.props;
    const { value, isEdited } = this.state;
    const symbol = get(datatype, 'symbol', '');
    return (
      <div
        className="NEXYTableFormNumber"
        onBlur={this.handleBlur}
        style={{
          display: 'flex',
        }}
      >
        {!SUFFIX_SYMBOLS.includes(symbol) ? (
          <p
            style={{
              marginTop: '7px',
            }}
          >
            {symbol === 'USD' ? '$' : symbol}
          </p>
        ) : null}
        <form onSubmit={this.handleSubmit}>
          <TableInputStyled
            disabled={loading}
            isEdited={isEdited}
            name={name}
            //@ts-ignore
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            placeholder={placeholder}
            showPlaceholder
            type="text"
            value={value}
            ref={this.input}
          />
        </form>
        {SUFFIX_SYMBOLS.includes(symbol) ? (
          <p
            style={{
              marginTop: '7px',
            }}
          >
            {symbol}
          </p>
        ) : null}
        <ConfirmBtnStyled
          color="primary"
          variant="contained"
          type="submit" // there was conflict with onBlur event and onClick (ordering of execution)
          // so onClick didn't execute this.handleSubmit correctly
          // resolved as per suggestion here https://stackoverflow.com/questions/17769005/onclick-and-onblur-ordering-issue
          onMouseDown={this.handleSubmit}
          isEdited={isEdited}
        >
          {loading ? <Spinner size="15px" variant="light" /> : <DoneIcon />}
        </ConfirmBtnStyled>
      </div>
    );
  }
}

export default TableFormNumber;
