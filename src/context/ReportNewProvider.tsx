import React from 'react';

import useNewReportController from '../controllers/ReportNewController';

const ReportNewProviderContext = React.createContext<Record<string, any>>(null);

function ReportNewProvider(props: any) {
  const value = useNewReportController();
  return <ReportNewProviderContext.Provider value={value} {...props} />;
}

function withReportNewProvider(Component: any) {
  return (props: any) => (
    <ReportNewProvider>
      <Component {...props} />
    </ReportNewProvider>
  );
}

function useReportNew(): Record<string, any> {
  const context = React.useContext(ReportNewProviderContext);

  if (context === undefined) {
    throw new Error('userReportNew: must be used within <ReportNewProvider />');
  }

  return context;
}

export { ReportNewProvider, withReportNewProvider, useReportNew };
