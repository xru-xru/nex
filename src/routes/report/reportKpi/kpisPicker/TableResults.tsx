import { get } from 'lodash';

import { NexoyaMeasurement, NexoyaMeasurementConnection } from '../../../../types/types';
import { ThunkMutFn } from '../../../../types/types.custom';

import { buildKpiKey } from '../../../../utils/buildReactKeys';
import { equalKpis } from '../../../../utils/kpi';

import AvatarProvider from '../../../../components/AvatarProvider';
import ButtonIcon from '../../../../components/ButtonIcon';
import ErrorBoundary from '../../../../components/ErrorBoundary/ErrorBoundary';
import GridHeader from '../../../../components/GridHeader';
import GridRow from '../../../../components/GridRow';
import GridWrap from '../../../../components/GridWrap';
import NameTranslation from '../../../../components/NameTranslation';
import Text from '../../../../components/Text';
import { SumIcon } from '../../../../components/icons';
import SvgPlusRegular from '../../../../components/icons/PlusRegular';
import SvgTimes from '../../../../components/icons/Times';

type Props = {
  selectedKpis: any[];
  onAddItem: ThunkMutFn<NexoyaMeasurement>;
  onRemoveItem: ThunkMutFn<NexoyaMeasurement>;
  loading: boolean;
  kpis: NexoyaMeasurementConnection;
};

function TableResults({ selectedKpis, kpis, onAddItem, onRemoveItem, loading }: Props) {
  const edges = get(kpis, 'edges');
  return (
    <ErrorBoundary>
      <GridWrap gridTemplateColumns="80px minmax(170px, 1.5fr) minmax(100px, 1fr) 85px">
        <GridHeader>
          <Text>Source</Text>
          <Text>Name</Text>
          <Text>Type</Text>
          <span />
        </GridHeader>
        {(edges || []).map((kpi) => {
          const isSelected = selectedKpis.some((ms) => equalKpis(ms, kpi.node));
          const parentCollection = get(kpi, 'collection.parent_collection', null);
          return (
            <GridRow key={buildKpiKey(kpi.node, 'row')} isSelected={isSelected}>
              <AvatarProvider
                style={{
                  margin: '0 auto',
                }}
                providerId={kpi.node.provider_id}
                size={20}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 0,
                  paddingRight: 16,
                }}
              >
                {parentCollection ? (
                  <NameTranslation
                    text={parentCollection.title}
                    style={{
                      marginRight: '5',
                      opacity: 0.5,
                    }}
                    display="inline"
                  />
                ) : null}
                <NameTranslation text={get(kpi, 'node.collection.title', '')} display="inline" />
                {!parentCollection ? (
                  <SumIcon
                    style={{
                      fontSize: 12,
                      marginLeft: 7,
                    }}
                  />
                ) : null}
              </div>
              <NameTranslation text={kpi.node.name} variant="secondary" />
              <ButtonIcon
                disabled={loading}
                onClick={() => {
                  const addItem = onAddItem(kpi.node);
                  const removeItem = onRemoveItem(kpi.node);
                  isSelected ? removeItem() : addItem();
                }}
                color={isSelected ? 'danger' : 'primary'}
                variant="contained"
                style={{
                  marginLeft: 'auto',
                }}
              >
                {isSelected ? <SvgTimes /> : <SvgPlusRegular />}
              </ButtonIcon>
            </GridRow>
          );
        })}
      </GridWrap>
    </ErrorBoundary>
  );
}

export default TableResults;
