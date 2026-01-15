import * as React from 'react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../../components-ui/Popover';
import { useDebounce } from '../../../../../../hooks/useDebounce';
import { cn } from '../../../../../../lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../../components-ui/Select';
import { TrashIcon } from 'lucide-react';
import Button from '../../../../../../components/Button';
import Input from '../../../../../../components/Input';
import { Button as ShadcnButton } from '../../../../../../components-ui/Button';
import dayjs from 'dayjs';
import { DataTableFilterOption, FilterType, Operator } from '../types';
import { AdvancedFacetedFilter } from './AdvancedFacetedFilter';
import { SingleDateSelector } from '../../../../../../components/DateSelector';
import { NexoyaContentFilterFieldName, NexoyaContentFilterOperator } from '../../../../../../types';
import { getIconForField } from '../utils';
import Tooltip from '../../../../../../components/Tooltip';
import { AdvancedTitleFilter } from './AdvancedTitleFilter';

interface DataTableFilterItemProps {
  selectedOption: DataTableFilterOption;
  selectedOptions: DataTableFilterOption[];
  setSelectedOptions: Dispatch<SetStateAction<DataTableFilterOption[]>>;
  defaultOpen: boolean;
  setShouldFetch: Dispatch<SetStateAction<boolean>>;
}

export function FilterItem({
  selectedOption,
  selectedOptions,
  setSelectedOptions,
  defaultOpen,
  setShouldFetch,
}: DataTableFilterItemProps) {
  const selectedValues = useMemo(() => new Set(selectedOption.filterValues), [selectedOption.filterValues]);

  const filterValues = Array.from(selectedValues);
  const [value, setValue] = useState<any>(filterValues.length > 1 ? filterValues : filterValues[0] ?? '');
  const [open, setOpen] = useState(defaultOpen);
  const [hasDuplicate, setHasDuplicate] = useState(false);

  const debounceValue = useDebounce(value as string, 500);
  const operators: Operator[] = selectedOption.operators.sort((a, b) => a.label.localeCompare(b.label));

  const [filterState, setFilterState] = useState<Record<string, string | null>>({});
  const [selectedOperator, setSelectedOperator] = useState<Operator>(
    operators?.find((c) => c.value === selectedOption.filterOperator) ?? operators?.[0],
  );

  const isTitleOrParentTitleFilter =
    selectedOption.value === NexoyaContentFilterFieldName.Title ||
    selectedOption.value === NexoyaContentFilterFieldName.ParentTitle;

  useEffect(() => {
    const hasDuplicate = selectedOptions.some(
      (item) =>
        item.type === selectedOption.type &&
        item.id !== selectedOption.id &&
        item.value === selectedOption.value &&
        item.filterOperator === selectedOperator.value &&
        selectedOption.type === 'date',
    );

    setHasDuplicate(hasDuplicate);
  }, [selectedOptions, selectedOption, selectedOperator]);

  useEffect(() => {
    const newStateValue =
      selectedOption.options.length > 0
        ? filterValues.length > 0
          ? `${filterValues.join('.')}~${selectedOperator?.value}`
          : null
        : debounceValue.length > 0
          ? `${debounceValue}~${selectedOperator?.value}`
          : null;

    if (filterState[selectedOption.id] !== newStateValue) {
      setFilterState((prevState) => ({
        ...prevState,
        [selectedOption.id]: newStateValue,
      }));
    }
  }, [selectedOption, debounceValue, selectedOperator, filterValues, filterState]);

  useEffect(() => {
    setSelectedOptions((prev) => {
      return prev.map((item) =>
        item.id === selectedOption.id
          ? {
              ...item,
              filterValues: Array.isArray(value) ? value : value ? [value] : [],
              filterOperator: selectedOperator?.value,
            }
          : item,
      );
    });
  }, [value, selectedOperator, selectedOption.id]);

  const renderFilterBasedOnType = (type: FilterType, isTitleAdvancedFilter: boolean) => {
    if (isTitleAdvancedFilter) {
      return (
        <AdvancedTitleFilter
          key={selectedOption.id}
          setShouldFetch={setShouldFetch}
          selectedValues={selectedValues}
          setSelectedOptions={setSelectedOptions}
          selectedOption={selectedOption}
          selectedOperator={selectedOperator}
        />
      );
    }

    switch (type) {
      case 'string':
      case 'number':
        return (
          <Input
            autoFocus
            placeholder="Type here..."
            className="!focus:shadow-none !mt-2 h-8 w-full"
            color="dark"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setShouldFetch(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setOpen(false);
                setShouldFetch(true);
              }
            }}
          />
        );
      case 'stringArr':
      case 'numberArr':
      case 'boolean':
        return (
          <AdvancedFacetedFilter
            fieldType={type}
            key={selectedOption.id}
            title={selectedOption.label}
            options={selectedOption.options}
            selectedValues={selectedValues}
            setSelectedOptions={setSelectedOptions}
            selectedOption={selectedOption}
            selectedOperator={selectedOperator}
          />
        );
      case 'date':
        return (
          <div className="flex w-full items-center space-x-1">
            <SingleDateSelector
              style={{ width: '100% !important' }}
              disableAfterDate={null}
              showAsRange={false}
              selectedDate={dayjs(value).toDate() || null}
              renderInputValue={(date) =>
                dayjs(date).isValid() ? dayjs(date).format('DD MMM, YYYY') : 'Select a date'
              }
              onDateChange={({ selectedDate }) => {
                setValue(dayjs(selectedDate).format('DD MMM, YYYY'));
                setSelectedOptions((prev) => {
                  return prev.map((item) =>
                    item.id === selectedOption.id
                      ? {
                          ...item,
                          filterValues: [dayjs(selectedDate).format('DD MMM, YYYY')],
                          filterOperator: selectedOperator?.value,
                        }
                      : item,
                  );
                });
              }}
              className="!mt-2 !h-8 !w-full !border-neutral-500 !bg-popover !text-neutral-300 !shadow-accent-dark"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Popover
      open={open}
      key={selectedOption.id}
      onOpenChange={(changedValue) => {
        setOpen(changedValue);
        if (!changedValue) {
          setShouldFetch(true);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => setOpen(true)}
          startAdornment={getIconForField(selectedOption.value as NexoyaContentFilterFieldName)}
          className={cn(
            'gap-1.5 !truncate !px-3 !py-1.5',
            (selectedValues.size > 0 || value.length > 0) && 'bg-muted/50',
            hasDuplicate && '!bg-red-100',
          )}
        >
          <Tooltip
            open={hasDuplicate}
            popperProps={{
              style: { zIndex: 38000 },
              modifiers: {
                offset: {
                  offset: '0, 14',
                },
              },
            }}
            variant="dark"
            size="small"
            placement="top"
            content={hasDuplicate ? 'Adjust the operator to avoid duplicate filters.' : ''}
          >
            <div>
              <span className="font-light capitalize">{selectedOption.label}</span>
              {selectedValues.size > 0 ? (
                <>
                  <span className="font-light">: </span>
                  <span className="font-light text-muted-foreground">
                    {selectedValues.size > 2 ? (
                      `${selectedValues.size} selected`
                    ) : selectedOption.options.length ? (
                      selectedOption.options
                        .filter((item) => selectedValues.has(item.value))
                        .map((item) => item.label)
                        .join(', ')
                    ) : (
                      <>
                        {selectedOperator?.humanReadable} {Array.from(selectedValues).join(' OR ')}
                      </>
                    )}
                  </span>
                </>
              ) : (
                value && (
                  <>
                    <span className="font-light">: </span>
                    <span className="font-light text-muted-foreground">
                      {selectedOperator?.humanReadable} {value}
                    </span>
                  </>
                )
              )}
            </div>
          </Tooltip>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-1.5 p-2" align="start">
        <div className="flex items-center space-x-1 pl-1 pr-0.5">
          <div className="flex flex-1 items-center space-x-1">
            <div className="max-w-36 truncate text-ellipsis text-xs capitalize text-muted-foreground">
              {selectedOption.label}
            </div>
            <Select
              value={selectedOperator?.value}
              onValueChange={(value) => {
                setSelectedOperator(operators.find((c) => c.value === value));
                setSelectedOptions((prev) => {
                  return prev.map((item) =>
                    item.id === selectedOption.id
                      ? {
                          ...item,
                          filterOperator: value as NexoyaContentFilterOperator,
                        }
                      : item,
                  );
                });
              }}
            >
              <SelectTrigger className="h-auto w-fit truncate border-none px-2 py-0.5 text-xs hover:bg-muted/50">
                <SelectValue placeholder={selectedOperator?.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {operators?.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="py-1">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ShadcnButton
            aria-label="Remove filter"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-neutral-600 hover:text-neutral-300"
            onClick={() => {
              setSelectedOptions((prev) => prev.filter((item) => item.id !== selectedOption.id));
              setFilterState((prevState) => ({
                ...prevState,
                [selectedOption.id]: null,
              }));
              setShouldFetch(true);
            }}
          >
            <TrashIcon className="size-3" aria-hidden="true" />
          </ShadcnButton>
        </div>
        {renderFilterBasedOnType(selectedOption.type, isTitleOrParentTitleFilter)}
      </PopoverContent>
    </Popover>
  );
}
