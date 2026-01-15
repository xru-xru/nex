import { Fragment, useEffect, useLayoutEffect, useState } from 'react';

import { get, isEmpty } from 'lodash';
import queryString from 'query-string';
import styled, { createGlobalStyle } from 'styled-components';

import { NexoyaProviderFilter } from '../../types/types';

import { useSetWhitelistFilterMutation } from '../../graphql/integration/mutationSetWhitelistFilter';

import ButtonAsync from '../../components/ButtonAsync';
import ErrorBoundary from '../../components/ErrorBoundary';
import ErrorMessage from '../../components/ErrorMessage';
import {
  ProviderFilterCards,
  ProviderFilterHeader,
  useProviderFiltersState,
} from '../../components/ProviderFilterBlock';
import CorruptionError from './components/CorruptionError';
import Success from './components/Success';

import { useIntegrationQuery } from '../../graphql/integration/queryIntegration';
import { NumberParam, useQueryParams } from 'use-query-params';
import Spinner from '../../components/Spinner';
import { isProviderDataCorrupted } from './useOauthUrlData';

const GlobalStyle = createGlobalStyle`
  #root {
    overflow: hidden;
  }
`;
const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 550px;
  margin: 0 auto;
  padding: 25px;
`;

const IS_SINGLE_SELECT_PARAM_NAME = 'single_select';

function OauthProviderFilters() {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [queryParams] = useQueryParams({
    integration_id: NumberParam,
    provider_id: NumberParam,
  });

  const query = queryString.parse(window.location.search);
  const isSingleSelect = query[IS_SINGLE_SELECT_PARAM_NAME] && query[IS_SINGLE_SELECT_PARAM_NAME] === 'true';
  const integrationId = queryParams?.integration_id;
  const providerId = queryParams?.provider_id;

  const { data, loading: integrationLoading } = useIntegrationQuery({
    integrationId,
    withFilters: true,
    withMeta: false,
    fetchPolicy: 'cache-first',
  });
  const providerFilters = data?.integration?.filterOptions || [];

  const isDataCorrupted = isProviderDataCorrupted(providerId, providerFilters);

  const { groups, touched, addItems, removeItems, setInitial } = useProviderFiltersState<NexoyaProviderFilter>({
    groups: !isDataCorrupted && !integrationLoading ? providerFilters : [],
  });

  // TODO: this submission is stupid. We need to rework the mutation into
  // https://gitlab.com/nexoya/ui-webapp/issues/287#note_206298526
  // For the time being we have it this ugly way, but needs to be fixed.
  // The same is the case for the settings page with editing integrations
  const [, { loading, error }, extendSetWhitelistFilter] = useSetWhitelistFilterMutation({
    providerId: providerId,
    filterName: '',
    addList: [],
    removeList: [],
    lastFilter: false,
  });
  // Comment: let's select all items by default
  useLayoutEffect(() => {
    if (!isDataCorrupted && !isSingleSelect) {
      providerFilters.forEach((pf) => {
        addItems(pf.filterName, pf.filterList);
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!integrationLoading && !isDataCorrupted && providerFilters.length > 0) {
      setInitial(providerFilters);
    }
  }, [integrationLoading, isDataCorrupted, providerFilters, setInitial]);

  // If we have single_select set to true in params and at least one selected
  // item, selection of other items should be disabled
  function disableSelect() {
    const selectedItemsLength = Object.keys(groups).reduce(
      (acc, currItem) => acc + groups[currItem].selected.length,
      0,
    );
    return isSingleSelect && selectedItemsLength > 0;
  }

  // COMMENT: this is exactly the same as we have in the Integration card
  // in the settings page.
  // TODO: if we use it one more time somewhere, let's make it more generic component
  async function submitViews() {
    let lastFilterIndex = null;
    const toSubmit = Object.keys(groups).reduce((prev, key, index) => {
      const filter = {
        filterName: key,
        addList: Object.keys(groups[key].toAddMap),
        removeList: Object.keys(groups[key].toRemoveMap),
        index,
      };

      if (filter.addList.length || filter.removeList.length) {
        lastFilterIndex = index;
        prev.push(filter);
      }

      return prev;
    }, []);

    try {
      const res = [];
      for (const item of toSubmit) {
        const { index, ...rest } = item;
        const mutationResult = await extendSetWhitelistFilter({
          ...rest,
          lastFilter: index === lastFilterIndex,
        });
        res.push(mutationResult);
      }

      if (res.some((r) => get(r, 'data.setWhitelistFilter', false))) {
        window.close();
        setShowSuccess(true);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  if (integrationLoading || loading || isEmpty(groups)) {
    return (
      <WrapStyled>
        <Spinner />
      </WrapStyled>
    );
  }

  return (
    <ErrorBoundary>
      <GlobalStyle />
      <WrapStyled>
        {isDataCorrupted ? (
          <CorruptionError />
        ) : showSuccess ? (
          <Success />
        ) : (
          <>
            {providerFilters?.map((pf, index) => {
              const groupRef = groups?.[pf?.filterName];
              const allSelected = groupRef?.selected?.length === pf.filterList.length;
              return (
                <Fragment key={pf.filterName}>
                  <ProviderFilterHeader
                    providerId={providerId}
                    allSelected={allSelected}
                    addItems={() => addItems(pf.filterName, pf.filterList)}
                    removeItems={() => removeItems(pf.filterName, pf.filterList)}
                    name={pf.filterName}
                    withProviderInfo={index === 0}
                    disabled={disableSelect()}
                  />
                  <ProviderFilterCards
                    list={pf.filterList}
                    name={pf.filterName}
                    selected={groupRef?.selected}
                    addItems={addItems}
                    removeItems={removeItems}
                    disabled={disableSelect()}
                  />
                </Fragment>
              );
            })}
            <div data-cy="connectBtn">
              <ButtonAsync
                id="connect"
                disabled={!touched || loading || integrationLoading}
                loading={loading || integrationLoading}
                color="primary"
                variant="contained"
                onClick={submitViews}
              >
                Connect
              </ButtonAsync>
            </div>
          </>
        )}
      </WrapStyled>
      {error ? <ErrorMessage error={error} data-cy="errorMessage" /> : null}
    </ErrorBoundary>
  );
}

export default OauthProviderFilters;
