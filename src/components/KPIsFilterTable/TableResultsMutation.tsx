import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement, NexoyaMeasurementConnection } from '../../types/types';
import { ThunkMutFn } from '../../types/types.custom';
import '../../types/types.custom';

import { buildKpiKey } from '../../utils/buildReactKeys';
import { equalKpis } from '../../utils/kpi';

import CellAction from './components/CellAction';

import AvatarProvider from '../AvatarProvider';
import GridHeader from '../GridHeader';
import GridRow from '../GridRow';
import GridWrap from '../GridWrap';
import NumberValue from '../NumberValue';
import Text from '../Text';
import TypographyTranslation from '../TypographyTranslation';
import { SumIcon } from '../icons';

type Props = {
  kpis: NexoyaMeasurementConnection;
  selectedKpis: NexoyaMeasurement[];
  onAddMutation: ThunkMutFn<NexoyaMeasurement>;
  onRemoveMutation: ThunkMutFn<NexoyaMeasurement>;
};
// TODO: this is a copy of all the other grid like lists. Needs to be extracted
const GridWrapStyled = styled(GridWrap)`
  .NEXYCSSGrid {
    min-width: 100%;
    grid-template-columns:
      80px minmax(170px, 1.5fr) minmax(100px, 1fr) minmax(75px, 100px)
      minmax(75px, 100px) 65px;
  }
`;

const TableResultsMutation = ({ kpis, selectedKpis, onAddMutation, onRemoveMutation }: Props) => {
  return (
    <GridWrapStyled>
      <GridHeader>
        <Text>Source</Text>
        <Text>Name</Text>
        <Text>Type</Text>
        <Text>Value</Text>
        <Text>Change</Text>
        <span />
      </GridHeader>
      {get(kpis, 'edges.length', 0) !== 0
        ? kpis.edges.map((kpi) => {
            const isSelected = selectedKpis.some((k) => equalKpis(k, kpi.node));
            const parentCollection = get(kpi, 'node.collection.parent_collection', null);
            return (
              <GridRow key={buildKpiKey(kpi.node, 'item')}>
                <AvatarProvider
                  providerId={kpi.node.provider_id}
                  size={20}
                  style={{
                    margin: 'auto',
                  }}
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
                    <TypographyTranslation
                      text={parentCollection.title}
                      style={{
                        marginRight: 5,
                        opacity: 0.5,
                      }}
                      display="inline"
                      withTooltip
                    />
                  ) : null}
                  <TypographyTranslation text={get(kpi, 'node.collection.title', '')} withTooltip />
                  {!parentCollection ? (
                    <SumIcon
                      style={{
                        fontSize: 12,
                        marginLeft: 7,
                      }}
                    />
                  ) : null}
                </div>
                <TypographyTranslation text={get(kpi, 'node.name', '')} withTooltip />
                <NumberValue value={get(kpi, 'node.detail.value', 0)} datatype={kpi.node.datatype} />
                <NumberValue value={get(kpi, 'node.detail.valueChangePercentage', 0)} textWithColor symbol="%" />
                <CellAction
                  kpi={kpi.node}
                  isSelected={isSelected}
                  onAddMutation={onAddMutation}
                  onRemoveMutation={onRemoveMutation}
                />
              </GridRow>
            );
          })
        : null}
    </GridWrapStyled>
  );
};

export default TableResultsMutation;
