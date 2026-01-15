import React from 'react';

import styled from 'styled-components';
import { ArrayParam, BooleanParam, NumberParam, useQueryParams } from 'use-query-params';

import { useKpisFilter } from '../../context/KpisFilterProvider';

import FilterSource from './components/FilterSource';
import FilterType from './components/FilterType';
import Checkbox from 'components/Checkbox';

import { colorByKey } from '../../theme/utils';

import Button from '../Button';
import HelpCenterSidePanel from '../HelpCenter/HelpCenterSidepanel';
import SvgSlidersHRegular from '../icons/SlidersHRegular';

type Props = {
  saveToParams?: boolean;
};
const WrapStyled = styled.div`
  display: flex;
  margin-top: 24px;
  flex-wrap: wrap;

  & > * {
    margin-right: 24px;
    margin-bottom: 24px;
  }
`;
const LabelStyled = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  letter-spacing: 0.6px;
  line-height: 1;
  color: ${colorByKey('blueyGrey')};

  & > *:first-child {
    margin-right: 8px;
  }
`;

const CheckboxStyled = styled(Checkbox)`
  color: ${colorByKey('blueGrey')};
`;

function KpisFilters({ saveToParams }: Props) {
  const { measurementSelection, providerSelection, active } = useKpisFilter();
  const showReset = measurementSelection.selected.length > 0 || providerSelection.selected.length > 0;
  const [queryParams, setQueryParams] = useQueryParams({
    measurement: ArrayParam,
    source: ArrayParam,
    searchPg: NumberParam,
    isActive: BooleanParam,
  });

  React.useEffect(() => {
    if (queryParams.isActive) {
      active.set(queryParams.isActive);
    }
  });

  function handleResetFilters() {
    measurementSelection.reset();
    providerSelection.reset();
    active.set(false);

    if (measurementSelection.selected.length > 0) {
      measurementSelection.reset();
    }

    if (providerSelection.selected.length > 0) {
      providerSelection.reset();
    }

    if (saveToParams) {
      setQueryParams({
        source: [],
        measurement: [],
        searchPg: null,
      });
    }
  }

  const [open, setIsOpen] = React.useState<boolean>(false);
  const [url, setUrl] = React.useState<string>('');
  const onIsActiveSwitch = () => {
    active.set(!active.value);
    setQueryParams({
      isActive: !active.value,
    });
  };
  return (
    <WrapStyled>
      <LabelStyled>
        <SvgSlidersHRegular />
        <span>Filter by</span>
      </LabelStyled>
      <FilterSource saveToParams={saveToParams} />
      <FilterType
        saveToParams={saveToParams}
        handleOpenHelpCenter={(url) => {
          setUrl(url);
          setIsOpen(true);
        }}
      />
      <CheckboxStyled checked={active.value} onClick={onIsActiveSwitch} label="Active" />
      {showReset ? (
        <Button color="primary" onClick={handleResetFilters} data-cy="resetKpiFilterBtn">
          Reset filter
        </Button>
      ) : null}
      <HelpCenterSidePanel
        url={url}
        isOpen={open}
        handleClose={() => {
          setIsOpen(false);
          setUrl('');
        }}
      />
    </WrapStyled>
  );
}

export default KpisFilters;
