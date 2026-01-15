import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { ContentFilterProvider } from '../../context/ContentFilterProvider';
import { usePortfolio } from '../../context/PortfolioProvider';
import { withKpisFilterProvider } from 'context/KpisFilterProvider';

import ContentFilters from './components/ContentFilters';
import ContentSelectionTable from './components/ContentSelectionTable';
import InputSearchFilter from './components/InputSearchFilter';
import { buildContentPath } from 'routes/paths';

import { colorByKey } from '../../theme/utils';

import AvatarProvider from '../AvatarProvider';
import { SidePanelContent } from '../SidePanel';
import { CancelIcon } from '../icons';
import Typography from '../Typography';

type Props = {
  preselect?: boolean;
};

const PreselectedKpisWrapperStyled = styled.div`
  width: 100%;
  padding: 16px 32px 4px 32px;
  margin-bottom: 24px;
  background-color: ${colorByKey('ghostWhite')};
`;
const PreselectedKpisOverflowWrapperStyled = styled.div`
  display: flex;
  overflow-x: auto;
  position: relative;
`;
const WrapChipStyled = styled.div`
  display: inline-flex;
  vertical-align: top;
  align-items: center;
  margin: 1px 12px 12px 1px;
  padding: 7px;
  font-size: 14px;
  background-color: white;
  box-shadow:
    0 0 0 1px rgba(223, 225, 237, 0.66),
    0 2px 4px -1px rgba(7, 97, 52, 0.24);
  color: ${colorByKey('darkGrey')};

  .NEXYAvatar {
    margin-right: 8px;
  }
`;
const LinkStyled = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-width: 150px;
  max-width: 300px;
  flex-shrink: 0;
`;
const RemoveButtonStyled = styled.div`
  margin-left: 15px;
  font-size: 10px;
  color: ${colorByKey('paleLilac66')};
  cursor: pointer;
`;

function ContentSelection({ preselect }: Props) {
  const [filteredContent, setFilteredContent] = React.useState([]);
  const {
    contentSelection: { selected, remove },
  } = usePortfolio();
  React.useEffect(() => {
    const parentContent = selected.filter((content) => content);
    setFilteredContent(parentContent);
  }, [selected]);
  return (
    <ContentFilterProvider withInitial={preselect}>
      {selected.length > 0 && (
        <PreselectedKpisWrapperStyled>
          <PreselectedKpisOverflowWrapperStyled>
            {filteredContent.map((content, index) => (
              <WrapChipStyled key={`content-${index}-${content?.title}`} data-cy="contentChip">
                <LinkStyled to={buildContentPath(content?.collection_id)}>
                  <AvatarProvider providerId={content?.provider?.provider_id} size={16} />
                  <Typography withTooltip>{content?.title}</Typography>
                </LinkStyled>
                <RemoveButtonStyled
                  onClick={() => {
                    remove(content);
                  }}
                  data-cy="removeChipBtn"
                >
                  <CancelIcon />
                </RemoveButtonStyled>
              </WrapChipStyled>
            ))}
          </PreselectedKpisOverflowWrapperStyled>
        </PreselectedKpisWrapperStyled>
      )}
      <SidePanelContent
        style={{
          flexDirection: 'column',
        }}
      >
        <InputSearchFilter
          //@ts-ignore
          style={{
            marginTop: 24,
          }}
        />
        <ContentFilters preselect={preselect} />
        <ContentSelectionTable />
      </SidePanelContent>
    </ContentFilterProvider>
  );
}

export default withKpisFilterProvider(ContentSelection);
