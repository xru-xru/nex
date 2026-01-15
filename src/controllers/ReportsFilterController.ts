import useSearchController from './SearchController';
import useSortOrderController from './SortOrderController';

function useReportsFilterController() {
  const { search, setSearch } = useSearchController();
  const { order, setOrder } = useSortOrderController();
  return {
    search: {
      value: search,
      setSearch,
    },
    order: {
      value: order,
      setOrder,
    },
  };
}

export default useReportsFilterController;
