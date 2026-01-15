import { Fragment, useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaProviderFilter } from '../../../../types/types';

import { useSetWhitelistFilterMutation } from '../../../../graphql/integration/mutationSetWhitelistFilter';
import { useIntegrationQuery } from '../../../../graphql/integration/queryIntegration';

import { mergeQueryState } from '../../../../utils/graphql';
import { isEmptyObj } from '../../../../utils/object';

import Button from '../../../../components/Button';
import ButtonAsync from '../../../../components/ButtonAsync';
import ButtonBase from '../../../../components/ButtonBase';
import Dialog, { useDialogState } from '../../../../components/Dialog';
import DialogActions from '../../../../components/DialogActions';
import DialogContent from '../../../../components/DialogContent';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingPlaceholder from '../../../../components/LoadingPlaceholder';
import {
  ProviderFilterCards,
  ProviderFilterHeader,
  ProviderInfo,
  useProviderFiltersState,
} from '../../../../components/ProviderFilterBlock';
import Tooltip from '../../../../components/Tooltip';
import useOrganizationStore from '../../../../store/organization';

type Props = {
  integrationId: number;
  providerId: number;
  disabled?: boolean;
};
const WrapStyled = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 16px;
  cursor: pointer;
  color: #ccc;

  button:disabled {
    &:disabled {
      opacity: 30%;
    }
    &:hover {
      color: #bdbdbd;
    }
  }
`;
const DialogContentStyled = styled(DialogContent)`
  > div:last-of-type {
    margin-bottom: 0;
  }
`;
const LoadingWrapStyled = styled.div`
  height: 190px;

  & > div {
    height: 36px;
    margin-bottom: 10px;

    &:nth-child(1) {
      opacity: 1;
    }

    &:nth-child(2) {
      opacity: 0.75;
    }

    &:nth-child(3) {
      opacity: 0.5;
    }

    &:nth-child(4) {
      opacity: 0.25;
    }
  }
`;

function EditFilterButton({ integrationId, providerId, disabled }: Props) {
  const [skipQuery, setSkipQuery] = useState(true);
  const { customization } = useOrganizationStore();

  const { isOpen, openDialog, closeDialog } = useDialogState({
    initialState: false,
  });
  const { data, loading, refetch, ...intQuery } = useIntegrationQuery({
    integrationId,
    withFilters: true,
    withMeta: false,
    skip: skipQuery,
    fetchPolicy: 'network-only',
  });
  const providerFilters = get(data, 'integration.filterOptions', []) || [];
  const { groups, touched, addItems, removeItems, setInitial } = useProviderFiltersState<NexoyaProviderFilter>({
    groups: providerFilters,
  });
  useEffect(() => {
    if (providerFilters.length > 0) {
      setInitial(providerFilters);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerFilters]);
  // TODO: this submission is stupid. We need to rework the mutation into
  // https://gitlab.com/nexoya/ui-webapp/issues/287#note_206298526
  // For the time being we have it this ugly way, but needs to be fixed.
  // The same is the case for the settings page with editing integrations
  const [, whitelistMutState, extendSetWhitelistFilter] = useSetWhitelistFilterMutation({
    providerId,
    filterName: '',
    addList: [],
    removeList: [],
    lastFilter: false,
  });

  // COMMENT: this is exactly the same as we have in the integration OAuth pages
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
        refetch();
        setSkipQuery(true);
        closeDialog();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const { error } = mergeQueryState(intQuery, whitelistMutState);
  return (
    <>
      <Tooltip
        placement="bottom"
        size="small"
        variant="dark"
        content={
          disabled
            ? `You do not have sufficient privileges to edit the integration filter.`
            : `Edit integration filter.`
        }
        data-cy="editToolTip"
      >
        <WrapStyled>
          <ButtonBase
            disabled={disabled}
            onClick={() => {
              setSkipQuery(false);
              openDialog();
            }}
          >
            <Pencil className="h-4 w-4 text-neutral-300" />
          </ButtonBase>
        </WrapStyled>
      </Tooltip>
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        aria-labelledby="alter-dialog-title"
        aria-describedby="alert-dialog-description"
        data-cy="edit-filter-dialog"
      >
        <DialogContentStyled id="alert-dialog-description">
          <ProviderInfo providerId={providerId} data-cy={`provider-${providerId}`} />
          {loading ? (
            <LoadingWrapStyled>
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
            </LoadingWrapStyled>
          ) : providerFilters.length === 0 || isEmptyObj(groups) ? (
            <div
              style={{
                marginBottom: 25,
                maxWidth: 410,
              }}
              data-cy="noSubAccounts"
            >
              <p>
                We could not find any sub-accounts or views. If this is incorrect, please contact support at{' '}
                {customization?.supportMail} and we'll see what the problem is.
              </p>
            </div>
          ) : (
            providerFilters.map((pf) => {
              const groupRef = groups[pf.filterName];
              const allSelected = groupRef.selected.length === pf.filterList.length;
              return (
                <Fragment key={pf.filterName}>
                  <ProviderFilterHeader
                    providerId={providerId}
                    allSelected={allSelected}
                    name={pf.filterName}
                    addItems={() => addItems(pf.filterName, pf.filterList)}
                    removeItems={() => removeItems(pf.filterName, pf.filterList)}
                    data-cy="providerFilterHeader"
                  />
                  <ProviderFilterCards
                    list={pf.filterList}
                    name={pf.filterName}
                    selected={groupRef.selected}
                    addItems={addItems}
                    removeItems={removeItems}
                  />
                </Fragment>
              );
            })
          )}
        </DialogContentStyled>
        <DialogActions>
          <Button id="close" variant="contained" onClick={closeDialog}>
            Close
          </Button>
          <ButtonAsync
            id="update"
            variant="contained"
            color="primary"
            disabled={!touched || loading}
            loading={whitelistMutState.loading}
            onClick={submitViews}
            style={{
              marginLeft: '25',
            }}
          >
            Update
          </ButtonAsync>
        </DialogActions>
      </Dialog>
      {error ? <ErrorMessage error={error} data-cy="errorMessage" /> : null}
    </>
  );
}

export default EditFilterButton;
