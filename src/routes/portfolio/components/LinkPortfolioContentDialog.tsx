import React, { useCallback, useEffect, useState } from 'react';

import { debounce, get } from 'lodash'; // Import debounce
import styled from 'styled-components';

import { NexoyaCollection, NexoyaCollectionConnection, NexoyaCollectionEdges, NexoyaPageInfo } from 'types';

import { useChildCollectionQuery } from 'graphql/content_old/queryChildCollections';

import { format } from '../../../utils/dates';
import validateNumberInput from 'components/TableFormNumber/utils/validateNumberInput';

import AvatarProvider from 'components/AvatarProvider';
import Button from 'components/Button';
import ButtonAsync from 'components/ButtonAsync';
import Dialog from 'components/Dialog';
import DialogActions from 'components/DialogActions';
import DialogContent from 'components/DialogContent';
import DialogTitle from 'components/DialogTitle';
import TextField from 'components/TextField';
import Typography from 'components/Typography';
import TypographyTranslation from 'components/TypographyTranslation';

import { colorByKey } from 'theme/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'components-ui/DropdownMenu';
import SvgCaretDown from '../../../components/icons/CaretDown';
import { nexyColors } from '../../../theme';
import Spinner from '../../../components/Spinner';
import usePortfolioMetaStore from '../../../store/portfolio-meta';

type Props = {
  isOpen: boolean;
  loading: boolean;
  parentId: number;
  contentId: string;
  setContentId: (id: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const InputWrap = styled.div`
  .NEXYFormControl {
    width: 100%;
  }
`;

const TypographyStyled = styled(Typography)`
  font-size: 11px;
  margin-bottom: 8px;
`;

const DialogActionsStyled = styled(DialogActions)`
  background: ${colorByKey('ghostWhite')};
`;

const StyledTextField = styled(TextField)`
  color: ${nexyColors.white};
  .NEXYInputWrap {
    padding: 4px 6px;
    box-shadow: rgba(223, 225, 237, 0.2) 0 0 0 1px;
  }
`;

const StyledDropdownMenu = styled(DropdownMenu)`
  z-index: 2000;
`;

// Function to escape special characters in a string
const escapeSpecialChars = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default function LinkPortfolioContentDialog({
  isOpen,
  loading,
  parentId,
  setContentId,
  onSubmit,
  onClose,
}: Props) {
  const [items, setItems] = useState<NexoyaCollectionEdges[]>([]);
  const [lastPageInfo, setLastPageInfo] = useState<NexoyaPageInfo>();
  const [conversion, setConversion] = useState<NexoyaCollection>();
  const [searchTerm, setSearchTerm] = useState('');

  const [isSearching, setIsSearching] = useState(false);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const [scrollLoading, setScrollLoading] = useState(false);

  const {
    portfolioMeta: { start, end },
  } = usePortfolioMetaStore();

  const {
    data: rawData,
    fetchMore,
    loading: childCollectionsLoading,
    refetch,
  } = useChildCollectionQuery({
    skip: !isOpen,
    collection_id: parentId,
    first: 50,
    dateFrom: format(start, 'utcStartMidnight'),
    dateTo: format(end, 'utcEndMidnight'),
  });

  const isItemUnique = (item: NexoyaCollectionEdges) =>
    !items.some((currentEdge) => currentEdge.node.collection_id === item.node.collection_id);

  useEffect(() => {
    const collections: NexoyaCollectionConnection = get(rawData, 'childCollectionsPg', []) || [];
    const edges: NexoyaCollectionEdges[] = get(collections, 'edges', []) || [];
    const filteredItems: NexoyaCollectionEdges[] = edges.reduce((accumulator, current) => {
      return current.node.collectionType.collection_type_id === 16 ? [...accumulator, current] : [...accumulator];
    }, []);
    setItems(filteredItems);
    setLastPageInfo(collections?.pageInfo);
  }, [rawData]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      refetch({
        where: {
          search: value,
        },
        collection_id: parentId,
        first: 10,
        dateFrom: format(start, 'utcStartMidnight'),
        dateTo: format(end, 'utcEndMidnight'),
      }).finally(() => {
        setRefetchLoading(false);
        setIsSearching(false);
      });
    }, 500),
    [parentId, start, end, refetch],
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true); // Set searching state immediately
    setRefetchLoading(true); // Also indicate we're waiting for new data
    debouncedSearch(e.target.value);
  };

  // Filter items based on the search term
  const filteredItems = items.filter((item) => {
    const regexPattern = searchTerm
      .split(' ')
      .filter(Boolean) // Remove any empty strings from splitting
      .map((term) => escapeSpecialChars(term)) // Escape special characters in the term
      .join('.*'); // Join terms with '.*' to allow for flexible matching

    const regex = new RegExp(regexPattern, 'i'); // Create a case-insensitive regex
    return regex.test(item.node.title);
  });

  const handleScroll = (e) => {
    const tolerance = 1; // Add a small tolerance for floating-point precision
    const target = e.target;
    const bottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) <= tolerance;

    if (bottom && lastPageInfo?.hasNextPage) {
      setScrollLoading(true);
      fetchMore({ variables: { after: lastPageInfo.endCursor } })
        .then(({ data }) => {
          setItems((prevItems) => [
            ...prevItems,
            ...data.childCollectionsPg.edges.filter(isItemUnique).reduce((accumulator, current) => {
              return current.node.collectionType.collection_type_id === 16
                ? [...accumulator, current]
                : [...accumulator];
            }, []),
          ]);
          setLastPageInfo(data.childCollectionsPg.pageInfo);
        })
        .finally(() => setScrollLoading(false));
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      paperProps={{
        style: {
          width: 360,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h3" withEllipsis={false}>
          Link content
        </Typography>
      </DialogTitle>
      <DialogContent>
        <StyledDropdownMenu>
          <TypographyStyled variant="subtitlePill" withEllipsis={false}>
            CONVERSION
          </TypographyStyled>
          <DropdownMenuTrigger asChild>
            <Button
              id="selectFunnelStep"
              variant="contained"
              color="secondary"
              flat
              type="button"
              loading={loading || childCollectionsLoading}
              disabled={!filteredItems.length}
              startAdornment={
                conversion ? (
                  <AvatarProvider providerId={conversion.provider.provider_id} size={24} style={{ marginRight: 8 }} />
                ) : null
              }
              endAdornment={
                <SvgCaretDown
                  style={{
                    transform: `rotate(${open ? '180' : '0'}deg)`,
                  }}
                />
              }
              style={{
                width: '100%',
                padding: '12px 8px',
                justifyContent: 'space-between',
              }}
            >
              {loading ? (
                'Loading...'
              ) : filteredItems.length ? (
                conversion ? (
                  <TypographyTranslation text={conversion.title} style={{ fontSize: 14 }} withEllipsis />
                ) : (
                  'Select conversion'
                )
              ) : (
                'No subcontents found'
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="!z-[2000] w-72 min-w-[350px] font-normal" align="start">
            <StyledTextField
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: '100%', padding: '4px 8px', color: nexyColors.white }}
              onKeyDown={(e) => e.stopPropagation()} // Prevents keydown events from affecting focus
            />
            <div
              className="w-full px-1 py-2 font-normal"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
              onScroll={handleScroll}
            >
              {childCollectionsLoading || loading || refetchLoading || isSearching ? (
                <div className="flex items-center justify-center p-2">
                  <Spinner size="21px" />
                </div>
              ) : filteredItems?.length ? (
                filteredItems.map((edge) => (
                  <DropdownMenuItem
                    key={`portfolio-goal-${edge.node.collection_id}`}
                    className="w-full cursor-pointer"
                    onSelect={() => {
                      setContentId('' + edge.node?.collection_id);
                      setConversion(edge.node);
                    }}
                  >
                    <TypographyTranslation text={edge.node.title} withEllipsis={false} />
                  </DropdownMenuItem>
                ))
              ) : (
                <span className="p-3">No subcontents found</span>
              )}

              {scrollLoading && (
                <div className="flex items-center justify-center p-2">
                  <Spinner size="21px" />
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </StyledDropdownMenu>
        <InputWrap>
          <TypographyStyled variant="subtitlePill" withEllipsis={false} style={{ fontSize: 14, marginTop: 8 }}>
            OR
          </TypographyStyled>
          <TextField
            color="dark"
            id="contentId"
            label=""
            name="contentId"
            labelVariant="light"
            placeholder="Content Id"
            onChange={(ev: React.FormEvent<HTMLInputElement>) => {
              if (validateNumberInput(ev.currentTarget.value)) {
                setContentId(ev.currentTarget.value);
              }
            }}
          />
        </InputWrap>
      </DialogContent>
      <DialogActionsStyled>
        <Button
          disabled={loading}
          onClick={(e: React.FormEvent) => {
            e.stopPropagation();
            onClose();
          }}
          variant="contained"
        >
          Cancel
        </Button>
        <ButtonAsync
          onClick={onSubmit}
          disabled={loading}
          loading={loading}
          variant="contained"
          color="primary"
          autoFocus
        >
          Link
        </ButtonAsync>
      </DialogActionsStyled>
    </Dialog>
  );
}
