import React from 'react';

import { NexoyaPortfolioType } from '../../types';

import { usePortfolio } from '../../context/PortfolioProvider';

import ErrorMessage from '../ErrorMessage';

type PortfolioTypeProps = {
  renderForBudgetType: () => any;
  renderForTargetType: () => any;
};

type PortfolioTargetTypeProps = {
  renderForROASType: () => any;
  renderForCPAType: () => any;
};

export function PortfolioTypeSwitch({ renderForBudgetType, renderForTargetType }: PortfolioTypeProps) {
  const {
    portfolioV2Info: {
      meta: { data, loading, error },
    },
  } = usePortfolio();

  if (loading) return null;
  else if (error) return <ErrorMessage error={error} />;

  if (data?.type === NexoyaPortfolioType.Budget) {
    return renderForBudgetType();
  } else {
    return renderForTargetType();
  }
}

export function PortfolioTargetTypeSwitch({ renderForROASType, renderForCPAType }: PortfolioTargetTypeProps) {
  const {
    portfolioV2Info: {
      meta: { data, loading, error },
    },
  } = usePortfolio();

  if (loading) return null;
  else if (error) return <ErrorMessage error={error} />;

  if (data?.type === NexoyaPortfolioType.Roas) {
    return renderForROASType();
  } else {
    return renderForCPAType();
  }
}
