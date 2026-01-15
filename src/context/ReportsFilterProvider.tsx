import React from 'react';

import useReportsFilterController from '../controllers/ReportsFilterController';

const ReportsFilterContext = React.createContext<Record<string, any>>(null);

function ReportsFilterProvider(props: any) {
  const value = useReportsFilterController();
  return <ReportsFilterContext.Provider value={value} {...props} />;
}

function withReportsFilterProvider(Component: any) {
  return (props: any) => (
    <ReportsFilterProvider>
      <Component {...props} />
    </ReportsFilterProvider>
  );
}

function useReportsFilter(): Record<string, any> {
  const context = React.useContext(ReportsFilterContext);

  if (context === undefined) {
    throw new Error('useReportsFilter must be used within a ReportsFilterProvider');
  }

  return context;
}

export { ReportsFilterProvider, useReportsFilter, withReportsFilterProvider };
