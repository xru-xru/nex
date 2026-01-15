import React from 'react';

import styled from 'styled-components';
import { ArrayParam, NumberParam, useQueryParams } from 'use-query-params';

import { useKpisFilter } from '../../../context/KpisFilterProvider';
import { useProviders } from '../../../context/ProvidersProvider';

import { difference, union } from '../../../utils/array';

import { colorByKey } from '../../../theme/utils';

import MenuList from '../../ArrayMenuList';
import AvatarProvider from '../../AvatarProvider';
import Button from '../../Button';
import ButtonAdornment from '../../ButtonAdornment';
import Checkbox from '../../Checkbox';
import MenuItem from '../../MenuItem';
import NameTranslation from '../../NameTranslation';
import Panel from '../../Panel';
import SvgCaretDown from '../../icons/CaretDown';

type Props = {
  saveToParams?: boolean;
};
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
  .NEXYButtonLabel {
    display: flex;
  }

  .NEXYCheckbox {
    padding: 0;
  }
`;
const NameStyled = styled.div`
  width: 100px;
  text-align: left;
  margin: 0 9px;
`;

// TODO: Figure out why the initial transition isn't working for the opening of the panel.
function FilterSource({ saveToParams }: Props) {
  const anchorEl = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const { providerSelection } = useKpisFilter();
  const { activeProviders } = useProviders();
  const [queryParams, setQueryParams] = useQueryParams({
    source: ArrayParam,
    searchPg: NumberParam,
  });
  const queryParamSource = queryParams.source || [];
  const preselectedSourceSelection = activeProviders.filter((activeProvider) =>
    queryParamSource.includes(activeProvider.provider_id.toString())
  );
  React.useEffect(() => {
    if (saveToParams) {
      providerSelection.setInitial(preselectedSourceSelection);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.source]);
  return (
    <>
      <ButtonStyled
        onClick={() => setOpen((s) => !s)}
        ref={anchorEl}
        isOpen={open}
        isActive={providerSelection.selected.length > 0}
        variant="contained"
        color="secondary"
        endAdornment={
          <ButtonAdornment position="end">
            <SvgCaretDown />
          </ButtonAdornment>
        }
        data-cy="filterSourceBtn"
      >
        <span>Source</span>
        {providerSelection.selected.map((p) => (
          <WrapChipStyled key={p.provider_id}>
            <AvatarProvider providerId={p.provider_id} size={23} />
            <NameTranslation text={p.name} data-cy={`source-${p.name}`} />
          </WrapChipStyled>
        ))}
      </ButtonStyled>
      <Panel
        open={open}
        anchorEl={anchorEl.current}
        onClose={() => setOpen(false)}
        placement="bottom-start"
        style={{
          maxHeight: 250,
          overflowY: 'auto',
        }}
        popperProps={{
          enableScheduleUpdate: true,
          style: {
            zIndex: 1305,
          },
        }}
      >
        <MenuList color="dark">
          {activeProviders.map((provider) => {
            const isActive = providerSelection.selected.some((f) => f.provider_id === provider.provider_id);
            return (
              <MenuItemStyled
                key={provider.provider_id}
                onClick={() => {
                  if (isActive) {
                    providerSelection.remove(provider);

                    if (saveToParams) {
                      const nextSourceQuery = difference(queryParamSource, [provider.provider_id.toString()]);
                      setQueryParams({
                        source: nextSourceQuery,
                        searchPg: null,
                      });
                    }
                  } else {
                    providerSelection.add(provider);

                    if (saveToParams) {
                      const nextSourceQuery = union(queryParamSource, [provider.provider_id.toString()]);
                      setQueryParams({
                        source: nextSourceQuery,
                        searchPg: null,
                      });
                    }
                  }
                }}
                buttonProps={{
                  startAdornment: <AvatarProvider providerId={provider.provider_id} size={15} color="dark" />,
                }}
              >
                <NameStyled>
                  <NameTranslation text={provider.name} data-cy={provider.name} />
                </NameStyled>
                <Checkbox checked={isActive} name="check" color="dark" />
              </MenuItemStyled>
            );
          })}
        </MenuList>
      </Panel>
    </>
  );
}

export default FilterSource;
