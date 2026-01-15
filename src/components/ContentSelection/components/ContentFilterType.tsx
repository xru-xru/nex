import React from 'react';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaCollectionType } from '../../../types/types';

import { useContentFilter } from '../../../context/ContentFilterProvider';
import { useCollectionTypesQuery } from '../../../graphql/collection/queryCollectionTypes';

import { colorByKey } from '../../../theme/utils';

import MenuList from '../../ArrayMenuList';
import Button from '../../Button';
import ButtonAdornment from '../../ButtonAdornment';
import Checkbox from '../../Checkbox';
import ErrorMessage from '../../ErrorMessage';
import MenuItem from '../../MenuItem';
import Panel from '../../Panel';
import Spinner from '../../Spinner/Spinner';
import TypographyTranslation from '../../TypographyTranslation';
import SvgCaretDown from '../../icons/CaretDown';

const ButtonStyled = styled(Button)`
  .NEXYButtonLabel {
    display: flex;
    align-items: center;
  }
`;
const WrapChipStyled = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  font-size: 14px;
  color: ${colorByKey('darkGrey')};

  .NEXYAvatar {
    margin-right: 8px;
  }
`;
const MenuItemStyled = styled(MenuItem)`
  .NEXYCheckbox {
    padding: 0;
  }
  .NEXYButtonLabel {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }
  .helpCenterMeasurements {
    margin-top: 2px;
  }
`;

function ContentFilterType() {
  const anchorEl = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const { collectionTypeSelection } = useContentFilter();
  const { data, error, networkStatus } = useCollectionTypesQuery();
  const collectionTypes: NexoyaCollectionType[] = get(data, 'collectionTypes', []) || [];
  const loadingMore = networkStatus === 3;
  return (
    <>
      <ButtonStyled
        onClick={() => setOpen((s) => !s)}
        ref={anchorEl}
        isOpen={open}
        isActive={collectionTypeSelection.selected.length > 0}
        variant="contained"
        color="secondary"
        endAdornment={
          <ButtonAdornment position="end">
            <SvgCaretDown />
          </ButtonAdornment>
        }
        data-cy="filterTypeBtn"
      >
        <span>Type</span>
        {collectionTypeSelection.selected.map((ct) => (
          <WrapChipStyled key={ct.collection_type_id}>
            <TypographyTranslation text={ct.name} data-cy={`type-${ct.name}`} />
          </WrapChipStyled>
        ))}
      </ButtonStyled>
      <Panel
        color="dark"
        open={open}
        anchorEl={anchorEl.current}
        onClose={() => setOpen(false)}
        style={{
          maxHeight: 300,
          width: 200,
          overflowY: 'auto',
        }}
        placement="bottom-start"
        popperProps={{
          enableScheduleUpdate: true,
          style: {
            zIndex: 1300,
          },
        }}
      >
        <MenuList color="dark">
          {collectionTypes.map((ct) => {
            const isActive = collectionTypeSelection.selected.some(
              (i) => i.collection_type_id === ct.collection_type_id
            );
            return (
              <MenuItemStyled
                key={ct.collection_type_id}
                data-cy={`collection-type-${ct.name?.toLowerCase()}`}
                onClick={() => {
                  if (isActive) {
                    collectionTypeSelection.remove(ct);
                  } else {
                    collectionTypeSelection.add(ct);
                  }
                }}
              >
                <TypographyTranslation text={ct.name} data-cy={ct.name} />

                <Checkbox checked={isActive} color="dark" />
              </MenuItemStyled>
            );
          })}
        </MenuList>
        {loadingMore ? <Spinner size="18px" /> : null}
      </Panel>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default ContentFilterType;
