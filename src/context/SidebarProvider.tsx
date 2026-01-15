import React, { useContext, useEffect, useState } from 'react';
import theme from '../theme';
import { useMediaQuery } from 'react-responsive';
import { sizes } from '../theme/device';

interface ISidebarContext {
  sidebarWidth: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = React.createContext<ISidebarContext | null>(null);

function SidebarProvider(props: any) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(theme.nexy.sidebarLaptop);
  const isBelowLaptopL = useMediaQuery({
    maxWidth: sizes.laptopL - 1,
  });

  useEffect(() => {
    const calculatedWidth = isBelowLaptopL || isCollapsed ? theme.nexy.sidebarTablet : theme.nexy.sidebarLaptop;
    setSidebarWidth(calculatedWidth);
  }, [isCollapsed, isBelowLaptopL]);

  const toggleCollapse = () => {
    if (isBelowLaptopL) {
      return;
    }
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (isBelowLaptopL) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isBelowLaptopL]);

  const contextValue: ISidebarContext = {
    sidebarWidth,
    isCollapsed,
    toggleCollapse,
  };

  return <SidebarContext.Provider value={contextValue} {...props} />;
}

function useSidebar(): ISidebarContext {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

function withSidebarProvider(Component: React.ComponentType<any>) {
  return (props: any) => (
    <SidebarProvider>
      <Component {...props} />
    </SidebarProvider>
  );
}

export { SidebarProvider, useSidebar, withSidebarProvider };
