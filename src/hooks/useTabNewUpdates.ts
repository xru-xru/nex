import { useDiscoverContentsStore } from '../store/discovered-contents';
import { useCountDiscoveredContents } from '../graphql/portfolioRules/queryCountDiscoveredContents';
import usePortfolioMetaStore from '../store/portfolio-meta';
import { PORTFOLIO_FEATURE_FLAGS } from '../constants/featureFlags';

const useTabNewUpdates = (portfolioId: number) => {
  const { setTabNewUpdates } = useDiscoverContentsStore();
  const { portfolioMeta } = usePortfolioMetaStore();

  const isSelfServiceEnabled = portfolioMeta?.featureFlags?.some(
    (ff) => ff.name === PORTFOLIO_FEATURE_FLAGS.SELF_SERVICE_PORTFOLIO && ff.status,
  );

  // Extract the onCompleted logic to use it in both places
  const handleDiscoveredContentsData = (data) => {
    const newDiscoveredContentsCount = data?.countDiscoveredContents.NEW;
    const unappliedDiscoveredContentsCount = data?.countDiscoveredContents.ACCEPTED_BUT_HAS_UNAPPLIED_RULES;

    if (isSelfServiceEnabled) {
      setTabNewUpdates('discoveredContents', newDiscoveredContentsCount > 0);
      setTabNewUpdates('unappliedRules', unappliedDiscoveredContentsCount > 0);
    } else {
      setTabNewUpdates('discoveredContents', false);
      setTabNewUpdates('unappliedRules', false);
    }
  };

  const { loading, refetch } = useCountDiscoveredContents({
    portfolioId,
    skip: !isSelfServiceEnabled,
    onCompleted: handleDiscoveredContentsData,
  });

  // Function to manually refresh discovered contents
  const refreshCountDiscoveredContents = async () => {
    if (isSelfServiceEnabled) {
      try {
        // Refetch and manually process the data with the same logic
        const { data } = await refetch();

        // Apply the same logic that would have been used in onCompleted
        if (data) {
          handleDiscoveredContentsData(data);
        }
      } catch (error) {
        console.error('Error refreshing discovered contents:', error);
      }
    }
  };

  return { loading, refreshCountDiscoveredContents };
};

export default useTabNewUpdates;
