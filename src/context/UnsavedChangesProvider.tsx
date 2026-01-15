// UnsavedChangesProvider.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HasUnsavedChangesDialog from '../components/HasUnsavedChangesDialog';
import { useRouteMatch } from 'react-router';

interface UnsavedChangesContextValue {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  handleNavigation: (action: () => void) => void;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
  isDialogOpen: boolean;
}

const UnsavedChangesContext = React.createContext<UnsavedChangesContextValue | null>(null);

export const UnsavedChangesProvider: React.FC = ({ children }) => {
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const location = useLocation();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // If the route changes or portfolioId changes, reset hasUnsavedChanges
  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [portfolioId, location.pathname]);

  const handleNavigation = useCallback(
    (action: () => void) => {
      if (hasUnsavedChanges) {
        setIsDialogOpen(true);
        setPendingNavigation(() => action);
      } else {
        action();
      }
    },
    [hasUnsavedChanges],
  );

  const confirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
    setIsDialogOpen(false);
  }, [pendingNavigation]);

  const cancelNavigation = useCallback(() => {
    setIsDialogOpen(false);
    setPendingNavigation(null);
  }, []);

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        handleNavigation,
        confirmNavigation,
        cancelNavigation,
        isDialogOpen,
      }}
    >
      {children}
      <HasUnsavedChangesDialog
        open={isDialogOpen}
        cancelNavigation={cancelNavigation}
        confirmNavigation={confirmNavigation}
      />
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = (): UnsavedChangesContextValue => {
  const context = React.useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error('useUnsavedChanges must be used within an UnsavedChangesProvider');
  }
  return context;
};
