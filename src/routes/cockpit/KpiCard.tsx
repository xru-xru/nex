import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';

import AvatarProvider from '../../components/AvatarProvider';
import NameTranslation from '../../components/NameTranslation';
import NumberValue from '../../components/NumberValue';
import Card from '../../components/layout/Card';

import { ThemeStyled } from '../../theme/theme';
import '../../theme/theme';

type Props = {
  kpi: NexoyaMeasurement;
};
const CardHoverStyled = styled(Card)`
  margin: 0;
  padding: 15px 15px 10px 15px;
  display: flex;
  align-items: center;

  & > div:first-child {
    margin-left: 15px;
    margin-right: 25px;
  }
`;
const HeaderStyled = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 8px;
`;
const FirstNameStyled = styled(NameTranslation)`
  font-size: 16px;
`;
const SecondNameStyled = styled(NameTranslation)<{
  readonly theme: ThemeStyled;
}>`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
`;
const ValuesStyled = styled.div<{
  readonly theme: ThemeStyled;
}>`
  display: flex;
  align-items: center;
  padding: 0 25px 0 0px;

  & > div:first-child {
    font-size: 34px;
    font-weight: 200;
    margin-left: 7px;
    margin-right: 10px;
  }

  & > div:last-child {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

function KpiCard({ kpi }: Props) {
  const collection = get(kpi, 'collection');
  const detail = get(kpi, 'detail');
  return (
    <CardHoverStyled key={kpi.measurement_id}>
      <AvatarProvider providerId={kpi.provider_id} size={50} />
      <div
        style={{
          minWidth: 0,
        }}
      >
        <HeaderStyled>
          <div
            style={{
              minWidth: 0,
            }}
          >
            <FirstNameStyled text={kpi.name} component="h3" withEllipsis />
            <SecondNameStyled text={collection.title || ''} withEllipsis />
          </div>
        </HeaderStyled>
        <ValuesStyled>
          <NumberValue value={detail.value || 0} datatype={kpi.datatype} textWithColor />
          <NumberValue value={detail.valueChangePercentage || 0} symbol="%" showArrow arrowWithColor />
        </ValuesStyled>
      </div>
    </CardHoverStyled>
  );
}

export default KpiCard;
