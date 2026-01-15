import React from 'react';

import styled from 'styled-components';
import { BooleanParam, NumberParam, StringParam, useQueryParams } from 'use-query-params';

import { useKpisFilter } from '../../../context/KpisFilterProvider';

import { colorByKey } from '../../../theme/utils';

import SearchField from '../../SearchField';
import Switch from '../../Switch';

type Props = {
  includeSearch?: boolean;
  saveToParams?: boolean;
};

const WrapStyled = styled.div`
  display: flex;
  align-items: center;

  .NEXYInputWrap {
    flex: 1;
    margin-right: 8px;
  }
`;

const StyledWarning = styled.div`
  margin-top: 12px;
  color: ${({ theme }: any) => theme.colors.warning};
`;
const TextStyled = styled.span`
  margin: 0 15px 0 10px;
  color: ${colorByKey('cloudyBlue')};
`;

function InputSearchFilter({ includeSearch = false, saveToParams }: Props) {
  const { search, sum } = useKpisFilter();
  React.useEffect(() => {
    // when we activate extended search and the search all is not already on
    if (includeSearch && sum.value) {
      sum.toggle();
    }
  }, [includeSearch, sum]);

  const [queryParams, setQueryParams] = useQueryParams({
    search: StringParam,
    sum: BooleanParam,
    searchPg: NumberParam,
  });
  const queryParamSearch = saveToParams ? queryParams.search || '' : search.value;

  React.useEffect(() => {
    if (saveToParams) {
      search.onChange(queryParamSearch);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParamSearch]);

  React.useEffect(() => {
    if (saveToParams) {
      if (queryParams.sum !== undefined) {
        sum.set(queryParams.sum);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.sum]);

  function handleSearchChange(str: string) {
    search.onChange(str);

    if (saveToParams) {
      setQueryParams({
        search: str,
        searchPg: null,
      });
    }
  }

  return (
    <>
      <WrapStyled>
        <SearchField
          value={queryParamSearch}
          onChange={handleSearchChange}
          placeholder="Search metrics..."
          data-cy="metricsSearchField"
        />
        <TextStyled>Search all</TextStyled>
        <Switch
          onToggle={() => {
            if (saveToParams) {
              setQueryParams({
                sum: !sum.value,
              });
            }

            sum.toggle();
          }}
          isOn={!sum.value}
          disabled={includeSearch}
          data-cy="searchAllSwitch"
        />
      </WrapStyled>
      {includeSearch && !search.value ? (
        <StyledWarning>Since you selected automatic KPI update, please enter a search term</StyledWarning>
      ) : null}
    </>
  );
}

export default InputSearchFilter;
