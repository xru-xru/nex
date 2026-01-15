import { get } from 'lodash';
import styled from 'styled-components';

import { useNewCustomKpi } from '../../context/NewCustomKpiProvider';
import useDateController from '../../controllers/DateController';
import { useSelectedKpisQuery } from '../../graphql/kpi/querySelectedKpis';

import { buildKpiKey } from '../../utils/buildReactKeys';
import { kpiInputArr } from '../../utils/kpi';
import { round } from '../../utils/number';

import AvatarProvider from '../AvatarProvider';
import DialogContent from '../DialogContent';
import ErrorMessage from '../ErrorMessage';
import FormControlLabel from '../FormControlLabel';
import LoadingPlaceholder from '../LoadingPlaceholder';
import NameTranslation from '../NameTranslation/NameTranslation';
import NumberValue from '../NumberValue/NumberValue';
import Radio from '../Radio';
import RadioGroup from '../RadioGroup';

const WrapStyled = styled.div`
  display: flex;
  align-items: flex-start;

  & > div:first-of-type {
    margin-right: 65px;
  }

  .NEXYRadioGroup {
    display: flex;
    flex-direction: column;
    margin-left: -5px;
  }

  .NEXYFormControlLabel {
    margin-bottom: 8px;
  }
`;
const ExampleWrapStyled = styled.div`
  overflow: hidden;
  border: 1px solid rgba(223, 225, 237, 0.66);
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 2px 3px -1px rgba(136, 138, 148, 0.15);
  margin-left: auto;

  & > div {
    padding: 10px 20px;
  }
`;
const LoadingWrapStyled = styled.div`
  & > div {
    height: 35px;
    margin-bottom: 10px;

    &:nth-child(2) {
      opacity: 0.65;
    }
    &:nth-child(3) {
      opacity: 0.35;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
const KpiCustomCardStyled = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;

  .NEXYAvatar {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .NEXYText {
    margin-right: 35px;
    font-size: 14px;
    font-weight: bold;
    color: #424347;
  }

  .NEXYNumberValue {
    margin-left: auto;
    font-weight: bold;
    color: #424347;
    position: relative;
    font-size: 14px;
  }

  :not(:first-child) {
    .NEXYNumberValue:before {
      content: '+';
      font-weight: normal;
      color: #b7bac7;
      position: absolute;
      top: -18px;
      right: 0px;
      font-size: 12px;
    }
  }
`;

// TODO: Figure out how we want to treat different datatypes that
// got selected by the user. Do we separate them or do we ignore it?
function KpiCalculation() {
  const { startDate, endDate } = useDateController();
  const { kpis: selectedKpis, calcType, setCalcType, includeSearch } = useNewCustomKpi();
  const { data, loading, error } = useSelectedKpisQuery({
    kpis: kpiInputArr(selectedKpis),
    dateFrom: startDate,
    dateTo: endDate,
    skip: false,
    withCollectionMeta: false,
    withKpiDataPoints: false,
  });

  function handleRadioChange(ev: any) {
    const { value } = ev.currentTarget;
    setCalcType(value);
  }

  const kpis = get(data, 'kpis', []);
  const initialValue = get(kpis, '[0].detail.value', 0);
  const grouped = kpis.reduce(
    (prev, next) => {
      return {
        total: prev.total + next.detail.value,
        min: Math.min(next.detail.value, prev.min),
        max: Math.max(next.detail.value, prev.max),
        mul: prev.mul * next.detail.value,
        div: next.detail.value === 0 ? 0 : prev.div / next.detail.value,
      };
    },
    {
      total: 0,
      min: initialValue,
      max: initialValue,
      mul: 1,
      div: initialValue,
    }
  );
  return (
    <>
      <DialogContent
        style={{
          paddingBottom: 35,
        }}
      >
        <WrapStyled>
          <div>
            <p
              style={{
                marginBottom: 15,
              }}
            >
              How do you want to calculate it?
            </p>
            <RadioGroup>
              <FormControlLabel
                checked={calcType === 'sum'}
                onChange={handleRadioChange}
                value="sum"
                name="yes"
                label="Sum"
                control={
                  <Radio
                    inputProps={{
                      'aria-label': 'A',
                    }}
                  />
                }
                data-cy="sum"
              />
              <FormControlLabel
                checked={calcType === 'avg'}
                onChange={handleRadioChange}
                value="avg"
                name="yes"
                label="Average"
                control={
                  <Radio
                    inputProps={{
                      'aria-label': 'A',
                    }}
                  />
                }
                data-cy="avg"
              />
              <FormControlLabel
                checked={calcType === 'max'}
                onChange={handleRadioChange}
                value="max"
                name="yes"
                label="Maximum"
                control={
                  <Radio
                    inputProps={{
                      'aria-label': 'A',
                    }}
                  />
                }
                data-cy="max"
              />
              <FormControlLabel
                checked={calcType === 'min'}
                onChange={handleRadioChange}
                value="min"
                name="yes"
                label="Minimum"
                control={
                  <Radio
                    inputProps={{
                      'aria-label': 'A',
                    }}
                  />
                }
                data-cy="min"
              />
              <FormControlLabel
                checked={calcType === 'mul'}
                onChange={handleRadioChange}
                value="mul"
                name="yes"
                label="Multiply"
                control={
                  <Radio
                    inputProps={{
                      'aria-label': 'A',
                    }}
                  />
                }
                data-cy="mul"
              />
              <FormControlLabel
                checked={calcType === 'div'}
                onChange={handleRadioChange}
                value="div"
                name="yes"
                label="Divide"
                control={
                  <Radio
                    inputProps={{
                      'aria-label': 'A',
                    }}
                  />
                }
                data-cy="div"
              />
            </RadioGroup>
          </div>
          {/* For now, the table on righthand side is displayed only when KPIs are manually selected */}
          {/* We need to figure a way how go get all KPIs to be able to do exact calculation - in case of */}
          {/* automatic preselectio (includeSearch true) */}
          {!includeSearch && (
            <ExampleWrapStyled>
              <div
                style={{
                  borderBottom: '1px solid rgba(223,225,237,0.66)',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  color: '#B7BAC7',
                }}
              >
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 12,
                    marginRight: 15,
                  }}
                >
                  Example Calc.
                </span>
                <span>Last month</span>
              </div>
              <div>
                {loading ? (
                  <LoadingWrapStyled>
                    <LoadingPlaceholder />
                    <LoadingPlaceholder />
                    <LoadingPlaceholder />
                  </LoadingWrapStyled>
                ) : kpis.length ? (
                  kpis.map((kpi, index) => (
                    <KpiCustomCardStyled key={buildKpiKey(kpi, index)}>
                      <AvatarProvider providerId={kpi.provider_id} />
                      <NameTranslation text={kpi.name} />
                      <NumberValue value={kpi.detail.value} datatype={kpi.datatype} />
                    </KpiCustomCardStyled>
                  ))
                ) : null}
              </div>
              <div
                style={{
                  background: 'rgba(240,242,250,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Total</span>
                <span>
                  <strong>
                    {calcType === 'sum'
                      ? round(grouped.total)
                      : calcType === 'avg'
                      ? round(grouped.total / kpis.length)
                      : calcType === 'max'
                      ? round(grouped.max)
                      : calcType === 'min'
                      ? round(grouped.min)
                      : calcType === 'mul'
                      ? round(grouped.mul)
                      : calcType === 'div'
                      ? round(grouped.div)
                      : null}
                  </strong>
                </span>
              </div>
            </ExampleWrapStyled>
          )}
        </WrapStyled>
      </DialogContent>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default KpiCalculation;
