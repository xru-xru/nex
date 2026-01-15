import React from 'react';

function useSearchController() {
  const [search, setSearch] = React.useState<string>('');
  return {
    search,
    setSearch,
  };
}

export default useSearchController;
