import React from 'react';

interface TabsContextValue {
  tab: string;
  setTab: (arg0: ((arg0: string) => string) | string) => void;
}
interface TabsProviderProps {
  defaultTab: string;
  controlledTab?: string;
  controlledSetTab?: (arg0: ((arg0: string) => string) | string) => void;
  value?: TabsContextValue;
  children: any;
}
const TabsContext = React.createContext<TabsContextValue | void>(undefined);

function TabsProvider({ defaultTab, controlledTab, controlledSetTab, ...rest }: TabsProviderProps) {
  const [tab, setTab] = React.useState(defaultTab);
  const value = React.useMemo(() => {
    return {
      tab: controlledTab || tab,
      setTab: controlledSetTab || setTab,
    };
  }, [controlledTab, controlledSetTab, tab]);
  return <TabsContext.Provider value={value} {...rest} />;
}

function useTabs() {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('useTabs must be used with a TabsProvider');
  }

  const { setTab: setTabCtx, tab } = context;
  const setTab = React.useCallback((nextTab: string) => setTabCtx(nextTab), [setTabCtx]);
  return {
    tab,
    setTab,
  };
}

export { TabsProvider, useTabs };
