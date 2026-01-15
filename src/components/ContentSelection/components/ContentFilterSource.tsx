import React from 'react';

import styled from 'styled-components';

import { useContentFilter } from '../../../context/ContentFilterProvider';
import { useProviders } from '../../../context/ProvidersProvider';

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

function ContentFilterSource() {
  const anchorEl = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  //@ts-ignore
  const { providerSelection } = useContentFilter();
  const { activeProviders } = useProviders();
  return (
    <>
      <ButtonStyled
        id="sourceFilter"
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
      >
        <span>Source</span>
        {providerSelection.selected.map((p) => (
          <WrapChipStyled key={p.provider_id} data-cy={`source-${p.name}`}>
            <AvatarProvider providerId={p.provider_id} size={23} />
            <NameTranslation text={p.name} />
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
                data-cy={provider.name}
                key={provider.provider_id}
                onClick={() => {
                  if (isActive) {
                    providerSelection.remove(provider);
                  } else {
                    providerSelection.add(provider);
                  }
                }}
                buttonProps={{
                  startAdornment: <AvatarProvider providerId={provider.provider_id} size={15} color="dark" />,
                }}
              >
                <NameStyled>
                  <NameTranslation text={provider.name} />
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

export default ContentFilterSource;
