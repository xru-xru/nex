import styled from 'styled-components';

import { useContentFilter } from '../../../context/ContentFilterProvider';

import SearchField from '../../SearchField';

const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  padding: 2px;

  .NEXYInputWrap {
    flex: 1;
    margin-right: 8px;
  }
`;

function InputSearchFilter() {
  //@ts-ignore
  const { search } = useContentFilter();
  return (
    <>
      <WrapStyled>
        <SearchField
          value={search.value}
          onChange={search.onChange}
          placeholder="Search content..."
          data-cy="searchContentField"
        />
      </WrapStyled>
    </>
  );
}

export default InputSearchFilter;
