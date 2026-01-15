import React from 'react';
import { Link } from 'react-router-dom';

import get from 'lodash/get';
import { DateParam } from 'serialize-query-params';
import styled from 'styled-components';
import { ArrayParam, useQueryParams } from 'use-query-params';

import { NexoyaMeasurement } from '../../types/types';
import '../../types/types';
import { ThunkMutFn } from '../../types/types.custom';

import useTeamColor from '../../hooks/useTeamColor';

import AvatarProvider from '../../components/AvatarProvider';
import ButtonBase from '../../components/ButtonBase';
import ErrorMessage from '../../components/ErrorMessage';
import TypographyTranslation from '../../components/TypographyTranslation';
import { CancelIcon } from '../../components/icons';

import { ThemeStyled } from '../../theme/theme';
import '../../theme/theme';
import { colorByKey } from '../../theme/utils';

import { buildKpiPath } from '../paths';

type Props = {
  kpi: NexoyaMeasurement;
  index: number;
  onKpiRemove: ThunkMutFn<NexoyaMeasurement>;
};
const ButtonBaseStyled = styled(ButtonBase)`
  margin-left: 12px;
  color: ${colorByKey('lightPeriwinkle')};
  font-size: 10px;
`;
const KpiRefCardStyled = styled.div`
  position: relative;
  background-color: ${colorByKey('white')}
  border: 1px solid rgba(223, 225, 237, 0.66);
  border-radius: 5px;
  box-shadow: 0 2px 3px -1px rgba(136,138,148,0.15);
  display: flex;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 24px;
  min-width: 150px;
  max-width: 230px;
  padding: 8px 12px;
  flex-shrink: 0;
`;
const MetaWrapStyled = styled(Link)<{
  theme: ThemeStyled;
}>`
  margin-left: 15px;
  min-width: 55%;
  flex: 1;
  transition: color 0.1s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  span {
    line-height: 1;
  }
`;
const BetweenTextStyled = styled.div`
  font-size: 12px;
  color: ${colorByKey('cloudyBlue')};
  font-weight: 500;
  letter-spacing: 0.6px;
  height: 50px;
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

function KPIRefCard({ kpi, index, onKpiRemove }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const getThemeColor = useTeamColor();
  const removeMutation = onKpiRemove(kpi);
  const [queryParams] = useQueryParams({
    kpi: ArrayParam,
    dateFromCompare: DateParam,
    dateToCompare: DateParam,
  });

  async function handleRemoval() {
    setLoading(true);

    try {
      await removeMutation();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <>
      <BetweenTextStyled>vs</BetweenTextStyled>
      <KpiRefCardStyled data-cy="kpiRefCard">
        <AvatarProvider size={15} providerId={kpi.provider_id} />
        <MetaWrapStyled
          to={buildKpiPath(kpi, {
            dateFrom: DateParam.encode(new Date(queryParams.dateFromCompare)),
            dateTo: DateParam.encode(new Date(queryParams.dateToCompare)),
            kpi: null,
            isCompareMetricsOpen: null,
            dateFromCompare: null,
            dateToCompare: null,
          })}
        >
          <div>
            <TypographyTranslation
              text={kpi.name}
              component="p"
              display="block"
              style={{
                color: getThemeColor(index),
                fontWeight: 500,
                lineHeight: 1,
              }}
              withTooltip
            />
            <TypographyTranslation
              text={get(kpi, 'collection.title', '')}
              component="p"
              variant="subtitlePill"
              display="block"
              withTooltip
            />
          </div>
        </MetaWrapStyled>
        <ButtonBaseStyled disabled={loading} onClick={handleRemoval} data-cy="removeKpiMetricBtn">
          <CancelIcon />
        </ButtonBaseStyled>
      </KpiRefCardStyled>
      {error && <ErrorMessage error={error} />}
    </>
  );
}

export default KPIRefCard;
