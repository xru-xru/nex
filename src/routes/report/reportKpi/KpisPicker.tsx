import styled from 'styled-components';

import { NexoyaMeasurement } from '../../../types/types';

import Button from '../../../components/Button';
import ButtonAsync from '../../../components/ButtonAsync';
import Divider from '../../../components/Divider';
import { classes as KPITableCls } from '../../../components/KPIsFilterTable';
import KpisFilters from '../../../components/KPIsFilterTable/KpisFilters';
import KPIsFilterHeader from '../../../components/KPIsFilterTable/KpisHeader';
import KpisTable from '../../../components/KPIsFilterTable/KpisTable';
import KPIsSelectedSlider from '../../../components/KPIsSelectedSlider';
import { classes as CardCls } from '../../../components/layout/Card';

import TableResults from './kpisPicker/TableResults';
import { useKpiSelectionReducer } from './kpisPicker/useKpiSelectionReducer';
import { useSaveMutation } from './kpisPicker/useSaveMutation';

type Props = {
  reportId: number;
  onClose: () => void;
  selectedKpis: NexoyaMeasurement[];
  dateFrom: Date;
  dateTo: Date;
  refetchQuery: () => void;
};
const WrapStyled = styled.div`
  .${KPITableCls.search.root} {
    position: relative;
    top: 0;

    & > div {
      /* box-shadow: none; */
    }
  }

  .${CardCls.root} {
    box-shadow: none;
    padding: 0;
  }
`;

function KpisPicker({ reportId, onClose, selectedKpis: reportKpis, dateFrom, dateTo, refetchQuery }: Props) {
  const { selectedKpis, toAdd, toRemove, addItem, removeItem, setLoading, loading, touched } =
    useKpiSelectionReducer(reportKpis);
  const handleSave = useSaveMutation({
    toAdd,
    toRemove,
    setLoading,
    reportId,
    onSuccess: refetchQuery,
    onDone: onClose,
    channel: false,
  });

  // Comment: we return a function because some TableResults
  // components have graphql mutation...
  function handleAddKpi(kpi) {
    return () => {
      addItem(kpi);
    };
  }

  // Comment: we return a function because some TableResults
  // components have graphql mutation...
  function handleRemoveKpi(kpi) {
    return () => {
      removeItem(kpi);
    };
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 15,
          display: 'flex',
        }}
      >
        <h3>Selected report kpis</h3>
        <Button
          id="reportCloseEditKpi"
          variant="contained"
          onClick={onClose}
          disabled={loading}
          style={{
            marginLeft: 'auto',
          }}
        >
          Close
        </Button>
        <ButtonAsync
          id="reportSaveKpi"
          color="primary"
          variant="contained"
          disabled={loading || !touched}
          onClick={handleSave}
          style={{
            marginLeft: 15,
          }}
        >
          Save
        </ButtonAsync>
      </div>
      <WrapStyled>
        <KPIsSelectedSlider
          selectedKpis={selectedKpis}
          removeMutation={handleRemoveKpi}
          disabled={loading}
          loading={loading}
        />
        <Divider margin="35px 0 25px 0" />
        <KPIsFilterHeader />
        <KpisFilters />
        <KpisTable dateFrom={dateFrom} dateTo={dateTo}>
          {({ loading, kpis }) => (
            <TableResults
              selectedKpis={selectedKpis}
              kpis={kpis}
              onAddItem={handleAddKpi}
              onRemoveItem={handleRemoveKpi}
              loading={loading}
            />
          )}
        </KpisTable>
      </WrapStyled>
    </div>
  );
}

export default KpisPicker;
