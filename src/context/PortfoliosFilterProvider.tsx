import React from 'react';

import usePortfoliosFilterController from '../controllers/PortfoliosFilterController';

const PortfoliosFilterContext = React.createContext<Record<string, any> | null>(null);

function PortfoliosFilterProvider(props: any) {
  const value = usePortfoliosFilterController();
  return <PortfoliosFilterContext.Provider value={value} {...props} />;
}

function withPortfolioFilterProvider(Component: any) {
  return (props: any) => (
    <PortfoliosFilterProvider>
      <Component {...props} />
    </PortfoliosFilterProvider>
  );
}

function usePortfoliosFilter(): Record<string, any> {
  const context = React.useContext(PortfoliosFilterContext);

  if (context === undefined) {
    throw new Error('usePortfoliosFilter must be used within a PortfoliosFilterProvider');
  }

  return context;
}

export { PortfoliosFilterProvider, usePortfoliosFilter, withPortfolioFilterProvider };
