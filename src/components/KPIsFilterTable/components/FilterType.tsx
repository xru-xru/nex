import React from 'react';
import { Waypoint } from 'react-waypoint';

import { get } from 'lodash';
import styled from 'styled-components';
import { ArrayParam, NumberParam, useQueryParams } from 'use-query-params';

import { NexoyaMeasurementConnection } from '../../../types/types';
import '../../../types/types';

import { useKpisFilter } from '../../../context/KpisFilterProvider';
import { useProviders } from '../../../context/ProvidersProvider';
import { useMeasurementsPgQuery } from '../../../graphql/measurement/queryMeasurementsPg';

import { useFetchMoreQuery } from '../../../hooks/useFetchMoreQuery';
import { difference, union } from '../../../utils/array';
import { getKpiKey } from '../../../utils/kpi';

import { colorByKey } from '../../../theme/utils';

import MenuList from '../../ArrayMenuList';
import Button from '../../Button';
import ButtonAdornment from '../../ButtonAdornment';
import Checkbox from '../../Checkbox';
import ErrorMessage from '../../ErrorMessage';
import { IconWrapperStyled } from '../../HelpCenter/HelpCenter';
import MenuItem from '../../MenuItem';
import NameTranslation from '../../NameTranslation';
import Panel from '../../Panel';
import SearchField from '../../SearchField';
import Spinner from '../../Spinner/Spinner';
import SvgCaretDown from '../../icons/CaretDown';
import SvgQuestionCircle from '../../icons/QuestionCircle';

type Props = {
  saveToParams?: boolean;
  handleOpenHelpCenter: (url: string) => void;
};
const ButtonStyled = styled(Button)`
  .NEXYButtonLabel {
    display: flex;
    align-items: center;
  }
`;
const WrapChipStyled = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  font-size: 14px;
  color: ${colorByKey('darkGrey')};

  .NEXYAvatar {
    margin-right: 8px;
  }
`;
const WrapSearchStyled = styled.div`
  padding: 8px;
  width: 100%;

  & > * {
    width: 100%;
  }
`;
const MenuItemStyled = styled(MenuItem)`
  .NEXYCheckbox {
    padding: 0;
  }
  .NEXYButtonLabel {
    display: flex;
    align-items: center;
  }
  .helpCenterMeasurements {
    margin-top: 2px;
  }
`;
const MeasurementNameStyled = styled.div`
  margin-right: 9px;
  text-align: left;
  min-width: 0;
  max-width: 213px;
`;
const ProviderNameStyled = styled.div`
  margin-left: 9px;
  text-align: left;
  min-width: 0;
  max-width: 113px;
  opacity: 0.5;
`;

// TODO: Figure out why the initial transition isn't working for the opening of the panel.
function FilterType({ saveToParams, handleOpenHelpCenter }: Props) {
  const anchorEl = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [skipInitialLoad, setSkipInitialLoad] = React.useState(true);
  const {
    providerSelection: { selected },
    measurementSelection,
  } = useKpisFilter();
  const { providerById } = useProviders();
  const selectedProviders = selected.map((selectedProviders) => selectedProviders.provider_id);
  const { data: allMeasurementsData, loading: loadingAllMeasurements } = useMeasurementsPgQuery({
    first: 1000,
  });
  const { data, loading, error, fetchMore, networkStatus } = useMeasurementsPgQuery({
    search,
    first: 50,
    activeProviderIds: selectedProviders.length ? selectedProviders : undefined,
  });
  const allMeasurements: NexoyaMeasurementConnection = get(allMeasurementsData, 'measurements', {});
  const measurements: NexoyaMeasurementConnection = get(data, 'measurements', {});
  const [queryParams, setQueryParams] = useQueryParams({
    measurement: ArrayParam,
    searchPg: NumberParam,
  });
  const queryParamMeasurement = queryParams.measurement || [];
  const preselectedMeasurementSelection = get(allMeasurements, 'edges', [])
    .filter((edge) => queryParamMeasurement.includes(edge.node.measurement_id.toString()))
    .map((edge) => edge.node);
  React.useEffect(() => {
    if (skipInitialLoad && open) {
      setSkipInitialLoad(false);
    }
  }, [skipInitialLoad, open]);
  React.useEffect(() => {
    if (saveToParams && preselectedMeasurementSelection.length !== measurementSelection.selected.length) {
      measurementSelection.setInitial(preselectedMeasurementSelection);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.measurement, preselectedMeasurementSelection]);
  const loadingMore = networkStatus === 3;
  const { fetchAndUpdate } = useFetchMoreQuery({
    fetchMore,
    cursor: get(measurements, 'pageInfo.endCursor', ''),
    queryKey: 'measurements',
  });
  return (
    <>
      <ButtonStyled
        onClick={() => setOpen((s) => !s)}
        ref={anchorEl}
        isOpen={open}
        isActive={measurementSelection.selected.length > 0}
        variant="contained"
        color="secondary"
        endAdornment={
          <ButtonAdornment position="end">
            <SvgCaretDown />
          </ButtonAdornment>
        }
        data-cy="filterTypeBtn"
      >
        <span>Type</span>
        {measurementSelection.selected.map((m) => (
          <WrapChipStyled key={getKpiKey(m, 'filter-chip')}>
            <ProviderNameStyled>
              <NameTranslation
                text={providerById(m.provider_id).name || ''}
                data-cy={`type-${providerById(m.provider_id).name || ''}`}
              />
            </ProviderNameStyled>
            <span
              style={{
                display: 'inline-block',
                margin: '0 5px',
                opacity: 0.5,
              }}
            >
              /
            </span>
            <MeasurementNameStyled>
              <NameTranslation text={m.name} data-cy={`type-${m.name}`} />
            </MeasurementNameStyled>
          </WrapChipStyled>
        ))}
      </ButtonStyled>
      <Panel
        color="dark"
        open={open}
        anchorEl={anchorEl.current}
        onClose={() => setOpen(false)}
        style={{
          maxHeight: 300,
          width: 450,
          overflowY: 'auto',
        }}
        placement="bottom-start"
        popperProps={{
          enableScheduleUpdate: true,
          style: {
            zIndex: 1300,
          },
        }}
      >
        <WrapSearchStyled>
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search type"
            color="dark"
            data-cy="typeFilterSearchField"
          />
        </WrapSearchStyled>
        <MenuList color="dark">
          {loading && loadingAllMeasurements && !loadingMore ? (
            <Spinner size="18px" />
          ) : (
            (get(measurements, 'edges') || []).map((measurement, i) => {
              const isActive = measurementSelection.selected.some(
                (c) => c.measurement_id === measurement.node.measurement_id,
              );
              const provider = providerById(measurement.node.provider_id) || {
                name: '',
              };
              return (
                <MenuItemStyled
                  key={getKpiKey(measurement.node, 'filter')}
                  onClick={() => {
                    if (isActive) {
                      measurementSelection.remove(measurement.node);

                      if (saveToParams) {
                        const nextMeasurementsQuery = difference(queryParamMeasurement, [
                          measurement.node.measurement_id.toString(),
                        ]);
                        setQueryParams({
                          measurement: nextMeasurementsQuery,
                          searchPg: null,
                        });
                      }
                    } else {
                      measurementSelection.add(measurement.node);

                      if (saveToParams) {
                        const nextMeasurementsQuery = union(queryParamMeasurement, [
                          measurement.node.measurement_id.toString(),
                        ]);
                        setQueryParams({
                          measurement: nextMeasurementsQuery,
                          searchPg: null,
                        });
                      }
                    }
                  }}
                >
                  <Checkbox checked={isActive} color="dark" />
                  <ProviderNameStyled>
                    <NameTranslation text={provider.name} data-cy={provider.name} />
                  </ProviderNameStyled>
                  <span
                    style={{
                      display: 'inline-block',
                      margin: '0 5px',
                      opacity: 0.5,
                    }}
                  >
                    /
                  </span>

                  <MeasurementNameStyled>
                    <NameTranslation text={measurement.node.name} data-cy={measurement.node.name} />
                  </MeasurementNameStyled>
                  {measurement.node.helpcenter_link ? (
                    <IconWrapperStyled
                      style={{
                        marginTop: '2px',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenHelpCenter(measurement.node.helpcenter_link);
                      }}
                    >
                      <SvgQuestionCircle />
                    </IconWrapperStyled>
                  ) : null}
                  {get(measurements, 'pageInfo.hasNextPage', false) &&
                  i === get(measurements, 'edges.length', 0) - 1 ? (
                    <Waypoint onEnter={fetchAndUpdate} />
                  ) : null}
                </MenuItemStyled>
              );
            })
          )}
        </MenuList>
        {loadingMore ? <Spinner size="18px" /> : null}
      </Panel>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default FilterType;
