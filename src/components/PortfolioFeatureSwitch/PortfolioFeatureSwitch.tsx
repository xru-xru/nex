import usePortfolioMetaStore from '../../store/portfolio-meta';

type Props = {
  features: string[];
  renderOld: () => any;
  renderNew: () => any;
  bypass?: boolean;
};

function PortfolioFeatureSwitch({ features, renderOld, renderNew, bypass }: Props) {
  const { portfolioMeta, loading } = usePortfolioMetaStore();

  const featureFlags = portfolioMeta?.featureFlags || [];

  const areAllFeaturesEnabled = features.every((requiredFeature) => {
    const flag = featureFlags.find((ff) => ff.name === requiredFeature);
    return flag?.status === true;
  });

  if (loading) return null;

  return bypass ? renderNew() : areAllFeaturesEnabled ? renderNew() : renderOld();
}

export default PortfolioFeatureSwitch;
