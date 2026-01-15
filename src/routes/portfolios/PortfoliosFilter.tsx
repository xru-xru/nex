import React from 'react';

import styled from 'styled-components';
import { useDebounce } from 'use-debounce';

import { usePortfoliosFilter } from '../../context/PortfoliosFilterProvider';

import Input from '../../components/Input';
import InputAdornment from '../../components/InputAdornment';
import SvgSearch from '../../components/icons/Search';

const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  .NEXYInputWrap {
    flex: 1;
    // margin-right: 8px;
  }
`;

const PortfoliosFilter = () => {
  const { search } = usePortfoliosFilter();
  const [inputSearch, setInputSearch] = React.useState(search.value || '');
  const [debounceSearch] = useDebounce(inputSearch, 250);

  function handleChange(ev: any) {
    const { value } = ev.currentTarget;
    setInputSearch(value);
  }

  React.useEffect(() => {
    if (search.value !== debounceSearch) {
      search.setSearch(debounceSearch);
    }
  }, [search, debounceSearch]);
  return (
    <>
      <WrapStyled className="wrapper">
        <Input
          data-cy="searchPortfoliosInput"
          type="search"
          value={inputSearch}
          placeholder="Search portfolios..."
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start">
              <SvgSearch />
            </InputAdornment>
          }
        />
      </WrapStyled>
    </>
  );
};

export default PortfoliosFilter;
