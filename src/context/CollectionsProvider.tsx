import React from 'react';

import useCollectionsController from '../controllers/CollectionsController';

const CollectionContext = React.createContext<Record<string, any> | null>(null);

function CollectionProvider(props: any) {
  const value = useCollectionsController();
  return <CollectionContext.Provider value={value} {...props} />;
}

function withCollectionsProvider(Component: any) {
  return (props: any) => (
    <CollectionProvider>
      <Component {...props} />
    </CollectionProvider>
  );
}

function useCollections(): Record<string, any> {
  const context = React.useContext(CollectionContext);

  if (context === undefined) {
    throw new Error('useCollectionsProvider must be used within a CollectionProvider');
  }

  return context;
}

export { CollectionProvider, useCollections, withCollectionsProvider };
