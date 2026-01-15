import React from 'react';

import { get } from 'lodash';
import styled from 'styled-components';

import { useKpisFilter, withKpisFilterProvider } from '../../context/KpisFilterProvider';
import { useNewCustomKpi, withNewCustomKpiProvider } from '../../context/NewCustomKpiProvider';
import { useCreateCustomKpiMutation } from '../../graphql/kpi/mutationCreateCustomKpi';
import DOMPurify from 'dompurify';

import usePresenterMode from '../../hooks/usePresenterMode';
import { kpiInputArr } from '../../utils/kpi';

import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';

import { HELP_CENTER_URLS } from '../../configs/helpCenterUrls';
import Button from '../Button';
import Dialog, { useDialogState } from '../Dialog';
import HelpCenter from '../HelpCenter/HelpCenter';
import { useStepper } from '../Stepper';
import ErrorMessage from './ErrorMessage';
import Footer from './Footer';
import Header from './Header';
import KpiCalculation from './KpiCalculation';
import KpiDetails from './KpiDetails';
import KpisSelection from './KpisSelection';

const DialogStyled = styled(Dialog)`
  .NEXYPaper {
    max-width: 900px;
  }
`;
const totalSteps = 3;
const CreateCustomKpi = withKpisFilterProvider(
  withNewCustomKpiProvider(function CreateCustomKpi() {
    const [isKpiCreated, setIsKpiCreated] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    // - - - - - - - - -
    // Hooks
    // - - - - - - - - -
    const { isPresenterMode } = usePresenterMode();
    const { isOpen, toggleDialog } = useDialogState({
      initialState: false,
    });
    const {
      kpis: selectedKpis,
      name,
      description,
      calcType,
      resetState,
      includeSearch,
      setIncludeSearch,
    } = useNewCustomKpi();
    //@ts-ignore
    const { measurementSelection, providerSelection, search } = useKpisFilter();
    const { step, nextStep, previousStep, resetStep } = useStepper({
      initialValue: 1,
      end: totalSteps,
    });

    // - - - - - - - - -
    // Helper methods
    // - - - - - - - - -
    function resetDialog() {
      resetState();
      resetStep();
      // reset search and filters when closing the dialog
      // resetFilter();
      setIsKpiCreated(false);
      setIsError(false);
    }

    function handleToggleDialog() {
      if (!isOpen) {
        resetDialog();
      }

      toggleDialog();
    }

    function allowNext() {
      if (step === 1 && ((!includeSearch && selectedKpis.length === 0) || (includeSearch && !search.value))) {
        return false;
      } else if (step === 3 && !name) {
        return false;
      } else {
        return true;
      }
    }

    async function createKpi() {
      try {
        //@ts-ignore
        const response = await createCustomKpi();

        if (get(response, 'data.createCustomKpi.custom_kpi_id', false)) {
          setIsKpiCreated(true);
          setIsError(false);
        } else {
          setIsError(true);
        }
      } catch (e) {
        setIsError(true);
      }
    }

    // - - - - - - - - -
    // GraphQL mutation
    // - - - - - - - - -
    // @ts-ignore
    const [createCustomKpi, { error }] = useCreateCustomKpiMutation({
      name: DOMPurify.sanitize(name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
      description: DOMPurify.sanitize(description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
      calc_type: calcType,
      kpis: !includeSearch ? kpiInputArr(selectedKpis) : undefined,
      // if we activate includeSearch, selected kpis are calculated on backend side, we just visually select them
      search: includeSearch
        ? {
            query: search.value,
            provider_id: providerSelection.selected.length
              ? providerSelection.selected.map((p) => p.provider_id)
              : null,
            measurement_id: measurementSelection.selected.length
              ? measurementSelection.selected.map((m) => m.measurement_id)
              : null,
            sumOnly: false, // intentionally hardcoded to false
          }
        : undefined,
    });
    if (isPresenterMode) return null;
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button color="primary" variant="contained" onClick={handleToggleDialog} id="createCustomKpiBtn">
            Create custom KPI
          </Button>
          <HelpCenter url={HELP_CENTER_URLS.CUSTOM_KPI.HOW_TO_CREATE_CUSTOM_KPI} />
        </div>
        <DialogStyled isOpen={isOpen} onClose={toggleDialog}>
          <Header step={step} isKpiCreated={isKpiCreated} isError />
          {isError ? (
            <ErrorMessage
              error={error}
              handleBack={() => {
                setIsError(false);
              }}
              handleClose={() => {
                resetDialog();
                toggleDialog();
              }}
            />
          ) : step === 1 ? (
            <KpisSelection />
          ) : step === 2 ? (
            <KpiCalculation />
          ) : step === 3 && !isKpiCreated ? (
            <KpiDetails />
          ) : (
            <SuccessMessage
              successText="Creating your custom KPI will take couple of minutes. You can find your custom KPI in the KPI list afterwards."
              resetAction={resetDialog}
              resetText="Create another"
              confirmText="Back to Metrics"
              confirmAction={() => {
                resetDialog();
                toggleDialog();
              }}
            />
          )}
          {/* show footer only when not showing success message */}
          {!isKpiCreated && (
            <Footer
              isError={isError}
              step={step}
              totalSteps={totalSteps}
              onNextStep={nextStep}
              onPreviousStep={previousStep}
              onCreateKpi={createKpi}
              includeSearch={includeSearch}
              onSelectFooterCheckbox={() => {
                setIncludeSearch(!includeSearch);
              }}
              onDeselectFooterCheckbox={() => {
                setIncludeSearch(!includeSearch);
              }}
              handleToggleDialog={handleToggleDialog}
              allowNext={allowNext()}
            />
          )}
        </DialogStyled>
      </>
    );
  }),
);
export default CreateCustomKpi;
