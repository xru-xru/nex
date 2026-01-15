import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaCustomKpi, NexoyaMeasurement, NexoyaMeasurementConnection } from '../../types/types';

import { useKpisFilter, withKpisFilterProvider } from '../../context/KpisFilterProvider';
import { useNewCustomKpi, withNewCustomKpiProvider } from '../../context/NewCustomKpiProvider';
import { useProviders } from '../../context/ProvidersProvider';
import { useUpdateCustomKpiMutation } from '../../graphql/kpi/mutationUpdateCustomKpi';
import { useMeasurementsPgQuery } from '../../graphql/measurement/queryMeasurementsPg';

import usePresenterMode from '../../hooks/usePresenterMode';
import { buildKpiKey } from '../../utils/buildReactKeys';
import { customKpiInputArr } from '../../utils/kpi';

import { sizes } from '../../theme/device';
import { colorByKey } from '../../theme/utils';

import AvatarProvider from '../AvatarProvider';
import Button from '../Button';
import ButtonAdornment from '../ButtonAdornment';
import Checkbox from '../Checkbox';
import NameTranslation from '../NameTranslation';
import SidePanel, { useSidePanelState } from '../SidePanel';
import Tooltip from '../Tooltip';
import Typography from '../Typography';
import { CancelIcon } from '../icons';
import InfoCircle from '../icons/InfoCircle';
import SvgPencil from '../icons/Pencil';
import KpisSelection from './KpisSelection';
import ButtonAsync from '../ButtonAsync';

// TODO - Rename to EditCustomKpiList
// Webstorm was caching the file to regular txt file, because of wronly created file before with name EditCustomKpiList
type Props = {
  kpi: NexoyaMeasurement;
};
const PreselectedKpisWrapperStyled = styled.div`
  width: 100%;
  padding: 16px 48px 4px 48px; // 4px padding-bottom, since margin-bottom on chip is 12px. it's a hack, i know
  background-color: ${colorByKey('ghostWhite')};
`;
const WrapChipStyled = styled.div`
  display: inline-flex;
  vertical-align: top;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 12px;
  padding: 7px;
  font-size: 14px;
  background-color: white;
  box-shadow:
    0 0 0 1px rgba(223, 225, 237, 0.66),
    0 2px 4px -1px rgba(7, 97, 52, 0.24);
  color: ${colorByKey('darkGrey')};

  .NEXYAvatar {
    margin-right: 8px;
  }
`;
const RemoveButtonStyled = styled.div`
  margin-left: 15px;
  font-size: 10px;
  color: ${colorByKey('paleLilac66')};
  cursor: pointer;
`;
const SidePanelContentStyled = styled.div`
  padding: 24px 24px 123px 24px;
  height: calc(100% - 83px);
  overflow-y: scroll;
  position: relative;
`;
const CheckboxWrapperStyled = styled.div`
  position: absolute;
  min-height: 33px;
  display: flex;
  background: #fff;
  width: 100%;
  padding: 15px 48px 10px 47px;
  bottom: 77px;
`;
const ButtonWrapperStyled = styled.div`
  background: #fafbff;
  padding: 20px 32px 20px 32px;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  width: 100%;
`;
const InfoCircleStyled = styled(InfoCircle)`
  color: #0ec76a;
  margin-left: 5px;
`;
const EditCustomKpiList = withNewCustomKpiProvider(
  withKpisFilterProvider(function CreateCustomKpi({ kpi }: Props) {
    const customKpiConfig: NexoyaCustomKpi = get(kpi, 'customKpiConfig', null);
    const collectionId = get(kpi, 'collection.collection_id', null);
    const measurementId = get(kpi, 'measurement_id', null);
    const kpis = get(kpi, 'customKpiConfig.kpis', []);
    const [tooltipRef, setTooltipRef] = React.useState(null);
    const { isPresenterMode } = usePresenterMode();
    const { isOpen, toggleSidePanel } = useSidePanelState({
      initialState: false,
    });
    const { kpis: selectedKpis, addKpi, removeKpi, includeSearch, setIncludeSearch, resetState } = useNewCustomKpi();
    const {
      measurementSelection,
      providerSelection,
      search: { value: searchValue, onChange: searchOnChange },
    } = useKpisFilter();
    // @ts-ignore
    const [updateCustomKpi, { loading }] = useUpdateCustomKpiMutation({
      collectionId: collectionId,
      measurementId: measurementId,
      custom_kpi_id: customKpiConfig?.custom_kpi_id,
      kpis: !includeSearch ? customKpiInputArr(selectedKpis, customKpiConfig) : undefined,
      search: includeSearch
        ? {
            query: searchValue,
            provider_id: providerSelection.selected.length
              ? providerSelection.selected.map((p) => p.provider_id)
              : null,
            measurement_id: measurementSelection.selected.length
              ? measurementSelection.selected.map((m) => m.measurement_id)
              : null,
            sumOnly: false, // intentionally hardcoded to false
          }
        : undefined,
    });
    const customKpiProviderIds = get(customKpiConfig, 'search.provider_id', []) || [];
    // get all providers and measurements
    const { activeProviders } = useProviders();
    const { data: measurementData } = useMeasurementsPgQuery({
      first: 500,
      activeProviderIds: customKpiProviderIds.length ? customKpiProviderIds : undefined,
    });
    const measurements: NexoyaMeasurementConnection = get(measurementData, 'measurements', {});
    React.useEffect(() => {
      // if we have search config, set it
      if (customKpiConfig?.search) {
        const searchSetup = customKpiConfig?.search || {};

        if (isOpen) {
          setIncludeSearch(true);
          searchOnChange(searchSetup.query);
        } else {
          setIncludeSearch(false);
          searchOnChange('');
        }
      } else {
        // preselect KPIs already included in custom KPI
        // but only if there is no search config
        if (isOpen) {
          addKpi(kpis);
          searchOnChange('');
        } else {
          resetState();
        }
      } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);
    React.useEffect(() => {
      if (customKpiConfig?.search) {
        if (isOpen) {
          // set providers
          const customKpiProviders = activeProviders.filter((activeProvider) =>
            customKpiProviderIds.includes(activeProvider.provider_id),
          );
          providerSelection.add(customKpiProviders);
          // set measurements
          const customKpiMeasurementIds = get(customKpiConfig, 'search.measurement_id', []) || [];
          const customKpiMeasurements = get(measurements, 'edges', [])
            .filter((edge) => customKpiMeasurementIds.includes(edge.node.measurement_id))
            .map((edge) => edge.node);
          measurementSelection.add(customKpiMeasurements);
        } else {
          measurementSelection.reset();
          providerSelection.reset();
        }
      } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, measurements]);

    async function handleSubmit() {
      try {
        //@ts-ignore
        const res = await updateCustomKpi();

        if (get(res, 'data.updateCustomKpi', null)) {
          toggleSidePanel();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }

    function isButtonDisabled() {
      return (includeSearch && !searchValue) || (!includeSearch && selectedKpis.length === 0);
    }

    // TODO: Rework media query resizing values to not have this hack.
    const isBelowLaptopL = useMediaQuery({
      maxWidth: sizes.laptopL - 1,
    });
    if (isPresenterMode) return null;
    return (
      <div>
        <Button
          id="editList"
          variant="contained"
          color="tertiary"
          size="small"
          onClick={toggleSidePanel}
          startAdornment={
            <ButtonAdornment>
              <SvgPencil />
            </ButtonAdornment>
          }
        >
          Edit list
        </Button>
        <SidePanel
          isOpen={isOpen}
          onClose={toggleSidePanel}
          paperProps={{
            style: {
              width: isBelowLaptopL ? '80%' : '60%',
            },
          }}
        >
          <Typography
            variant="h2"
            component="h3"
            style={{
              overflow: 'visible',
              padding: '12px 0 24px 48px',
            }}
          >
            Select metrics
          </Typography>
          {!customKpiConfig?.search && (
            <PreselectedKpisWrapperStyled>
              {selectedKpis.map((kpi) => (
                <WrapChipStyled key={buildKpiKey(kpi, 'wrap-chip')}>
                  <AvatarProvider providerId={kpi.provider_id} size={16} />
                  <NameTranslation text={kpi.name} />
                  <RemoveButtonStyled
                    onClick={() => {
                      removeKpi(kpi);
                    }}
                  >
                    <CancelIcon />
                  </RemoveButtonStyled>
                </WrapChipStyled>
              ))}
            </PreselectedKpisWrapperStyled>
          )}
          <SidePanelContentStyled>
            <KpisSelection isCustomKpi />
          </SidePanelContentStyled>
          <CheckboxWrapperStyled ref={setTooltipRef}>
            <Checkbox
              checked={includeSearch}
              onClick={() => {
                setIncludeSearch(!includeSearch);
              }}
              label={`Automatically add new KPI's`}
              data-cy="autoAddNewKpis"
            />
            <Tooltip
              variant="dark"
              content="By activating this, new KPIs with the same name & search criteria will be automatically added to your custom KPI and calculated accordingly."
              container={tooltipRef}
              data-cy="toolTip"
            >
              <span>
                <InfoCircleStyled />
              </span>
            </Tooltip>
          </CheckboxWrapperStyled>
          <ButtonWrapperStyled>
            <Button id="discard" variant="contained" onClick={toggleSidePanel}>
              Discard changes
            </Button>
            <ButtonAsync
              id="save"
              variant="contained"
              color="primary"
              loading={loading}
              onClick={handleSubmit}
              disabled={isButtonDisabled()}
            >
              Save changes
            </ButtonAsync>
          </ButtonWrapperStyled>
        </SidePanel>
      </div>
    );
  }),
);
export default EditCustomKpiList;
