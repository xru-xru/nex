import React, { useCallback, useEffect, useState } from 'react';
import { Match, withRouter } from 'react-router-dom';

import dayjs from 'dayjs';
import styled from 'styled-components';

import {
  NexoyaBudgetDeltaHandlingPolicy,
  NexoyaPortfolioDashboardUrl,
  NexoyaPortfolioSyncStatus,
  NexoyaPortfolioType,
  NexoyaPortfolioV2,
  NexoyaTargetBiddingApplyMode,
} from 'types';

import { useUpdatePortfolioMutation } from '../../../graphql/portfolio/mutationUpdatePortfolio';

import useAllowSubmit from '../../../hooks/useAllowSubmit';
import { format, getRelativeTimeString } from '../../../utils/dates';
import {
  BUDGET_DELTA_OPTIONS,
  getBudgetProposalTargetBiddingApplyTypes,
  riskTypes,
} from '../../../utils/portfolioEdit';

import Button from '../../../components/Button';
import ButtonAdornment from '../../../components/ButtonAdornment';
import Checkbox from '../../../components/Checkbox';
import { DateSelector } from '../../../components/DateSelector';
import { useDialogState } from '../../../components/Dialog';
import { useDropdownMenu } from '../../../components/DropdownMenu';
import ErrorMessage from '../../../components/ErrorMessage';
import Fieldset from '../../../components/Form/Fieldset/Fieldset';
import FormGroup from '../../../components/Form/FormGroup';
import MenuItem from '../../../components/MenuItem';
import MenuList from '../../../components/MenuList';
import Panel from '../../../components/Panel';
import TextField from '../../../components/TextField';
import Typography from '../../../components/Typography';
import SvgCaretDown from '../../../components/icons/CaretDown';
import SvgPlusRegular from '../../../components/icons/PlusRegular';
import { BudgetOptimizationItem, mapRiskIcon } from '../../portfolios/components/PortfolioBudget';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components-ui/DropdownMenu';
import { Button as ShadcnButton } from '../../../components-ui/Button';
import SvgEllipsisV from '../../../components/icons/EllipsisV';
import { useUnsavedChanges } from '../../../context/UnsavedChangesProvider';
import { isEqual, sortBy } from 'lodash';
import { nexyColors } from '../../../theme';
import ButtonAsync from '../../../components/ButtonAsync';
import { budgetOptimizationType } from '../../../configs/portfolio';
import { LabelsEditTable } from '../components/Labels/LabelsEditTable';
import { ConfirmationDialog } from '../components/PortfolioEditFunnel/ConfirmationDialog';
import { useLocalLabels } from '../../../hooks/useLocalLabels';
import useUserStore from '../../../store/user';
import { cn } from '../../../lib/utils';
import { ActivateAttributionDialog } from './ActivateAttributionDialog';
import { useTenantName } from '../../../hooks/useTenantName';
import { CircleCheck, CircleDashed, CircleX } from 'lucide-react';
import SvgInfoCircle from '../../../components/icons/InfoCircle';
import { useActivateAttributionMutation } from '../../../graphql/portfolioRules/mutationActivateAttributionRule';
import PortfolioFeatureSwitch from '../../../components/PortfolioFeatureSwitch';
import { PORTFOLIO_FEATURE_FLAGS } from '../../../constants/featureFlags';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  portfolio: NexoyaPortfolioV2;
  match: Match;
};
type FormValues = {
  title: string;
  startDate: Date;
  endDate: Date;
  optimizationType: string;
  optimizationRiskLevel: number;
  portfolioDashboardUrls: NexoyaPortfolioDashboardUrl[];
  budgetDeltaHandlingPolicy: NexoyaBudgetDeltaHandlingPolicy;
  budgetProposalTargetBiddingApplyMode: NexoyaTargetBiddingApplyMode;
  skipTrainingDays?: number;
};
const WrapStyled = styled.div`
  width: 100%;

  .riskLevel {
    text-transform: uppercase;
  }
`;

export const BudgetDeltasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  margin-bottom: 32px;
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BudgetDelaOptionsWrapper = styled.div`
  display: flex;
  margin-top: 24px;
  gap: 12px;
  flex-wrap: wrap;
`;

export const OptionCard = styled.div<{ selected: boolean }>`
  display: flex;
  width: 100%;
  padding: 48px 14px 24px 14px;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  flex: 1 1 150px;

  &:last-child {
    padding-top: 24px;
  }

  &:hover {
    background: ${({ selected }) => (selected ? nexyColors.seasalt : nexyColors.paleWhite)};
  }

  background: ${({ selected }) => (selected ? nexyColors.seasalt : 'white')};
  box-shadow: ${({ selected }) => (selected ? '' : '0px 2px 3px -1px rgba(42, 43, 46, 0.1)')};
`;

const StyledCustomDivider = styled.div`
  text-align: center;
  position: relative;
  margin: 20px 0;

  &::before,
  &::after {
    content: ' ';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #eaeaea;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  font-size: 1em;
  color: #000; /* or any color you prefer */
`;

function PortfolioGeneralSettings({ match, portfolio }: Props) {
  if (!portfolio) {
    return 'Loading...';
  }

  const portfolioId = parseInt(match.params.portfolioID, 10);
  const tenantName = useTenantName();

  const {
    open: isSkipTrainingMenuOpen,
    closeMenu: closeSkipTrainingMenu,
    toggleMenu: toggleSkipTrainingMenu,
    anchorEl: skipTrainingAnchor,
  } = useDropdownMenu();
  const { isOpen: isDialogOpen, toggleDialog } = useDialogState({
    initialState: false,
  });

  const {
    title,
    start,
    end,
    optimizationType,
    optimizationRiskLevel,
    budgetDeltaHandlingPolicy,
    portfolioDashboardUrls,
    budgetProposalTargetBiddingApplyMode,
    skipTrainingDays,
  } = portfolio;

  const [metabaseLinks, setMetabaseLinks] = useState<NexoyaPortfolioDashboardUrl[]>(
    portfolioDashboardUrls?.length ? portfolioDashboardUrls : [{ name: '', url: '' }],
  );
  const { isOpen: isApplyOpen, openDialog: openApplyDialog, closeDialog: closeApplyDialog } = useDialogState();
  const { isOpen: isDiscardOpen, openDialog: openDiscardDialog, closeDialog: closeDiscardDialog } = useDialogState();
  const {
    isOpen: isAttributionOpen,
    openDialog: openAttributionDialog,
    closeDialog: closeAttributionDialog,
  } = useDialogState();
  const { setHasUnsavedChanges } = useUnsavedChanges();

  const {
    labels: labelsState,
    setLabels,
    resetLabels,
    handleEdit: handleEditLabels,
    handleDelete: handleDeleteLabels,
    commitChanges: commitLabelsChanges,
    hasPendingChanges: hasPendingLabelsChanges,
  } = useLocalLabels({ portfolioMeta: portfolio });

  const initialState: FormValues = {
    title,
    startDate: new Date((start || '').substring(0, 10)),
    endDate: new Date((end || '').substring(0, 10)),
    optimizationType: optimizationType || '',
    optimizationRiskLevel: optimizationRiskLevel || 0,
    portfolioDashboardUrls: portfolioDashboardUrls?.length
      ? portfolioDashboardUrls.filter((pdu) => pdu.url && pdu.name).map(({ name, url }) => ({ name, url }))
      : [],
    budgetProposalTargetBiddingApplyMode,
    budgetDeltaHandlingPolicy,
    skipTrainingDays,
  };
  const [form, setForm] = useState<FormValues>(initialState);
  const [activateAttribution, { loading: loadingAttributionActivation }] = useActivateAttributionMutation();

  useEffect(() => {
    setForm(initialState);
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(
      !isEqual(initialState, form) || !isEqual(sortBy(labelsState, 'labelId'), sortBy(portfolio.labels, 'labelId')),
    );
  }, [initialState, form]);

  const handleChange = useCallback(
    (ev: { target: { name: keyof FormValues; value: unknown } }) => {
      const { name, value } = ev.target;
      setForm((s) => ({ ...s, [name]: value }));
    },
    [setForm],
  );

  const { isSupportUser } = useUserStore();

  function handleDateChange({ from, to }) {
    setForm({
      ...form,
      startDate: new Date(format(from, 'utcMidday', true)),
      endDate: new Date(format(to, 'utcMidday', true)),
    });
  }

  useEffect(() => {
    if (metabaseLinks.filter((mb) => mb.name && mb.url)) {
      setForm((prevState) => ({
        ...prevState,
        portfolioDashboardUrls: metabaseLinks.filter((mb) => mb.name && mb.url).map(({ name, url }) => ({ name, url })),
      }));
    }
  }, [metabaseLinks]);

  const allowSubmit =
    useAllowSubmit({
      initialValues: initialState,
      values: form,
    }).allowSubmit || hasPendingLabelsChanges;

  const [updatePortfolioMeta, { loading, error }] = useUpdatePortfolioMutation({
    portfolioId: portfolioId,
    ...form,
  });

  async function handleSubmit() {
    try {
      const res = await updatePortfolioMeta();
      await commitLabelsChanges();

      if (res?.data?.updatePortfolio) {
        if (isDialogOpen) {
          toggleDialog();
        } // quick fix, always close dialog (even
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const getWarningMessageIfChangingDates = () => {
    if (
      !dayjs(initialState?.startDate).isSame(dayjs(form.startDate), 'day') ||
      !dayjs(initialState?.endDate).isSame(dayjs(form.endDate), 'day')
    ) {
      return 'Changing dates will affect the budget, so you will have to set it up again.';
    } else return null;
  };

  const portfolioRiskType = portfolio.type === NexoyaPortfolioType.Budget ? 'BUDGET' : 'TARGET';

  const renderPortfolioSyncStatus = (status: NexoyaPortfolioSyncStatus) => {
    switch (status) {
      case NexoyaPortfolioSyncStatus.Synced:
        return (
          <div>
            <CircleCheck
              className="h-5 w-5"
              style={{
                fill: nexyColors.greenTeal,
                stroke: nexyColors.white,
              }}
            />
            <span className="ml-1 text-xs text-neutral-500">
              synced {portfolio.lastSyncedAt ? getRelativeTimeString(new Date(portfolio.lastSyncedAt)) : null}
            </span>
          </div>
        );
      case NexoyaPortfolioSyncStatus.Syncing:
        return (
          <div>
            <CircleDashed
              className="h-4 w-4"
              style={{
                fill: nexyColors.white,
                stroke: nexyColors.pumpkinOrange,
              }}
            />
            <span className="ml-1 text-xs text-neutral-500">sync in progress</span>
          </div>
        );
      case NexoyaPortfolioSyncStatus.Error:
        return (
          <div>
            <CircleX
              className="h-5 w-5"
              style={{
                fill: nexyColors.red400,
                stroke: nexyColors.white,
              }}
            />
            <span className="ml-1 text-xs text-neutral-500">sync failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isSupportUser ? (
        <FormGroup>
          <div className="flex max-w-[340px] items-center justify-between rounded-md border border-neutral-100 bg-neutral-50 px-4 py-2.5">
            <div>
              <div className="flex items-center gap-2 self-center">
                <SvgInfoCircle className="text-neutral-400" />
                <div className="text-sm font-normal text-neutral-600">Portfolio fetch status</div>
              </div>
            </div>
            <div>{renderPortfolioSyncStatus(portfolio.syncStatus)}</div>
          </div>
        </FormGroup>
      ) : null}
      <div className="mb-8 flex w-full max-w-6xl flex-row items-end justify-between">
        <div>
          <div className="text-[20px] font-medium tracking-normal">General</div>
          <div className="text-md font-normal text-neutral-500">
            Define your general portfolio settings, including overspend handling and optimization setup.
          </div>
        </div>
        <div className="flex h-fit gap-4">
          <Button variant="contained" onClick={openDiscardDialog} disabled={loading || !allowSubmit}>
            Discard changes
          </Button>
          <ButtonAsync
            variant="contained"
            color="primary"
            loading={loading}
            disabled={!allowSubmit}
            onClick={openApplyDialog}
          >
            Apply changes
          </ButtonAsync>
        </div>
      </div>
      <div className="max-w-6xl">
        <div>
          <WrapStyled>
            <Fieldset
              style={{
                marginBottom: 32,
              }}
            >
              <FormGroup>
                <TextField
                  id="title"
                  label="Name"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Portfolio name"
                />
              </FormGroup>

              <FormGroup>
                <DateSelector
                  dateFrom={form.startDate}
                  dateTo={form.endDate}
                  onDateChange={handleDateChange}
                  disableAfterDate={null}
                  useNexoyaDateRanges
                  panelProps={{
                    side: 'bottom',
                    align: 'start',
                  }}
                  style={{
                    width: '100%',
                  }}
                />
              </FormGroup>
              <PortfolioFeatureSwitch
                features={[PORTFOLIO_FEATURE_FLAGS.ATTRIBUTION]}
                renderOld={() => null}
                renderNew={() => (
                  <FormGroup>
                    <Typography className="mb-1" variant="h3">
                      Attribution
                    </Typography>
                    <div className="text-md mb-6 font-normal text-neutral-500">
                      Attribute funnel step data by using a statistical regression model.
                    </div>
                    <div className="flex w-full items-center justify-between border border-neutral-100 bg-neutral-50 px-4 py-3">
                      <div>
                        <p className="mb-2 text-xs font-medium uppercase text-neutral-400">Status</p>
                        {portfolio?.isAttributed ? (
                          <div className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-neutral-900">
                            Active
                          </div>
                        ) : (
                          <div className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-900">
                            Not active
                          </div>
                        )}
                      </div>
                      <Button
                        className={cn('!h-fit', portfolio?.isAttributed && '!bg-[#EFF0F3] !text-neutral-400')}
                        color={portfolio?.isAttributed ? 'tertiary' : 'primary'}
                        variant="contained"
                        size="small"
                        disabled={portfolio?.isAttributed}
                        onClick={openAttributionDialog}
                      >
                        {portfolio?.isAttributed ? 'Deactivate attribution' : 'Configure and activate'}
                      </Button>
                    </div>
                  </FormGroup>
                )}
              />

              {form.optimizationType !== budgetOptimizationType.SKIP ? (
                <>
                  <Typography className="mb-1" variant="h3">
                    Budget reallocation risk level
                  </Typography>
                  <div className="text-md mb-6 font-normal text-neutral-500">
                    What risk level should budget reallocations be performed at?
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                      gap: 8,
                    }}
                  >
                    {riskTypes[portfolioRiskType].map((item, index) => (
                      <BudgetOptimizationItem
                        key={index}
                        className={item.value === form.optimizationRiskLevel ? 'selectedOptimization' : ''}
                        data-cy={item.title}
                        style={{
                          width: '30%',
                        }}
                        onClick={() =>
                          handleChange({
                            target: {
                              name: 'optimizationRiskLevel',
                              value: item.value,
                            },
                          })
                        }
                      >
                        {mapRiskIcon[item.value]}
                        <Typography variant="h5">{item.title}</Typography>
                        <Typography variant="subtitlePill" withEllipsis={false}>
                          {item.description}
                        </Typography>
                      </BudgetOptimizationItem>
                    ))}
                  </div>
                </>
              ) : null}
              {/* Budget applying mode */}
              {isSupportUser ? (
                <>
                  <Typography
                    variant="h3"
                    style={{
                      marginTop: 24,
                      marginBottom: 24,
                    }}
                  >
                    Budget apply mode
                  </Typography>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                    }}
                  >
                    {getBudgetProposalTargetBiddingApplyTypes(tenantName).map((item, index) => (
                      <BudgetOptimizationItem
                        key={index}
                        className={cn(
                          form.budgetProposalTargetBiddingApplyMode === item.type ? 'selectedOptimization' : '',
                          'flex flex-col justify-center',
                        )}
                        data-cy={item.title}
                        style={{
                          width: '30%',
                        }}
                        onClick={() =>
                          handleChange({
                            target: {
                              name: 'budgetProposalTargetBiddingApplyMode',
                              value: item.type,
                            },
                          })
                        }
                      >
                        <Typography variant="h5">{item.title}</Typography>
                        <Typography variant="subtitlePill" withEllipsis={false}>
                          {item.description}
                        </Typography>
                      </BudgetOptimizationItem>
                    ))}
                  </div>
                </>
              ) : null}
            </Fieldset>
            {/* Budget delta */}
            {portfolio.type === NexoyaPortfolioType.Budget ? (
              <BudgetDeltasWrapper>
                <TextWrapper>
                  <Typography variant="h3">Budget delta</Typography>
                  <Typography withEllipsis={false} variant="subtitle">
                    How would you like {tenantName} to handle deltas between planned budget vs. spent during a budget
                    allocation?
                  </Typography>
                  <Typography style={{ fontSize: 13 }} withEllipsis={false} variant="subtitle">
                    Note: Handling deltas will be done at every start of a new budget application. Changing the setting
                    will have an impact from the budget allocation onwards.
                  </Typography>
                </TextWrapper>
                <BudgetDelaOptionsWrapper>
                  {BUDGET_DELTA_OPTIONS.map((budgetDeltaOption) => (
                    <OptionCard
                      onClick={() =>
                        handleChange({
                          target: {
                            name: 'budgetDeltaHandlingPolicy',
                            value: budgetDeltaOption.id,
                          },
                        })
                      }
                      selected={form?.budgetDeltaHandlingPolicy === budgetDeltaOption.id}
                      key={budgetDeltaOption.id}
                    >
                      {budgetDeltaOption.image}
                      <Typography variant="paragraph" withEllipsis={false}>
                        {budgetDeltaOption.title}
                      </Typography>
                      <Typography style={{ fontSize: 13, fontWeight: 400 }} variant="subheadline" withEllipsis={false}>
                        {budgetDeltaOption.description}
                      </Typography>
                    </OptionCard>
                  ))}
                </BudgetDelaOptionsWrapper>
                <div style={{ color: nexyColors.blueyGrey, marginTop: 24 }}>
                  or{' '}
                  <Checkbox
                    disabled={false}
                    data-cy="ignoreBudgetDelta"
                    label="Ignore deltas. Don’t allocate budget."
                    checked={form?.budgetDeltaHandlingPolicy === NexoyaBudgetDeltaHandlingPolicy.Ignore}
                    onClick={() => {
                      handleChange({
                        target: {
                          name: 'budgetDeltaHandlingPolicy',
                          value: NexoyaBudgetDeltaHandlingPolicy.Ignore,
                        },
                      });
                    }}
                  />
                </div>
              </BudgetDeltasWrapper>
            ) : null}

            {/* Labels management */}
            <>
              <TextWrapper style={{ marginBottom: 24 }}>
                <Typography variant="h3">Labels</Typography>
                <Typography withEllipsis={false} variant="subtitle">
                  This setting allows defining the labels.
                </Typography>
                <Typography style={{ fontSize: 13 }} withEllipsis={false} variant="subtitle">
                  Note: Assigning contents to labels can be done in the ‘Content’ part of the application. The
                  configuration of the labels will not influence how budget is allocated to contents in order to ensure
                  an optimal performance per label.
                </Typography>
              </TextWrapper>
              <LabelsEditTable
                portfolioId={portfolioId}
                labels={labelsState}
                setLabels={setLabels}
                handleEdit={handleEditLabels}
                handleDelete={handleDeleteLabels}
                loadingUpdate={false}
                loadingDelete={false}
              />
            </>
            {/* Skip training days */}
            {isSupportUser ? (
              <>
                <Typography
                  variant="h3"
                  style={{
                    marginTop: 24,
                    marginBottom: 24,
                  }}
                >
                  Skip training days for optimizations
                </Typography>
                <Button
                  id="riskLevelBtn"
                  onClick={toggleSkipTrainingMenu}
                  variant="contained"
                  color="secondary"
                  flat
                  type="button"
                  style={{
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                  endAdornment={
                    <ButtonAdornment position="end">
                      <SvgCaretDown
                        style={{
                          transform: `rotate(${isSkipTrainingMenuOpen ? '180' : '0'}deg)`,
                        }}
                      />
                    </ButtonAdornment>
                  }
                  ref={skipTrainingAnchor}
                >
                  {form.skipTrainingDays}
                </Button>
                <Panel
                  open={isSkipTrainingMenuOpen}
                  color="dark"
                  anchorEl={skipTrainingAnchor.current}
                  placement="bottom-start"
                  style={{
                    minWidth: 100,
                    maxHeight: 500,
                  }}
                  popperProps={{
                    style: {
                      zIndex: 1301,
                    },
                  }}
                >
                  <MenuList>
                    {[0, 1, 2, 3].map((value) => (
                      <MenuItem
                        key={value}
                        buttonProps={{ style: { background: 'none', justifyContent: 'center' } }}
                        onClick={() => {
                          handleChange({
                            target: {
                              name: 'skipTrainingDays',
                              value,
                            },
                          });
                          closeSkipTrainingMenu();
                        }}
                      >
                        {value}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Panel>
              </>
            ) : null}
            {/*   n  */}
            {isSupportUser ? (
              <div style={{ marginTop: 40 }}>
                {metabaseLinks.map((mb, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                    <FormGroup>
                      <TextField
                        id={`metabaseName-${idx}`}
                        label="Metabase Name"
                        placeholder="Overview"
                        name="name"
                        value={mb.name}
                        onChange={(event) => {
                          const { name, value } = event.target;
                          setMetabaseLinks((prevState) => {
                            const newState = [...prevState];
                            newState[idx] = { ...newState[idx], [name]: value };
                            return newState;
                          });
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id={`metabaseUrl-${idx}`}
                        label="Metabase URL"
                        placeholder="https://metabase.nexoya.io/api/public/dashboard/1"
                        name="url"
                        value={mb.url}
                        onChange={(event) => {
                          const { name, value } = event.target;
                          setMetabaseLinks((prevState) => {
                            const newState = [...prevState];
                            newState[idx] = { ...newState[idx], [name]: value };
                            return newState;
                          });
                        }}
                      />
                    </FormGroup>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="m-auto" disabled={loading} asChild>
                        <ShadcnButton className="rounded-full" variant="ghost" size="sm">
                          <SvgEllipsisV
                            style={{
                              fontSize: 18,
                            }}
                          />
                        </ShadcnButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-52 font-medium" align="start">
                        <DropdownMenuItem
                          disabled={metabaseLinks?.length === 1 && idx === 0 && mb.name === '' && mb.url === ''}
                          onSelect={() => {
                            if (metabaseLinks?.length === 1 && idx === 0 && (mb.name || mb.url)) {
                              setMetabaseLinks([{ name: '', url: '' }]);
                            } else {
                              setMetabaseLinks((currentLinks) => currentLinks.filter((_, linkIdx) => idx !== linkIdx));
                            }
                          }}
                        >
                          <span className="text-red-400">Delete metabase name</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
                <Button
                  style={{ marginBottom: 24 }}
                  color="secondary"
                  variant="contained"
                  endAdornment={
                    <ButtonAdornment>
                      <SvgPlusRegular />
                    </ButtonAdornment>
                  }
                  onClick={() => setMetabaseLinks((currentLinks) => [...currentLinks, { name: '', url: '' }])}
                >
                  Add More
                </Button>
              </div>
            ) : null}
          </WrapStyled>
        </div>
        {error ? <ErrorMessage error={error} /> : null}
        <ConfirmationDialog
          description="Your changes will apply to the entire setup in your portfolio."
          warning={getWarningMessageIfChangingDates()}
          onConfirm={handleSubmit}
          type="apply"
          isOpen={isApplyOpen}
          onCancel={closeApplyDialog}
          disabled={loading}
        />
        <ConfirmationDialog
          description="Your changes will be discarded. The settings will revert to the current active setup in your portfolio."
          onConfirm={() => {
            setForm(initialState);
            resetLabels();
            closeDiscardDialog();
          }}
          type="discard"
          isOpen={isDiscardOpen}
          onCancel={closeDiscardDialog}
        />
        <ActivateAttributionDialog
          open={isAttributionOpen}
          close={closeAttributionDialog}
          handleCancel={closeAttributionDialog}
          loading={loadingAttributionActivation}
          handleConfirm={({ createCopy, measuredFunnelStepId, attributedFunnelStepTitle }) => {
            activateAttribution({
              variables: {
                teamId: portfolio?.teamId,
                portfolioId,
                createCopy,
                measuredFunnelStepId,
                attributedFunnelStepTitle,
              },
            }).then(({ data }) => {
              const portfolioId = data?.activateAttribution?.portfolioId;
              if (portfolioId) {
                window.location.href = `/portfolios/${portfolioId}`;
              }
              closeAttributionDialog();
            });
          }}
        />
      </div>
    </>
  );
}

export default withRouter(PortfolioGeneralSettings);
