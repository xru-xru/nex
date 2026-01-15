import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ProviderDropdownFilter } from '../../routes/portfolio/components/Content/PortfolioRule/filter/ProviderDropdownFilter';
import { FilterItem } from '../../routes/portfolio/components/Content/PortfolioRule/filter/FilterItem';
import { AddFilterDropdown } from '../../routes/portfolio/components/Content/PortfolioRule/filter/AddFilterDropdown';
import { DataTableFilterOption } from '../../routes/portfolio/components/Content/PortfolioRule/types';
import { useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';
import { AVAILABLE_FIELDS_AND_OPERATIONS_QUERY } from '../../graphql/portfolioRules/queryAvailableFieldsAndOperations';
import { Button as ShadcnButton } from '../../components-ui/Button';
import {
  getFilterValuesFromFilter,
  getIconForField,
  getTypeForField,
  humanizeFieldName,
  mapOperationsToUI,
  PortfolioRuleType,
  sortFields,
} from '../../routes/portfolio/components/Content/PortfolioRule/utils';
import {
  NexoyaContentFilter,
  NexoyaContentFilterFieldName,
  NexoyaContentFilterOperator,
  NexoyaFieldOperation,
} from '../../types';
import { useRouteMatch } from 'react-router';
import FilterContentsTable from './components/FilterContentsTable';
import { camelCase, startCase } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useFilteredContentsStore } from '../../store/filter-contents';

interface Props {
  selectedContentIds: number[];
  setSelectedContentIds: Dispatch<SetStateAction<number[]>>;
  selectedProviderIds: number[];
  setSelectedProviderIds: Dispatch<SetStateAction<number[]>>;
  selectedAccountIds: number[];
  setSelectedAccountIds: Dispatch<SetStateAction<number[]>>;
  selectedOptions: DataTableFilterOption[];
  setSelectedOptions: Dispatch<SetStateAction<DataTableFilterOption[]>>;
  pendingFilters: NexoyaContentFilter[];
  setPendingFilters: Dispatch<SetStateAction<NexoyaContentFilter[]>>;
  allowMultipleProviderSelection: boolean;
  configType: PortfolioRuleType | 'other';
  excludePortfolioContents?: boolean;
}

function ContentSelectionV2({
  selectedContentIds,
  setSelectedContentIds,
  selectedProviderIds,
  setSelectedProviderIds,
  selectedAccountIds,
  setSelectedAccountIds,
  selectedOptions,
  setSelectedOptions,
  pendingFilters,
  setPendingFilters,
  allowMultipleProviderSelection,
  configType,
  excludePortfolioContents = false,
}: Props) {
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const [shouldFetch, setShouldFetch] = useState(false);
  const [fields, setFields] = useState([]);
  const [openCombobox, setOpenCombobox] = useState(false);

  const { setFilteredContents } = useFilteredContentsStore();

  const [loadAvailableFieldsAndOperations, { loading: loadingAvailableFieldsAndOperations }] = useLazyQuery(
    AVAILABLE_FIELDS_AND_OPERATIONS_QUERY,
    {
      onError: (error) => {
        toast.error('Failed to load the available fields and operators');
        console.error(error);
      },
    },
  );

  useEffect(() => {
    if (!selectedProviderIds?.length && !selectedAccountIds?.length && !selectedOptions?.length) {
      setFilteredContents([]);
      setSelectedContentIds([]);
    }
  }, [selectedProviderIds, selectedAccountIds, selectedOptions]);

  useEffect(() => {
    if (selectedProviderIds && pendingFilters?.length) {
      const newSelectedOptions: DataTableFilterOption[] = pendingFilters
        ?.map((filter) => {
          const field = fields.find((f) => f.value === filter.fieldName);
          if (!field) return null;

          return {
            id: uuidv4(),
            label: field.label,
            icon: field.icon,
            value: filter.fieldName,
            options: field.options,
            type: field.type,
            filterValues: getFilterValuesFromFilter(filter),
            filterOperator: filter.operator,
            operators: field.operators,
          };
        })
        .filter(Boolean);

      if (newSelectedOptions.length) {
        // Use a callback to ensure state updates happen in order
        setSelectedOptions(newSelectedOptions);
        // Delay setting shouldFetch to ensure filters are applied
        setTimeout(() => setShouldFetch(true), 0);
      }
    }
  }, [selectedProviderIds, fields, pendingFilters]);

  /** Fetch available fields & operations for providers **/
  useEffect(() => {
    if (selectedProviderIds.length) {
      setShouldFetch(true);
      loadAvailableFieldsAndOperations({ variables: { providerId: selectedProviderIds[0] } })
        .then((res) => {
          const availableFields = sortFields(res.data?.availableFieldOperations ?? []);
          setFields(
            availableFields
              // Filter out the fields that are not relevant due to having it used for the ad account in FilterContents.tsx
              ?.filter((f) => f.fieldName !== NexoyaContentFilterFieldName.ParentContentId)
              ?.map((field: NexoyaFieldOperation) => ({
                label: humanizeFieldName(field.fieldName),
                value: field.fieldName,
                options:
                  field.allowed.fieldType === 'boolean'
                    ? [
                        { label: 'Yes', value: 'true' },
                        { label: 'No', value: 'false' },
                      ]
                    : field.allowed.enumOptionsString?.map((option: string) => ({
                        label: startCase(camelCase(option)),
                        value: option,
                      })) || [],
                operators: mapOperationsToUI(field.operators),
                icon: getIconForField(field.fieldName),
                type:
                  field.fieldName === NexoyaContentFilterFieldName.Title ||
                  field.fieldName === NexoyaContentFilterFieldName.ParentTitle
                    ? 'stringArr'
                    : getTypeForField(field.allowed),
                placeholder: `Filter by ${humanizeFieldName(field.fieldName)}`,
              })),
          );
        })
        .catch((err) => console.error(err));
    }
  }, [selectedProviderIds]);

  const resetFilters = () => {
    setSelectedOptions([]);
    setPendingFilters([]);
    setShouldFetch(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6 pl-6 pt-6">
        <div className="flex max-w-xl flex-col gap-1">
          <h4 className="text-base font-medium text-neutral-900">Start your filter selection</h4>
          <p className="text-sm font-light text-neutral-500">
            New contents matching your filter will be automatically detected for you to quickly add into your portfolio
          </p>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-wrap gap-2">
            <ProviderDropdownFilter
              portfolioId={portfolioId}
              selectedProviderIds={selectedProviderIds}
              setSelectedProviderIds={setSelectedProviderIds}
              selectedAccountIds={selectedAccountIds}
              setSelectedAccountIds={setSelectedAccountIds}
              setShouldFetch={setShouldFetch}
              allowMultipleProviderSelection={allowMultipleProviderSelection}
              resetFilters={resetFilters}
            />

            <div className="mx-3 my-auto h-8 w-[1px] bg-neutral-100" />

            {selectedOptions
              ?.filter(
                (selectedOption) =>
                  selectedOption.value !== NexoyaContentFilterFieldName.ContentId &&
                  selectedOption.value !== NexoyaContentFilterFieldName.ParentContentId,
              )
              ?.map((selectedOption) => (
                <FilterItem
                  key={selectedOption.id}
                  selectedOptions={selectedOptions}
                  selectedOption={selectedOption}
                  setSelectedOptions={setSelectedOptions}
                  defaultOpen={openCombobox}
                  setShouldFetch={setShouldFetch}
                />
              ))}

            <AddFilterDropdown
              options={fields}
              setSelectedOptions={setSelectedOptions}
              disabled={loadingAvailableFieldsAndOperations || !fields?.length}
              onSelect={() => setOpenCombobox(true)}
            />
          </div>

          <div className="flex h-8 gap-2">
            {selectedOptions.length ? (
              <ShadcnButton className="h-fit whitespace-pre py-1.5" onClick={resetFilters} variant="ghost">
                Reset
              </ShadcnButton>
            ) : null}
          </div>
        </div>

        <FilterContentsTable
          portfolioId={portfolioId}
          providerIds={selectedProviderIds}
          accountIds={selectedAccountIds}
          filters={selectedOptions}
          excludePortfolioContents={excludePortfolioContents}
          selectedContentIds={selectedContentIds}
          setSelectedContentIds={setSelectedContentIds}
          shouldFetch={shouldFetch}
          setShouldFetch={setShouldFetch}
          configType={configType}
          inPortfolioOnly={configType === 'impact-group-rule' || configType === 'attribution-rule'}
          handleCheckboxAction={(contentId: number) => {
            setSelectedOptions((prevState) => [
              ...prevState,
              {
                id: uuidv4(),
                label: '',
                icon: null,
                value: NexoyaContentFilterFieldName.ContentId,
                options: [],
                type: 'number',
                filterValues: [contentId],
                filterOperator: NexoyaContentFilterOperator.Ne,
                operators: [],
              },
            ]);
            setShouldFetch(true);
          }}
        />
      </div>
    </>
  );
}

export default ContentSelectionV2;
