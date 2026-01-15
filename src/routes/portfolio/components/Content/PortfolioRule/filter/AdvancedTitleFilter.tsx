import React, { useCallback } from 'react';
import { DataTableFilterOption, Operator } from '../types';
import Input from '../../../../../../components/Input';
import { CancelIcon } from '../../../../../../components/icons';
import { nexyColors } from '../../../../../../theme';

interface DataTableAdvancedTitleFilterProps {
  selectedValues: Set<string>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<DataTableFilterOption[]>>;
  setShouldFetch: (value: boolean) => void;
  selectedOperator: Operator;
  selectedOption: DataTableFilterOption;
}

const FilterValue = React.memo(({ val, onRemove, isLast }: { val: string; onRemove: () => void; isLast: boolean }) => (
  <>
    <span className="flex gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-600">
      <span className="max-w-56 truncate">{val}</span>
      <div className="flex cursor-pointer items-center" onClick={onRemove}>
        <CancelIcon style={{ color: nexyColors.neutral300, height: 8 }} />
      </div>
    </span>
    {!isLast && <span className="self-center text-sm text-neutral-400">OR</span>}
  </>
));

FilterValue.displayName = 'FilterValue';

export function AdvancedTitleFilter({
  selectedValues,
  setSelectedOptions,
  setShouldFetch,
  selectedOperator,
  selectedOption,
}: DataTableAdvancedTitleFilterProps) {
  const [inputValue, setInputValue] = React.useState('');

  const handleMainInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && inputValue.trim()) {
        selectedValues.add(inputValue.trim());
        setSelectedOptions((prev) =>
          prev.map((item) =>
            item.id === selectedOption.id
              ? {
                  ...item,
                  filterValues: Array.from(selectedValues),
                  filterOperator: selectedOperator?.value,
                }
              : item,
          ),
        );
        setInputValue('');
      }
    },
    [inputValue, selectedValues, setSelectedOptions, selectedOperator, selectedOption],
  );

  const handleRemoveValue = useCallback(
    (valueToRemove: string) => {
      selectedValues.delete(valueToRemove);
      setSelectedOptions((prev) =>
        prev.map((item) =>
          item.id === selectedOption.id
            ? {
                ...item,
                filterValues: Array.from(selectedValues),
                filterOperator: selectedOperator?.value,
              }
            : item,
        ),
      );
    },
    [selectedValues, setSelectedOptions, selectedOperator, selectedOption],
  );

  return (
    <div className="space-y-4">
      <Input
        autoFocus
        placeholder="Type here and press Enter to add..."
        className="!focus:shadow-none !mt-2 h-8 w-full"
        color="dark"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
          setShouldFetch(false);
        }}
        onKeyDown={handleMainInputKeyDown}
      />
      {selectedValues.size > 0 && (
        <div className="flex flex-wrap gap-2">
          {Array.from(selectedValues).map((val, index) => (
            <FilterValue
              key={val + index}
              val={val}
              onRemove={() => handleRemoveValue(val)}
              isLast={index === selectedValues.size - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
