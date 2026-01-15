import styled from 'styled-components';

import { usePortfolio } from '../../../context/PortfolioProvider';

import { DateSelector } from '../../../components/DateSelector';
import Fieldset from '../../../components/Form/Fieldset/Fieldset';
import FormGroup from '../../../components/Form/FormGroup';
import TextField from '../../../components/TextField';
import Typography from '../../../components/Typography';
import SvgDuration from '../../../components/icons/Duration';
import SvgPortfolioDuotone from '../../../components/icons/PortfolioDuotone';

import { PortfolioTypeSelector } from './PortfolioTypeSelector';

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

function PortfolioMeta() {
  const { meta } = usePortfolio();
  return (
    <WrapStyled>
      <Fieldset>
        <FormGroup style={{ width: 390 }}>
          <Typography variant="h3">Portfolio name</Typography>
          <TextField
            id="title"
            name="title"
            value={meta.value.title}
            onChange={meta.handleChange}
            placeholder="Enter portfolio name"
          />
        </FormGroup>
        <FormGroup style={{ width: 390 }}>
          <Typography variant="h3">
            <SvgDuration />
            When will your portfolio run?
          </Typography>
          <DateSelector
            dateFrom={meta.value.startDate}
            dateTo={meta.value.endDate}
            onDateChange={meta.handleDateChange}
            disableAfterDate={null}
            hidePastQuickSelection
            panelProps={{
              side: 'bottom',
              align: 'start',
            }}
            style={{
              width: '100%',
            }}
          />
        </FormGroup>
        <FormGroup>
          <Typography variant="h3">
            <SvgPortfolioDuotone />
            What type of portfolio do you want to create?
          </Typography>

          <Typography withEllipsis={false} variant="subtitle" style={{ fontSize: 14, fontWeight: 400, maxWidth: 600 }}>
            Select between a fixed budget-based or target-based approach portfolio for this portfolio from the cards
            below.
          </Typography>
          <Typography variant="subtitle" style={{ marginTop: 12, fontSize: 12 }}>
            This selection cannot be changed later on.
          </Typography>
          <PortfolioTypeSelector />
        </FormGroup>
      </Fieldset>
    </WrapStyled>
  );
}

export default PortfolioMeta;
