import * as React from 'react';
import { useCallback, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../../../../components-ui/Command';
import { CirclePlus } from 'lucide-react';
import Button from '../../../../../../components/Button';
import ButtonAdornment from '../../../../../../components/ButtonAdornment';
import { DataTableFilterOption } from '../types';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../../components-ui/Popover';
import { v4 as uuidv4 } from 'uuid';

interface DataTableFilterComboboxProps {
  options: DataTableFilterOption[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<DataTableFilterOption[]>>;
  onSelect: () => void;
  disabled?: boolean;
}

export function AddFilterDropdown({ options, setSelectedOptions, onSelect, disabled }: DataTableFilterComboboxProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (option: DataTableFilterOption) => {
      setOpen(false);
      setSelectedOptions((prev) => [
        ...prev,
        {
          id: uuidv4(),
          ...option,
        },
      ]);
      if (onSelect) {
        onSelect();
      }
    },
    [onSelect, setSelectedOptions],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          disabled={disabled}
          className="flex justify-between gap-2 !py-1.5"
          startAdornment={
            <ButtonAdornment>
              <CirclePlus className="h-4 w-4" />
            </ButtonAdornment>
          }
        >
          Add filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Filter by..." />
          <CommandList className="max-h-full">
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={String(option.value)}
                  className="flex gap-2 capitalize"
                  value={String(option.value)}
                  onSelect={() => handleSelect(option)}
                >
                  {option.icon}
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
