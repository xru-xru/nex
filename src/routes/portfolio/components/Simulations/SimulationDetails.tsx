import React from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';
import { NexoyaLocalSimulationInput } from '../../../../controllers/SimulationController';

import { djsAnchors, format } from '../../../../utils/dates';
import { isEditSimulationDisabled } from '../../utils/simulation';

import { DateSelector, getPortfolioDateRanges } from '../../../../components/DateSelector';
import Fieldset from '../../../../components/Form/Fieldset';
import FormGroup from '../../../../components/Form/FormGroup';
import TextField from '../../../../components/TextField';
import Typography from '../../../../components/Typography';
import SvgCheckCircle from '../../../../components/icons/CheckCircle';

import { nexyColors } from '../../../../theme';
import { StatusWrapperStyled } from '../LaunchOptimization/styles';

const WrapStyled = styled.div`
  .NEXYH3 {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    svg {
      display: inline-block;
      font-size: 32px;
      margin-right: 12px;
    }
  }
`;

interface Props {
  handleChangeValueByKey: (ev: { target: { name: string; value: unknown } }) => void;
  simulation: NexoyaLocalSimulationInput;
}

export const SimulationDetails = ({ simulation, handleChangeValueByKey }: Props) => {
  const { name, start, end, ignoreContentBudgetLimits } = simulation;

  const dateRangeProps = {
    hidePastQuickSelection: true,
    hideFutureQuickSelection: false,
    useNexoyaDateRanges: false,
    disableBeforeDate: new Date(format(dayjs(), 'utcStartMidnight')),
    disableAfterDate: dayjs().add(8, 'week').startOf('day').toDate(),
    dateRanges: {
      ...getPortfolioDateRanges(dayjs().toDate(), dayjs().add(8, 'week').toDate()),
      allTime: {
        name: 'All time',
        isPast: false,
        getDateRange: () => ({
          from: new Date(format(dayjs(), 'utcStartMidnight')),
          to: new Date(format(dayjs().add(8, 'week').startOf('day'), 'utcStartMidnight')),
        }),
      },
    },
  };

  return (
    <WrapStyled
      style={{
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Fieldset>
        <FormGroup>
          <Typography variant="h3">Simulation name</Typography>
          <TextField
            id="title"
            name="name"
            value={name}
            onChange={handleChangeValueByKey}
            placeholder="Name your new simulation here"
          />
        </FormGroup>
        <FormGroup>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            Timeframe
          </Typography>
          <Typography variant="subtitle" withEllipsis={false} style={{ fontSize: 12, marginBottom: 16, maxWidth: 400 }}>
            You can select any timeframe from today until 8 weeks from today. The timeframe has to be a minimum of 7
            days.
          </Typography>
          <DateSelector
            disabled={isEditSimulationDisabled(simulation?.state)}
            defaultDateFrom={djsAnchors.today.toDate()}
            defaultDateTo={djsAnchors.twoWeeksFuture.toDate()}
            applyButtonTooltipDisabledContent="The timeframe has to be a minimum of 7 days."
            dateFrom={start ? dayjs(start).toDate() : null}
            dateTo={end ? dayjs(end).toDate() : null}
            minimumDaysSelection={7}
            onDateChange={(dateRange) => {
              handleChangeValueByKey({ target: { name: 'start', value: dateRange.from } });
              handleChangeValueByKey({ target: { name: 'end', value: dateRange.to } });
            }}
            {...dateRangeProps}
            panelProps={{
              side: 'bottom',
              align: 'start',
            }}
            style={{
              width: '100%',
            }}
          />
        </FormGroup>
      </Fieldset>
      {!ignoreContentBudgetLimits ? (
        <StatusWrapperStyled style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SvgCheckCircle style={{ color: nexyColors.greenTeal, width: 24, height: 24 }} />
          <Typography withEllipsis={false} variant="paragraph" style={{ fontSize: 12 }}>
            This simulation takes all restrictions on portfolio and content level into account.
          </Typography>
        </StatusWrapperStyled>
      ) : null}
    </WrapStyled>
  );
};
