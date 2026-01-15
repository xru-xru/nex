import useSiftSelection from '../hooks/useSiftSelection';

type Props = {
  initialData?: any[];
};

function usePortfolioSelectionController({ initialData = [] }: Props = {}) {
  return useSiftSelection<any>({
    initialData,
    compareFn: (first, second) => first.campaign_id === second.campaign_id,
    keyFn: (c) => String(c.campaign_id),
  });
}

export default usePortfolioSelectionController;
