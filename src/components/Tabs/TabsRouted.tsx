import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import useReactRouterQuery from '../../hooks/useReactRouterQuery';

import { TabsProvider } from './useTabs';

interface Props {
  defaultTab: string;
  children: any;
  allowedTabs?: string[];
}
const TabsRouted = ({ defaultTab, children, allowedTabs = [], ...rest }: Props) => {
  const history = useHistory();
  const location = useLocation();
  const { query, stringifyUpdatedQuery } = useReactRouterQuery('tab');
  const isAllowed = allowedTabs.some((t) => t === query);
  const tab = query && isAllowed ? query : defaultTab;
  const setTab = React.useCallback(
    (nextTab) => {
      if (typeof nextTab === 'string') {
        history.push(`${location.pathname}?${stringifyUpdatedQuery(nextTab)}`);
      }
    },
    [history, location, stringifyUpdatedQuery]
  );
  return (
    <TabsProvider defaultTab={defaultTab} controlledTab={tab} controlledSetTab={setTab} {...rest}>
      {children}
    </TabsProvider>
  );
};

export default TabsRouted;
