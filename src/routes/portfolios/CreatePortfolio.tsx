import React from 'react';
import { RouterHistory, withRouter } from 'react-router-dom';

import { get } from 'lodash';

import {
  NexoyaBudgetDeltaHandlingPolicy,
  NexoyaFunnelStepType,
  NexoyaOptimizationType,
  NexoyaPortfolio,
} from '../../types';

import { usePortfolio } from '../../context/PortfolioProvider';
import { usePortfoliosFilter } from '../../context/PortfoliosFilterProvider';
import { useCreatePortfolioMutation } from '../../graphql/portfolio/mutationCreatePortfolio';

import usePresenterMode from '../../hooks/usePresenterMode';
import { buildPortfolioPathWithDates } from '../../utils/portfolio';

import Button from '../../components/Button';
import ButtonAsync from '../../components/ButtonAsync';
import { useDialogState } from '../../components/Dialog';
import ErrorMessage from '../../components/ErrorMessage';
import Fieldset from '../../components/Form/Fieldset/Fieldset';
import FormGroup from '../../components/Form/FormGroup';
import SidePanel, { SidePanelActions, SidePanelContent, useSidePanelState } from '../../components/SidePanel';
import TextField from '../../components/TextField';
import Typography from '../../components/Typography';
import { DateSelector } from '../../components/DateSelector';
import { PortfolioTypeSelector } from './components/PortfolioTypeSelector';
import PortfolioSuccessDialog from './components/PortfolioSuccessDialog';
import { PortfolioTargetTypeSelector } from './components/PortfolioTargetTypeSelector';
import styled from 'styled-components';
import { budgetRiskType } from '../../configs/portfolio';
import useUserStore from '../../store/user';
import Checkbox from '../../components/Checkbox';

type Props = {
  history: RouterHistory;
};
export const StepperWrapper = styled.div`
  width: 30%;
  padding-right: 48px;
`;
export const StepWrapper = styled.div`
  width: 70%;
  padding-left: 48px;
`;

function CreatePortfolio({ history }: Props) {
  const { isPresenterMode } = usePresenterMode();
  const { isOpen, toggleSidePanel, closeSidePanel } = useSidePanelState();
  const { user } = useUserStore();
  const { search, order }: Record<string, any> = usePortfoliosFilter();
  const userId: number = user?.user_id || 0;
  const {
    isOpen: isSuccessDialogOpen,
    toggleDialog: toggleSuccessDialog,
    closeDialog: closeSuccessDialog,
  } = useDialogState({
    initialState: false,
  });
  const { isSupportUser } = useUserStore();
  const { meta, reset, portfolioType }: Record<string, any> = usePortfolio();
  const [isAttributionEnabled, setIsAttributionEnabled] = React.useState(false);
  const [createPortfolio, { loading, error }] = useCreatePortfolioMutation({
    title: meta.value.title,
    description: '',
    startDate: meta.value.startDate,
    endDate: meta.value.endDate,
    type: meta.value.type,
    defaultOptimizationTarget: NexoyaFunnelStepType.Conversion,
    createdByUserId: userId,
    contents: [],
    optimizationType: NexoyaOptimizationType.Auto,
    optimizationRiskLevel: budgetRiskType.MODERATE,
    budgetDeltaHandlingPolicy: NexoyaBudgetDeltaHandlingPolicy.Ignore,
    order: get(order, 'value.orderByTitle', null),
    search: search.value,
    isAttributed: isAttributionEnabled,
  });
  // used to store info about newly created portfolio
  const newPortfolio = React.useRef<NexoyaPortfolio | undefined>();

  function allowFinish() {
    return meta.value.title && meta.value.type && meta.value.startDate && meta.value.endDate;
  }

  async function handleFinish(ev: any) {
    ev.preventDefault();

    try {
      const res = await createPortfolio();
      const portfolio = get(res, 'data.createPortfolio', null);

      if (portfolio) {
        toggleSidePanel();
        toggleSuccessDialog();
        newPortfolio.current = portfolio;
        // reset all data about previously created portfolio
        reset();
        setIsAttributionEnabled(false);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  if (isPresenterMode) return null;
  return (
    <>
      <Button color="primary" variant="contained" onClick={toggleSidePanel} data-cy="createPortfolioBtn">
        Create portfolio
      </Button>
      <SidePanel
        isOpen={isOpen}
        onClose={() => {
          toggleSidePanel();
          reset();
          setIsAttributionEnabled(false);
        }}
        paperProps={{
          style: {
            width: 'calc(100% - 218px)',
            maxWidth: '900px',
            paddingBottom: '78px',
          },
        }}
        data-cy="createPortfolioDialog"
      >
        <div className="border border-b-[#eaeaea] px-6 py-5">
          <h3 className="mb-1 text-xl font-medium text-neutral-900">Create a portfolio</h3>
        </div>
        <SidePanelContent>
          <Fieldset>
            <FormGroup style={{ width: '100%', gap: 8 }}>
              <Typography variant="h3">Portfolio name</Typography>
              <TextField
                id="title"
                name="title"
                value={meta.value.title}
                onChange={meta.handleChange}
                placeholder="Enter portfolio name"
              />
            </FormGroup>
            <FormGroup style={{ width: '100%', gap: 8 }}>
              <Typography variant="h3">When will your portfolio run?</Typography>
              <DateSelector
                dateFrom={meta.value.startDate}
                dateTo={meta.value.endDate}
                onDateChange={meta.handleDateChange}
                disableAfterDate={null}
                hidePastQuickSelection
                panelProps={{
                  side: 'bottom',
                  align: 'start',
                }}
                style={{
                  width: '100%',
                }}
              />
            </FormGroup>
            <FormGroup>
              <Typography variant="h3">What type of portfolio do you want to create?</Typography>
              <PortfolioTypeSelector />
            </FormGroup>
            {portfolioType.type === 'target-based' && (
              <FormGroup>
                <Typography variant="h3">What type of target do you want to set?</Typography>
                <PortfolioTargetTypeSelector />
              </FormGroup>
            )}
            {isSupportUser ? (
              <FormGroup>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center">
                    <Checkbox
                      name="attribution-enabled"
                      isChecked={isAttributionEnabled}
                      className="!pl-0"
                      onClick={() => setIsAttributionEnabled((prevState) => !prevState)}
                      label="Activate attribution for this portfolio"
                    />
                  </div>
                  {isAttributionEnabled && (
                    <div className="ml-5 max-w-3xl text-sm font-normal text-neutral-600">
                      This will automatically create an attributed funnel step with a default name. You can always
                      change these settings in <span className="font-medium">Portfolio settings &gt; Funnel</span>.
                    </div>
                  )}
                </div>
              </FormGroup>
            ) : null}
          </Fieldset>
        </SidePanelContent>
        <SidePanelActions>
          <ButtonAsync
            id="finish"
            variant="contained"
            color="primary"
            disabled={!allowFinish() || loading}
            onClick={handleFinish}
            style={{
              marginLeft: 'auto',
            }}
          >
            Create portfolio
          </ButtonAsync>
        </SidePanelActions>
        {error ? <ErrorMessage error={error} /> : null}
      </SidePanel>
      <PortfolioSuccessDialog
        isOpen={isSuccessDialogOpen}
        portfolio={newPortfolio.current}
        onClose={() => {
          newPortfolio.current = null;
          closeSuccessDialog();
          closeSidePanel();
        }}
        onStartNewProcess={() => {
          toggleSuccessDialog();
          toggleSidePanel();
          newPortfolio.current = null;
          setIsAttributionEnabled(false);
        }}
        onSuccess={() => {
          if (newPortfolio.current) {
            history.push(buildPortfolioPathWithDates(newPortfolio.current));
          }

          toggleSuccessDialog();
          toggleSidePanel();
          newPortfolio.current = null;
        }}
      />
    </>
  );
}

export default withRouter(CreatePortfolio);
