import { get } from 'lodash';
import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

import AvatarProvider from '../AvatarProvider';
import GridHeader from '../GridHeader';
import GridRow from '../GridRow';
import GridWrap from '../GridWrap';
import Typography from '../Typography';
import TypographyTranslation from '../TypographyTranslation';

type Props = {
  content: any[];
};

const WrapStyled = styled.div`
  .NEXYGridHeader,
  .NEXYGridRow {
    padding: 0 24px;
  }

  .NEXYGridHeader {
    color: ${colorByKey('cloudyBlue80')};
  }

  .NEXYGridRow {
    min-height: 64px;
  }
`;
const TypeStyled = styled.div`
  color: ${colorByKey('blueGrey')};
`;

function ContentTable({ content }: Props) {
  return (
    <WrapStyled>
      <GridWrap gridTemplateColumns="minmax(350px, 2fr) 1fr">
        <GridHeader>
          <Typography>Name</Typography>
          <Typography>Type</Typography>
        </GridHeader>
        {content.map((item, index) => (
          <GridRow key={`item-${index}`}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                minWidth: 0,
              }}
            >
              <AvatarProvider
                providerId={get(item, 'provider.provider_id', '')}
                size={24}
                style={{
                  marginRight: 12,
                }}
              />
              <TypographyTranslation
                text={item.title}
                component="p"
                style={{
                  lineHeight: 1,
                }}
                display="inline-block"
              />
            </div>
            <TypeStyled>
              <Typography>{item.collectionType.name}</Typography>
            </TypeStyled>
          </GridRow>
        ))}
      </GridWrap>
    </WrapStyled>
  );
}

export default ContentTable;
