import { ArrayParam, BooleanParam, DateParam, useQueryParams } from 'use-query-params';

import KPIsCompareDates from '../../routes/KPIsCompareDates';

import SidePanel from '../SidePanel';

function KPIsCompareDatesSidePanel() {
  // Query params date stuff
  const [queryParams, setQueryParams] = useQueryParams({
    kpi: ArrayParam,
    isCompareDatesOpen: BooleanParam,
    dateFromCompare: DateParam,
    dateToCompare: DateParam,
  });
  return (
    <SidePanel
      isOpen={queryParams.isCompareDatesOpen}
      onClose={() =>
        setQueryParams({
          kpi: null,
          isCompareDatesOpen: null,
          dateFromCompare: null,
          dateToCompare: null,
        })
      }
      paperProps={{
        style: {
          width: 'calc(100% - 218px)',
        },
      }}
    >
      <KPIsCompareDates skipQuery={!queryParams.isCompareDatesOpen} />
    </SidePanel>
  );
}

export default KPIsCompareDatesSidePanel;
