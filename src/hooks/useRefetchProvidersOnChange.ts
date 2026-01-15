import React from 'react';

import { useProvidersQuery } from '../graphql/provider/queryProviders';

function useRefetchProvidersOnChange(changeValue: any): void {
  const _mounted = React.useRef<boolean>(false);

  const { refetch: refetchProviders } = useProvidersQuery();
  React.useEffect(() => {
    if (_mounted.current) {
      refetchProviders();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeValue]);
  React.useEffect(() => {
    if (!_mounted.current) {
      _mounted.current = true;
    }
  }, []);
}

export { useRefetchProvidersOnChange };
