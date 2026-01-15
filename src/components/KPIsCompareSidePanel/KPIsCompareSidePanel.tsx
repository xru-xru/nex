import { ArrayParam, BooleanParam, DateParam, useQueryParams } from 'use-query-params';

import KPIsCompare from '../../routes/KPIsCompare';

import SidePanel from '../SidePanel';

export default function KPIsCompareSidePanel() {
  // Query params date stuff
  const [queryParams, setQueryParams] = useQueryParams({
    kpi: ArrayParam,
    isCompareDatesOpen: BooleanParam,
    isCompareMetricsOpen: BooleanParam,
    dateFromCompare: DateParam,
    dateToCompare: DateParam,
  });
  return (
    <SidePanel
      isOpen={queryParams.isCompareMetricsOpen}
      onClose={() =>
        setQueryParams({
          kpi: null,
          isCompareMetricsOpen: null,
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
      <KPIsCompare skipQuery={!queryParams.isCompareMetricsOpen} />
    </SidePanel>
  );
}
