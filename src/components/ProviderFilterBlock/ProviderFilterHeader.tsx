import styled from 'styled-components';

import Divider from '../Divider';
import Checkbox from '../Form/Checkbox';
import ProviderInfo from './ProviderInfo';

type Props = {
  name: string;
  allSelected: boolean;
  providerId: number;
  addItems: () => void;
  removeItems: () => void;
  withProviderInfo?: boolean;
  disabled?: boolean;
};
const HeaderStyled = styled.div`
  text-align: center;
  width: 100%;
`;
const SelectAllWrapStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

function ProviderFilterHeader({
  providerId,
  allSelected,
  addItems,
  removeItems,
  name,
  withProviderInfo = false,
  disabled = false,
}: Props) {
  return (
    <HeaderStyled>
      {withProviderInfo ? <ProviderInfo providerId={providerId} /> : null}
      <SelectAllWrapStyled>
        <Checkbox
          name="checkAll"
          isChecked={allSelected}
          onSelect={addItems}
          onDeselect={removeItems}
          label={allSelected ? 'Deselect all' : 'Select all'}
          disabled={disabled}
        />
        <span
          style={{
            marginLeft: 'auto',
          }}
        >
          {name}
        </span>
      </SelectAllWrapStyled>
      <Divider margin="15px 0 0 0" />
    </HeaderStyled>
  );
}

export default ProviderFilterHeader;
