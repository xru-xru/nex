import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';

import AvatarProvider from '../AvatarProvider';
import TypographyTranslation from '../TypographyTranslation';

type Props = {
  kpi: NexoyaMeasurement;
  color?: string;
  withCollection?: boolean;
  withCollectionType?: boolean;
};
const WrapStyled = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  max-width: 100%;

  .NEXYAvatarProvider {
    margin-right: 15px;
  }
`;
const NameWrapStyled = styled.div`
  display: flex;
  align-items: center;
`;
const TypeWrapStyled = styled.div`
  display: flex;
`;
interface ColorMarkKpiChip2Props {
  color?: string;
}
const ColorMark = styled.div<ColorMarkKpiChip2Props>`
  display: inline-block;
  width: 8px;
  min-width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  opacity: 1;
  line-height: 1;
  background: ${({ color }: any) => color || 'transparent'};
`;
const CollectionNameStyled = styled.span`
  margin-left: 5px;
  font-weight: 400;
  font-size: 0.825em;
  opacity: 0.5;
`;
const TextWrapStyled = styled.div`
  min-width: 55%;
  flex: 1;
  margin-left: 10px;
`;

function KpiChip2({ kpi, color, withCollection, withCollectionType }: Props) {
  const collectionType = get(kpi, 'collection.collectionType.name', '');
  return (
    <WrapStyled data-cy="kpiChip2">
      <AvatarProvider providerId={kpi.provider_id} size={25} />
      <TextWrapStyled>
        <NameWrapStyled data-cy="kpiNameChip2">
          {!color ? null : <ColorMark color={color} />}
          <TypographyTranslation text={kpi.name} withTooltip />
        </NameWrapStyled>
        {withCollection ? (
          <TypeWrapStyled data-cy="kpiTypeChip2">
            <TypographyTranslation
              text={get(kpi, 'collection.title', '')}
              style={{
                fontSize: '0.825em',
                opacity: 0.5,
              }}
              withTooltip
            />
            {withCollectionType && collectionType && (
              <CollectionNameStyled>{`(${collectionType})`}</CollectionNameStyled>
            )}
          </TypeWrapStyled>
        ) : null}
      </TextWrapStyled>
    </WrapStyled>
  );
}

export default KpiChip2;
