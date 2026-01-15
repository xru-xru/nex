import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { NexoyaFunnelStepV2 } from 'types';

import Button from 'components/Button';
import ButtonAdornment from 'components/ButtonAdornment';
import MenuItem from 'components/MenuItem';
import MenuList from 'components/MenuList';
import Panel from 'components/Panel';
import Text from 'components/Text';
import SvgCaretDown from 'components/icons/CaretDown';

import { nexyColors } from '../../../theme';

interface Props {
  data: NexoyaFunnelStepV2[];
  initial?: NexoyaFunnelStepV2;
  onChange: (funnelStep: NexoyaFunnelStepV2) => void;
}

const MenuItemStyled = styled(MenuItem)`
  .NEXYButtonBase {
    background: ${nexyColors.darkGrey};
    color: white;
    display: flex;
    flex-direction: column;
    border-radius: 0;
    padding: 6px 12px;
  }
`;
const ButtonStyled = styled(Button)`
  box-shadow: 0 0 0 1px rgba(223, 225, 237, 0.66);
`;
const PanelStyled = styled(Panel)`
  max-height: 350px;
  width: 170px;
  overflow-y: auto;
`;
const TitleStyled = styled(Text)`
  width: 100%;
  text-align: left;
`;
const MenuListStyled = styled(MenuList)`
  max-width: 200px;
  background: ${nexyColors.darkGrey};
`;

function FunnelStepsDropdown({ data, onChange, initial }: Props) {
  const anchorEl = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedFunnelStep, setSelectedFunnelStep] = useState<NexoyaFunnelStepV2>(initial);

  useEffect(() => {
    setSelectedFunnelStep(initial);
  }, []);
  function onSelection(fs: NexoyaFunnelStepV2) {
    setSelectedFunnelStep(fs);
    onChange(fs);
  }

  return (
    <>
      <ButtonStyled
        onClick={() => setOpen((s) => !s)}
        isOpen={open}
        isActive={data?.length > 0}
        ref={anchorEl}
        variant="contained"
        color="secondary"
        size="small"
        endAdornment={
          <ButtonAdornment position="end">
            <SvgCaretDown />
          </ButtonAdornment>
        }
      >
        {/* @ts-ignore */}
        <span>{selectedFunnelStep?.title || initial?.title}</span>
      </ButtonStyled>
      <PanelStyled
        open={open}
        anchorEl={anchorEl.current}
        onClose={() => setOpen(false)}
        onClick={() => setOpen((s) => !s)}
        placement="bottom-end"
        style={{ maxHeight: 300 }}
        popperProps={{
          enableScheduleUpdate: true,
          style: {
            zIndex: 1305,
          },
        }}
      >
        <MenuListStyled>
          {data?.map((fs) =>
            fs.type !== 'COST' ? (
              <MenuItemStyled key={fs.funnelStepId} onClick={() => onSelection(fs)}>
                <TitleStyled>{fs.title}</TitleStyled>
              </MenuItemStyled>
            ) : null,
          )}
        </MenuListStyled>
      </PanelStyled>
    </>
  );
}

export default FunnelStepsDropdown;
