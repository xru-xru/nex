import React from 'react';

import useContentFilterController, { ContentFilterController } from '../hooks/useContentFilterController';

const ContentFilterContext = React.createContext<ContentFilterController>(null);

function ContentFilterProvider(props: any) {
  const { withInitial } = props;
  const value = useContentFilterController(withInitial);
  return <ContentFilterContext.Provider value={value} {...props} />;
}

function withContentFilterProvider(Component: any) {
  return (props: any) => (
    <ContentFilterProvider>
      <Component {...props} />
    </ContentFilterProvider>
  );
}

function useContentFilter(): Record<string, any> {
  const context = React.useContext(ContentFilterContext);

  if (context === undefined) {
    throw new Error('useKpisFilter: must be used within <ContentFilter Provider />');
  }

  return context;
}

export { ContentFilterProvider, withContentFilterProvider, useContentFilter };
