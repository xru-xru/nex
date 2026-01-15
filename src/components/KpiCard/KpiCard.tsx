import { Link } from 'react-router-dom';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';
import '../../types/types';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import useCustomTheme from '../../hooks/useCustomTheme';

import { buildKpiPath } from '../../routes/paths';

import { colorByKey } from '../../theme/utils';

import AvatarProvider from '../AvatarProvider';
import NumberValue from '../NumberValue';
import TypographyTranslation from '../TypographyTranslation';

type Props = {
  kpi: NexoyaMeasurement;
  startDate: string;
  endDate: string;
};

const LinkWrapStyled = styled(Link)`
  display: block;
  padding: 20px 24px;
  border-width: 1px;
  border-style: solid;
  border-color: ${colorByKey('paleLilac66')};
  border-radius: 5px;
  overflow: hidden;
`;
const HeaderWrapStyled = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
`;
const MetaWrapStyled = styled.div`
  margin-left: 12px;
  min-width: 0px;

  .NEXYH3 {
    letter-spacing: 0.8px;
    margin-bottom: 2px;
  }

  .NEXYParagraph {
    color: ${colorByKey('cloudyBlue')};
  }
`;
const NumbersWrapStyled = styled.div`
  margin-left: 45px;

  .NEXYNumberValue {
    &:nth-child(1) {
      font-size: 32px
      letter-spacing: -0.4px;
      font-weight: normal;
      margin-bottom: 4px;
      line-height: 1.32;
    }
    &:nth-child(2) {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.8px;
    }
  }
`;

function KpiCard({ kpi, startDate, endDate }: Props) {
  const { hasTheme, customTheme } = useCustomTheme();
  const changePercentage = get(kpi, 'detail.valueChangePercentage', 0);

  function getCustomColors() {
    // TODO this needs to be abstracted somehow
    return hasTheme
      ? {
          success: customTheme.colors[1],
          danger: customTheme.colors[4],
          default: customTheme.colors[3],
        }
      : null;
  }

  return (
    <LinkWrapStyled
      to={buildKpiPath(kpi, {
        dateFrom: startDate.substr(0, 10),
        dateTo: endDate.substr(0, 10),
      })}
      onClick={() => {
        track(EVENT.DASHBOARD_CLICK_ON_METRIC);
      }}
      data-cy={`kpiCard-${get(kpi, 'measurement_id', null)}`}
    >
      <HeaderWrapStyled>
        <AvatarProvider providerId={kpi.provider_id} size={33} />
        <MetaWrapStyled>
          <TypographyTranslation text={kpi.name} variant="h3" component="h3" withTooltip />
          <TypographyTranslation variant="paragraph" text={get(kpi, 'collection.title', '')} withEllipsis withTooltip />
        </MetaWrapStyled>
      </HeaderWrapStyled>
      <NumbersWrapStyled>
        <NumberValue value={get(kpi, 'detail.value', 0)} datatype={kpi.datatype} />
        <NumberValue
          value={changePercentage}
          symbol="%"
          textWithColor
          variant={changePercentage >= 0 ? 'positive' : 'negative'}
          customColors={getCustomColors()}
        />
      </NumbersWrapStyled>
    </LinkWrapStyled>
  );
}

export default KpiCard;
