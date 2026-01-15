import React from 'react';

import useKpiSelectionController from '../controllers/KpiSelectionController';

const KpisSelectionContext = React.createContext<Record<string, any> | null>(null);

function KpisSelectionProvider(props: any) {
  const value = useKpiSelectionController();
  return <KpisSelectionContext.Provider value={value} {...props} />;
}

function withKpisSelectionProvider(Component: any) {
  return (props: any) => (
    <KpisSelectionProvider>
      <Component {...props} />
    </KpisSelectionProvider>
  );
}

function useKpisSelection() {
  const context = React.useContext(KpisSelectionContext);

  if (context === undefined) {
    throw new Error('useKpisSelection: must be used within <KpisSelectionProvider />');
  }

  return context;
}

export { KpisSelectionProvider, withKpisSelectionProvider, useKpisSelection };
