import styled from 'styled-components';

import { useCollections } from '../../../context/CollectionsProvider';

import SearchField from '../../../components/SearchField';

const WrapStyled = styled.div`
  margin-top: 24px;

  .NEXYInputWrap {
    width: 100%;
  }
`;

function ProviderSearchField() {
  const { search } = useCollections();

  function handleSearchChange(value: string) {
    search.setSearch(value);
  }

  return (
    <WrapStyled>
      <SearchField value={search.value || ''} onChange={handleSearchChange} placeholder="Search channels..." />
    </WrapStyled>
  );
}

export default ProviderSearchField;
