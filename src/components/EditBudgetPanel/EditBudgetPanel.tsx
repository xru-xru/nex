import React from 'react';

import clsx from 'clsx';
import styled, { css } from 'styled-components';

import validateNumberInput from '../../components/TableFormNumber/utils/validateNumberInput';
import useAllowSubmit from '../../hooks/useAllowSubmit';

import { colorByKey } from '../../theme/utils';

import Button from '../Button';
import ButtonAsync from '../ButtonAsync';
import Panel from '../Panel';
import TextField from '../TextField';
import { PencilIcon } from '../icons';
import { useCurrencyStore } from 'store/currency-selection';

type Props = {
  className?: string;
  value: string;
  loading: boolean;
  handleChange: (value: string) => void;
};
export const classes = {
  root: 'NEXYEditBudgetPanel',
};

interface WrapStyledEditBudgetPanelProps {
  isActive: boolean;
}
const WrapStyled = styled.div<WrapStyledEditBudgetPanelProps>`
  color: ${colorByKey('cloudyBlue')};

  .iconWrapper {
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    border-radius: 50%;

    // show background only on active element
    ${({ isActive }) =>
      isActive &&
      css`
        background-color: ${colorByKey('paleLilac33')};
      `};
  }
`;
const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const CurrencyWrapper = styled.span`
  display: flex;
  color: ${colorByKey('cloudyBlue')};
  margin-top: 30px;
  margin-left: 20px;
`;
const ButtonWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: space-between;

  .NEXYButton {
    width: 50%;
    border-radius: 0;
    line-height: 1.3;
    box-shadow: none;
  }
`;
const PanelBodyStyled = styled.div`
  padding: 16px;
`;

function EditBudgetPanel({ className, value: valueProp, loading, handleChange }: Props) {
  // panel stuff
  const [open, setOpen] = React.useState(false);
  const anchorEl = React.useRef(null);
  // currency stuff
  const { currency } = useCurrencyStore();
  // value stuff
  const [value, setValue] = React.useState(valueProp);
  React.useEffect(() => {
    if (open) {
      setValue(valueProp);
    }
  }, [open, valueProp]);
  const { allowSubmit } = useAllowSubmit({
    initialValues: {
      value: valueProp,
    },
    values: {
      //@ts-ignore
      value: parseFloat(value),
    },
    requiredFields: ['value'],
  });

  async function handleBudgetChange() {
    await handleChange(value);
    setOpen(false);
  }

  return (
    <WrapStyled className={clsx(className, classes.root, open && 'active')} isActive={open}>
      <div className="iconWrapper" ref={anchorEl} onClick={() => setOpen(true)}>
        <PencilIcon />
      </div>
      <Panel
        open={open}
        anchorEl={anchorEl.current}
        onClose={() => setOpen(false)}
        placement="bottom-start"
        style={{ maxHeight: 250, maxWidth: 250, overflowY: 'auto' }}
        color="dark"
        popperProps={{
          enableScheduleUpdate: true,
          style: {
            zIndex: 1305,
          },
        }}
      >
        <PanelBodyStyled>
          <InputWrapper>
            <TextField
              color="dark"
              id="budget"
              value={value}
              label="Planned Budget"
              name="budget"
              labelVariant="light"
              onChange={(ev) => {
                if (validateNumberInput(ev.target.value)) {
                  setValue(ev.target.value);
                }
              }}
              onKeyPress={(ev) => {
                //triggers submit by pressing the 'enter' key
                if (ev.key === 'Enter' && allowSubmit) {
                  return handleBudgetChange();
                }
              }}
              placeholder="Enter value"
            />
            <CurrencyWrapper>{currency}</CurrencyWrapper>
          </InputWrapper>
        </PanelBodyStyled>
        <ButtonWrapper>
          <Button variant="contained" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <ButtonAsync
            variant="contained"
            active={true}
            color="primary"
            loading={loading}
            disabled={!allowSubmit}
            onClick={handleBudgetChange}
          >
            Apply
          </ButtonAsync>
        </ButtonWrapper>
      </Panel>
    </WrapStyled>
  );
}

export default EditBudgetPanel;
