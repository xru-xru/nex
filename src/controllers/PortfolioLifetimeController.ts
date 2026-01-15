import React from 'react';

type PortfolioLifetime = 'active' | 'planned' | 'completed';
const stateKeys = ['active', 'planned', 'completed'];

function usePortfolioLifetimeController(initialLifetime: PortfolioLifetime = 'active') {
  const [lifetime, setLifetime] = React.useState<PortfolioLifetime>(initialLifetime);

  function handleSetLifetime(nextLifetime: PortfolioLifetime) {
    if (!stateKeys.some((key) => key === nextLifetime)) {
      throw new Error(`usePortfolioStateController: unsupported state filter, ${nextLifetime}`);
    }

    setLifetime(nextLifetime);
  }

  return {
    lifetime,
    setLifetime: handleSetLifetime,
  };
}

export default usePortfolioLifetimeController;
