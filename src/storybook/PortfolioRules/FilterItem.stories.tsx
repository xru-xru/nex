import { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';
import ContentSelectionV2 from '../../components/ContentSelection/ContentSelectionV2';
import { mock_decorators } from '../../../.storybook/preview.jsx';
import { NexoyaContentFilterFieldName, NexoyaFieldOperation } from '../../types';
import { FilterItem } from '../../routes/portfolio/components/Content/PortfolioRule/filter/FilterItem';
import { AddFilterDropdown } from '../../routes/portfolio/components/Content/PortfolioRule/filter/AddFilterDropdown';
import {
  getIconForField,
  getTypeForField,
  humanizeFieldName,
  mapOperationsToUI,
} from '../../routes/portfolio/components/Content/PortfolioRule/utils';
import { camelCase, startCase } from 'lodash';
import { MOCK_AVAILABLE_FIELDS_AND_OPERATIONS } from '../fixtures';

export default {
  title: 'Portfolio Rules/Filters / Fields',
  component: ContentSelectionV2,
  decorators: mock_decorators(),
  parameters: {
    docs: {
      description: {
        component:
          'This is the filter item component that is used in the create rule sidepanel. It is used to filter the content based on the selected field, operator, and value.',
      },
    },
    controls: {
      sort: 'requiredFirst',
    },
  },
  tags: ['autodocs'],
} as Meta;

const Template: StoryFn = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  return (
    <div className="flex flex-wrap gap-2">
      <AddFilterDropdown
        // @ts-ignore
        options={MOCK_AVAILABLE_FIELDS_AND_OPERATIONS.map((field: NexoyaFieldOperation) => ({
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
          type: getTypeForField(field.allowed),
          placeholder: `Filter by ${humanizeFieldName(field.fieldName)}`,
        }))}
        setSelectedOptions={setSelectedOptions}
        disabled={false}
      />
      {selectedOptions
        ?.filter((selectedOption) => selectedOption.value !== NexoyaContentFilterFieldName.ContentId)
        ?.map((selectedOption) => (
          <FilterItem
            key={selectedOption.id}
            selectedOptions={selectedOptions}
            selectedOption={selectedOption}
            setSelectedOptions={setSelectedOptions}
            defaultOpen={true}
            setShouldFetch={console.info}
          />
        ))}
    </div>
  );
};

export const Default = Template.bind({});
