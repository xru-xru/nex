import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../../../../../../components-ui/Command';
import { cn } from '../../../../../../lib/utils';
import Checkbox from '../../../../../../components/Checkbox';
import React from 'react';
import { DataTableFilterOption, Operator, Option } from '../types';

interface DataTableAdvancedFacetedFilterProps {
  title?: string;
  options: Option[];
  selectedValues: Set<string>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<DataTableFilterOption[]>>;
  selectedOperator: Operator;
  selectedOption: DataTableFilterOption;
  fieldType: 'boolean' | 'stringArr' | 'numberArr';
}

export function AdvancedFacetedFilter({
  title,
  options,
  selectedValues,
  setSelectedOptions,
  selectedOperator,
  selectedOption,
  fieldType,
}: DataTableAdvancedFacetedFilterProps) {
  return (
    <Command className="p-1">
      <div className="flex h-9 w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-1 text-sm shadow-sm [&_[cmdk-input-wrapper]]:border-0 [&_[cmdk-input-wrapper]]:px-0">
        <CommandInput placeholder={title} className="h-full border-0 pl-0 ring-0" autoFocus />
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup className="px-0">
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value);

            return (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  if (fieldType === 'boolean') {
                    // Clear other selections and only select the current one
                    selectedValues.clear();
                    selectedValues.add(option.value);
                  } else {
                    if (isSelected) {
                      selectedValues.delete(option.value);
                    } else {
                      selectedValues.add(option.value);
                    }
                  }

                  const filterValues = Array.from(selectedValues);

                  setSelectedOptions((prev) =>
                    prev.map((item) =>
                      item.value === selectedOption.value
                        ? {
                            ...item,
                            filterValues,
                            filterOperator: selectedOperator?.value,
                          }
                        : item,
                    ),
                  );
                }}
              >
                {/* If the field type is boolean, we don't need to show the checkbox*/}
                {fieldType !== 'boolean' && (
                  <Checkbox
                    className={cn(
                      '!mr-2 !p-0',
                      isSelected ? 'bg-primary text-primary-foreground' : 'opacity-20 [&_svg]:invisible',
                    )}
                    checked={isSelected}
                  />
                )}
                {option.icon ? option.icon : null}
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
        {selectedValues.size > 0 && fieldType !== 'boolean' && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSelectedOptions((prev) =>
                    prev.map((item) =>
                      item.value === selectedOption.value
                        ? {
                            ...item,
                            filterValues: [],
                            filterOperator: selectedOperator?.value,
                          }
                        : item,
                    ),
                  );
                  selectedValues.clear();
                }}
                className="cursor-pointer justify-center rounded-md text-center"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
