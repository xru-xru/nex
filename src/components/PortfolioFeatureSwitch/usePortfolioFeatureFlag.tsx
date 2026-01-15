import { usePortfolio } from '../../context/PortfolioProvider';

const usePortfolioFeatureFlag = (features: string[], bypass?: boolean) => {
  const {
    portfolioV2Info: {
      meta: { data, loading, error },
    },
  } = usePortfolio();

  const featureFlags = data?.featureFlags || [];

  // Check if any of the provided features are enabled
  const isFeatureEnabled = featureFlags.some(
    (featureFlag) => features.includes(featureFlag.name) && featureFlag.status,
  );

  return {
    loading,
    error,
    isFeatureEnabled: bypass || isFeatureEnabled,
  };
};

export default usePortfolioFeatureFlag;
