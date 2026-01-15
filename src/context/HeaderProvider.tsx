import React, { useContext, useEffect, useState } from 'react';
import theme from '../theme';

interface IHeaderContext {
  headerHeight: string;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderContext = React.createContext<IHeaderContext | null>(null);

function HeaderProvider(props: any) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(theme.nexy.headerExpandedHeight);

  useEffect(() => {
    const calculatedHeight = isExpanded ? theme.nexy.headerExpandedHeight : theme.nexy.headerCollapsedHeight;
    setHeaderHeight(calculatedHeight);
  }, [isExpanded]);

  const contextValue: IHeaderContext = {
    headerHeight,
    isExpanded,
    setIsExpanded,
  };

  return <HeaderContext.Provider value={contextValue} {...props} />;
}

function useHeader(): IHeaderContext {
  const context = useContext(HeaderContext);
  if (context === null) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}

export { HeaderProvider, useHeader };
