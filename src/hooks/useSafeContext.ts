import React from 'react';

const defaultProvider = 'XXX';
export function useSafeContext(ctx: React.Context<any>, providerName: string = defaultProvider) {
  const context = React.useContext(ctx);

  if (context === undefined) {
    throw new Error(`use${providerName} must be used within a ${providerName}Provider`);
  }

  return context;
}
