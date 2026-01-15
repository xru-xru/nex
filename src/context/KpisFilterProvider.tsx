import React from 'react';

import useKpiFilterController, { KpiFilterController } from '../hooks/useKpiFilterController';

const KpisFilterContext = React.createContext<KpiFilterController>(null);

function KpisFilterProvider2(props: any) {
  const value = useKpiFilterController();
  return <KpisFilterContext.Provider value={value} {...props} />;
}

function withKpisFilterProvider(Component: any) {
  return (props: any) => (
    <KpisFilterProvider2>
      <Component {...props} />
    </KpisFilterProvider2>
  );
}

function useKpisFilter(): Record<string, any> {
  const context = React.useContext(KpisFilterContext);

  if (context === undefined) {
    throw new Error('useKpisFilter: must be used within <KpisFilter Provider />');
  }

  return context;
}

export { KpisFilterProvider2, withKpisFilterProvider, useKpisFilter };
