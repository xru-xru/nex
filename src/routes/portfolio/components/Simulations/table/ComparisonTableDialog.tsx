import React, { useMemo } from 'react';

import styled from 'styled-components';
import { NumericArrayParam, StringParam, useQueryParams } from 'use-query-params';

import { ExtendedNexoyaSimulationScenario, NexoyaSimulationScenario } from '../../../../../types';

import { track } from '../../../../../constants/datadog';
import { EVENT } from '../../../../../constants/events';

import DialogActions from '../../../../../components/DialogActions';
import DialogTitle from '../../../../../components/DialogTitle';
import MultipleSwitch from '../../../../../components/MultipleSwitchFluid';
import SvgDownload from '../../../../../components/icons/Download';
import Button from 'components/Button';
import ButtonAdornment from 'components/ButtonAdornment';
import Dialog from 'components/Dialog';
import DialogContent from 'components/DialogContent';
import Typography from 'components/Typography';

import { nexyColors } from '../../../../../theme';
import { CompareScenariosTable } from './CompareScenariosTable';
import ComparisonTableDownload from './ComparisonTableDownload';

const DialogTitleStyled = styled(DialogTitle)`
  padding: 20px 24px;
  box-shadow: 0px 1px 0px 0px rgba(42, 42, 50, 0.08);
  .NEXYH3 {
    font-size: 20px;
  }
`;
const DialogContentStyled = styled(DialogContent)`
  padding: 24px;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 56px;
`;

export const TABLE_METRICS_SECTIONS = [
  {
    id: 'values',
    text: 'Values',
  },
  {
    id: 'cost-per',
    text: 'Cost-per',
  },
];

interface Props {
  simulationId: number;
  portfolioId: number;
  isOpen: boolean;
  onClose: () => void;
  scenarios: NexoyaSimulationScenario[];
}

export const ComparisonTableDialog = ({ isOpen, onClose, scenarios, portfolioId, simulationId }: Props) => {
  const [download, setDownload] = React.useState(false);
  const [queryParams, setQueryParams] = useQueryParams({
    tableMetricsSwitch: StringParam,
    comparisonIds: NumericArrayParam,
  });

  const extendedScenarios: ExtendedNexoyaSimulationScenario[] = scenarios.map((s, idx) => ({ ...s, idx: idx + 1 }));
  const scenariosToDownload = useMemo(
    () => extendedScenarios.filter((s) => s.isBaseScenario || queryParams.comparisonIds?.includes(s.scenarioId)),
    [queryParams.comparisonIds, extendedScenarios],
  );

  return (
    <Dialog
      paperProps={{
        style: {
          width: '80vw',
          maxWidth: '80vw',
          height: '80vh',
        },
      }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <DialogTitleStyled>
        <Typography variant="h3">Compare scenarios</Typography>
      </DialogTitleStyled>
      <DialogContentStyled>
        <HeaderStyled>
          <Typography style={{ color: nexyColors.neutral600 }} variant="paragraph">
            Here’s how the selected scenarios fared against each other. Manage and display scenarios with the column
            manager icon.
          </Typography>
          <MultipleSwitch
            sections={TABLE_METRICS_SECTIONS}
            initial={queryParams.tableMetricsSwitch || TABLE_METRICS_SECTIONS[0].id}
            current={queryParams.tableMetricsSwitch || TABLE_METRICS_SECTIONS[0].id}
            onToggle={(selectedOption) => {
              setQueryParams({
                tableMetricsSwitch: selectedOption,
              });
            }}
          />
        </HeaderStyled>
        <CompareScenariosTable scenarios={extendedScenarios} portfolioId={portfolioId} simulationId={simulationId} />
      </DialogContentStyled>
      <DialogActions>
        <Button
          disabled={!scenariosToDownload.length}
          onClick={() => {
            setDownload(true);
          }}
          startAdornment={
            <ButtonAdornment position="start">
              <SvgDownload />
            </ButtonAdornment>
          }
          color="secondary"
          variant="contained"
          data-cy="downloadBtn"
        >
          Download
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
      {download ? (
        <ComparisonTableDownload
          scenarios={scenariosToDownload}
          funnelSteps={scenarios[0].funnelSteps}
          onDone={() => {
            setDownload(false);
            track(EVENT.SIMULATION_DOWNLOAD_XLSX);
          }}
          onError={() => setDownload(false)}
        />
      ) : null}
    </Dialog>
  );
};
