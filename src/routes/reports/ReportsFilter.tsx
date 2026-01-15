import React from 'react';

import styled from 'styled-components';
import { useDebounce } from 'use-debounce';

import { useReportsFilter } from '../../context/ReportsFilterProvider';

import Input from '../../components/Input';
import InputAdornment from '../../components/InputAdornment';
import SvgSearch from '../../components/icons/Search';

const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;

  .NEXYInputWrap {
    flex: 1;
  }
`;

function ReportsFilter() {
  const { search } = useReportsFilter();
  // TODO: Code duplicated, how to extract it to a shared bit
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
    <WrapStyled>
      <Input
        type="search"
        placeholder="Search reports..."
        value={inputSearch}
        onChange={handleChange}
        data-cy="searchReportsInput"
        startAdornment={
          <InputAdornment position="start">
            <SvgSearch />
          </InputAdornment>
        }
      />
    </WrapStyled>
  );
}

export default ReportsFilter;
