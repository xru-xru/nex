import React from 'react';

import { NumberParam, useQueryParams } from 'use-query-params';

import { PaginationTypes } from 'types';

import ButtonAdornment from 'components/ButtonAdornment';
import { useMenu } from 'components/Menu';
import MenuItem from 'components/MenuItem';
import MenuList from 'components/MenuList';
import Panel from 'components/Panel';
import SvgCaretDown from 'components/icons/CaretDown';

import * as Styles from './styles/Pagination';

import { init, paginationReducer } from './PaginationReducer';

const resultsNum = [50, 100, 150] as const;

type Props = {
  onArrowClick: (e: PaginationTypes) => void;
  onResultNumChange: (e: number) => void;
  incrementDisabled?: boolean;
  decrementDisabled?: boolean;
  reset?: boolean;
  style?: Record<string, unknown>;
};

function Pagination({ onArrowClick, onResultNumChange, incrementDisabled, decrementDisabled, reset, style }: Props) {
  const [queryParams] = useQueryParams({
    searchPg: NumberParam,
    offset: NumberParam,
  });
  const initialState = {
    page: queryParams.searchPg || 1,
    offset: queryParams.offset || 50,
  };
  const [state, dispatch] = React.useReducer(paginationReducer, initialState, init);
  const { page, offset } = state;
  const { anchorEl, open, toggleMenu } = useMenu();
  React.useEffect(
    () => {
      if (reset) {
        dispatch({
          type: 'reset',
          payload: initialState,
        });
      }
    },
    // eslint-disable-next-line
    [reset]
  );
  const ButtonEndAdornment = (
    <ButtonAdornment position="end">
      <SvgCaretDown
        style={{
          transform: `rotate(180deg)`,
        }}
      />
    </ButtonAdornment>
  );
  function handleDecrement() {
    if (!decrementDisabled) {
      onArrowClick(PaginationTypes.DECREMENT);
      dispatch({ type: PaginationTypes.DECREMENT });
    }
  }
  function handleIncrement() {
    if (!incrementDisabled) {
      onArrowClick(PaginationTypes.INCREMENT);
      dispatch({ type: PaginationTypes.INCREMENT });
    }
  }
  function changeOffset(resultNo: typeof resultsNum[number]) {
    dispatch({
      type: PaginationTypes.NUMERATION,
      offset: resultNo,
    });
    onResultNumChange(resultNo);
    toggleMenu();
  }
  return (
    <Styles.Wrapper style={style}>
      <Styles.Dropdown>
        Results per page
        <Styles.ButtonStyled
          variant="contained"
          size="small"
          color="secondary"
          flat
          type="button"
          endAdornment={ButtonEndAdornment}
          ref={anchorEl}
          onClick={toggleMenu}
        >
          {offset}
        </Styles.ButtonStyled>
        <Panel
          open={open}
          anchorEl={anchorEl.current}
          placement="bottom-start"
          popperProps={{
            enableScheduleUpdate: true,
            style: {
              zIndex: 1305,
            },
          }}
        >
          <MenuList>
            {resultsNum.map((resultNo) => (
              <MenuItem key={resultNo} onClick={() => changeOffset(resultNo)}>
                {resultNo}
              </MenuItem>
            ))}
          </MenuList>
        </Panel>
      </Styles.Dropdown>
      <Styles.Arrows>
        <div>
          {page === 1 ? 1 : (page - 1) * offset}-{page * offset}
        </div>
        <Styles.SvgChevronDownStyled disabled={decrementDisabled} onClick={handleDecrement} />
        <Styles.SvgChevronDownStyled right disabled={incrementDisabled} onClick={handleIncrement} />
      </Styles.Arrows>
    </Styles.Wrapper>
  );
}

export default Pagination;
