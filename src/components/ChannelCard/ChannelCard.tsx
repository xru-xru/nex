import styled from 'styled-components';

import { NexoyaContentReport } from '../../types/types.custom';

import { useProviders } from '../../context/ProvidersProvider';

import { useTranslation } from '../../hooks/useTranslation';

import NumberValue from '../../components/NumberValue';
import Typography from '../../components/Typography';

import { colorByKey } from '../../theme/utils';

import AvatarProvider from '../AvatarProvider';
import NameTranslation from '../NameTranslation';

interface Props {
  item: NexoyaContentReport;
}
const WrapStyled = styled.div`
  flex: 0 1 calc(50% - 12px);
  margin-bottom: 24px;
  padding: 20px 24px;
  border-width: 1px;
  border-style: solid;
  border-color: ${colorByKey('paleLilac66')};
  border-radius: 5px;
`;
const TitleWrapStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
`;
const FiguresWrapStyled = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const ProviderNameStyled = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;

  .NEXYAvatar {
    margin-right: 8px;
  }
`;

interface NumberStyledChannelCardProps {
  columnSpan: number;
}
const NumbersStyled = styled.div<NumberStyledChannelCardProps>`
  flex-basis: ${(props) => (props.columnSpan > 2 ? '30%' : '50%')};
  overflow: hidden;
  font-size: 23px;
`;
const TypographyNameStyled = styled(Typography)`
  text-transform: uppercase;
  color: ${colorByKey('cloudyBlue80')};
`;

function ChannelCard({ item }: Props) {
  const { providerById } = useProviders();
  const { translate } = useTranslation();
  const providerId = item.provider ? item.provider.provider_id : 0;
  return (
    <WrapStyled>
      <TitleWrapStyled>
        <ProviderNameStyled>
          <AvatarProvider providerId={providerId} size={24} />
          <NameTranslation
            text={providerById(providerId).name || ''}
            data-cy={`type-${providerById(providerId).name || ''}`}
          />
        </ProviderNameStyled>
      </TitleWrapStyled>
      <FiguresWrapStyled>
        {item.kpis.map((kpi, index) => {
          return (
            <NumbersStyled key={`${providerId}--${index}`} columnSpan={item.kpis.length}>
              <TypographyNameStyled variant="subtitlePill">{translate(kpi.name)}</TypographyNameStyled>
              <NumberValue
                value={kpi.detail ? kpi.detail.value : 0}
                datatype={{ label: '{datatype:integer}', suffix: true }}
              />
              <Typography variant="subtitle">{kpi.detail ? kpi.detail.valueChangePercentage : 0}%</Typography>
            </NumbersStyled>
          );
        })}
      </FiguresWrapStyled>
    </WrapStyled>
  );
}

export default ChannelCard;
