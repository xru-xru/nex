import clsx from 'clsx';
import styled from 'styled-components';

import '../../../theme/theme';

type Props = {
  name: string;
  label?: string;
  isChecked: boolean;
  disabled?: boolean;
  className?: string;
  onSelect: () => void;
  onDeselect: () => void;
};
const classes = {
  root: 'NEXYCheckbox',
};

interface WrapStyledCheckboxProps {
  withLabel: boolean;
}
const WrapStyled = styled.div<WrapStyledCheckboxProps>`
  display: flex;

  [type='checkbox']:checked,
  [type='checkbox']:not(:checked) {
    position: absolute;
    left: -9999px;
  }

  [type='checkbox']:checked + label,
  [type='checkbox']:not(:checked) + label {
    position: relative;
    padding-left: ${({ withLabel }) => (withLabel ? '28px' : '0')};
    cursor: pointer;
    display: inline-block;
    min-width: 16px;
    min-height: 16px;

    &:hover:before {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  [type='checkbox']:checked + label:before,
  [type='checkbox']:not(:checked) + label:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 14px;
    height: 14px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 3px;
    transition: border-color 0.2s ease;
  }

  [type='checkbox']:checked + label:after,
  [type='checkbox']:not(:checked) + label:after {
    content: '';
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.colors.primary};
    position: absolute;
    top: 3px;
    left: 3px;
    transition: all 0.2s ease;
    border-radius: 2px;
  }

  [type='checkbox']:not(:checked) + label:after {
    opacity: 0;
    transform: scale(0);
  }

  [type='checkbox']:checked + label:after {
    opacity: 1;
    transform: scale(1);
  }

  [type='checkbox']:checked + label:before {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  [type='checkbox']:disabled:checked + label:before,
  [type='checkbox']:disabled:not(:checked) + label:before {
    border-color: #ccc;
    background-color: #eee;
  }

  [type='checkbox']:disabled:checked + label:after {
    background: #aaa;
  }
`;

// TODO: This is way too similar to the Checkmark stylings. Maybe should be extracted to a CheckBase
const Checkbox = ({ name, label, isChecked, onSelect, onDeselect, disabled = false, className }: Props) => (
  <WrapStyled className={clsx(className, classes.root)} withLabel={Boolean(label)}>
    <input
      type="checkbox"
      id={name}
      checked={isChecked}
      disabled={disabled}
      onChange={(ev: any) => {
        ev.preventDefault();
      }}
    />
    <label
      htmlFor={name}
      onClick={(ev: any) => {
        ev.preventDefault();
        if (disabled) return null;
        else if (isChecked) {
          onDeselect();
        } else {
          onSelect();
        }
      }}
    >
      {label || ''}
    </label>
  </WrapStyled>
);

export default Checkbox;
