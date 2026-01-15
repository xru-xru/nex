import { Link } from 'react-router-dom';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';

import { buildKpiPath } from '../../routes/paths';

import { colorByKey } from '../../theme/utils';

import AvatarProvider from '../AvatarProvider';
import Typography from '../Typography';
import TypographyTranslation from '../TypographyTranslation';

interface Props {
  index: number;
  itemHeight: number;
  kpi: NexoyaMeasurement;
  dummy?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}
const WrapperStyled = styled.div<{
  dummy: boolean;
}>`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${colorByKey('paleGrey')};

  &:first-child {
    border-right: 1px solid ${colorByKey('paleGrey')};
  }
`;
const LinkStyled = styled(Link)`
  display: flex;
  align-items: center;
  margin-top: ${(props) => (props.dummy ? '1px' : '')};
  margin-right: ${(props) => (props.dummy ? '-1px' : '')};
`;
const IndexStyled = styled(Typography)`
  margin-right: 16px;
`;
const AvatarProviderStyled = styled(AvatarProvider)`
  margin-right: 12px;
`;
const NameWrapStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
const TypographyTranslationName = styled(TypographyTranslation)`
  font-size: 14px;
  font-weight: 500;
`;
const TypographyTranslationMeta = styled(TypographyTranslation)`
  color: ${colorByKey('cloudyBlue')};
  font-size: 13px;
  font-weight: normal;
`;

function CorrelationMetric({ index, itemHeight, kpi, dummy, dateFrom, dateTo }: Props) {
  return (
    <WrapperStyled style={{ height: itemHeight }} dummy={dummy} data-cy="kpiRow">
      {!dummy && (
        <LinkStyled
          to={
            kpi
              ? buildKpiPath(kpi, {
                  dateFrom,
                  dateTo,
                })
              : ''
          }
          data-cy="addedKpiLink"
        >
          <IndexStyled variant="titleCard">{index}.</IndexStyled>
          <AvatarProviderStyled providerId={kpi.provider_id} size={24} />
          <NameWrapStyled data-cy="addedKpiDetails">
            <TypographyTranslationName text={kpi.name} variant="p" withTooltip data-cy="addedKpiName" />
            <TypographyTranslationMeta
              text={get(kpi, 'collection.title', '')}
              component="p"
              variant="subtitlePill"
              data-cy="addedKpiSubtitle"
            />
          </NameWrapStyled>
        </LinkStyled>
      )}
    </WrapperStyled>
  );
}

export default CorrelationMetric;
