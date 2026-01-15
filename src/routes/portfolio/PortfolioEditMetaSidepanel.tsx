import React, { useCallback, useEffect, useState } from 'react';
import { Match, withRouter } from 'react-router-dom';

import dayjs from 'dayjs';
import styled from 'styled-components';

import {
  NexoyaBudgetDeltaHandlingPolicy,
  NexoyaPortfolioDashboardUrl,
  NexoyaPortfolioType,
  NexoyaPortfolioV2,
  NexoyaTargetBiddingApplyMode,
} from 'types';

import { useUpdatePortfolioMutation } from '../../graphql/portfolio/mutationUpdatePortfolio';

import useAllowSubmit from '../../hooks/useAllowSubmit';
import { useImpactGroups } from '../../hooks/useImpactGroups';
import { format } from '../../utils/dates';
import { BUDGET_DELTA_OPTIONS, getBudgetProposalTargetBiddingApplyTypes, riskTypes } from '../../utils/portfolioEdit';

import Button from '../../components/Button';
import ButtonAdornment from '../../components/ButtonAdornment';
import ButtonAsync from '../../components/ButtonAsync';
import ButtonIcon from '../../components/ButtonIcon';
import Checkbox from '../../components/Checkbox';
import { DateSelector } from '../../components/DateSelector';
import { useDialogState } from '../../components/Dialog';
import DialogTitle from '../../components/DialogTitle';
import { useDropdownMenu } from '../../components/DropdownMenu';
import ErrorMessage from '../../components/ErrorMessage';
import Fieldset from '../../components/Form/Fieldset/Fieldset';
import FormGroup from '../../components/Form/FormGroup';
import FormControlLabel from '../../components/FormControlLabel';
import MenuItem from '../../components/MenuItem';
import MenuList from '../../components/MenuList';
import Panel from '../../components/Panel';
import Radio from '../../components/Radio';
import RadioGroup from '../../components/RadioGroup';
import SidePanel, { SidePanelActions, SidePanelContent } from '../../components/SidePanel';
import TextField from '../../components/TextField';
import Typography from '../../components/Typography';
import SvgCaretDown from '../../components/icons/CaretDown';
import SvgPlusRegular from '../../components/icons/PlusRegular';
import SvgTrash from '../../components/icons/Trash';
import { BudgetOptimizationItem, mapRiskIcon } from '../portfolios/components/PortfolioBudget';
import { ImpactGroupsEditTable } from './components/ImpactGroups/ImpactGroupsEditTable';

import { budgetOptimizationType } from '../../configs/portfolio';
import { nexyColors } from '../../theme';
import PortfolioDatesConfirmationDialog from './PortfolioDatesConfirmationDialog';
import { useLabels } from '../../hooks/useLabels';
import { LabelsEditTable } from './components/Labels/LabelsEditTable';
import useUserStore from '../../store/user';
import { useTenantName } from '../../hooks/useTenantName';

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

// TODO: Remove this duplicate component once we update the sales material w/ the new navigation (doesn't make sense to update it now since it's going to be deleted anyways)
function PortfolioEditMetaSidepanel({ isOpen, onClose, match, portfolio }: Props) {
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
    impactGroups,
    skipTrainingDays,
  } = portfolio;

  const [metabaseLinks, setMetabaseLinks] = useState<NexoyaPortfolioDashboardUrl[]>(
    portfolioDashboardUrls?.length ? portfolioDashboardUrls : [{ name: '', url: '' }],
  );

  const {
    impactGroups: impactGroupsState,
    setImpactGroups,
    handleEditImpactGroupFunnelSteps,
    handleEdit: handleEditImpactGroup,
    handleDelete: handleDeleteImpactGroup,
  } = useImpactGroups({ portfolioMeta: portfolio, initialImpactGroups: impactGroups });

  const {
    labels: labelsState,
    setLabels,
    handleEdit: handleEditLabels,
    handleDelete: handleDeleteLabels,
    loadingUpdate: loadingLabelsUpdate,
    loadingDelete: loadingLabelsDelete,
  } = useLabels({ portfolioMeta: portfolio });

  const initialState: FormValues = {
    title,
    startDate: new Date((start || '').substring(0, 10)),
    endDate: new Date((end || '').substring(0, 10)),
    optimizationType: optimizationType || '',
    optimizationRiskLevel: optimizationRiskLevel || 0,
    portfolioDashboardUrls: portfolioDashboardUrls?.length
      ? portfolioDashboardUrls.map(({ name, url }) => ({ name, url }))
      : [{ name: '', url: '' }],
    budgetProposalTargetBiddingApplyMode,
    budgetDeltaHandlingPolicy,
    skipTrainingDays,
  };
  const [form, setForm] = React.useState<FormValues>(initialState);

  useEffect(() => {
    if (isOpen) {
      setForm(initialState);
    }
  }, [isOpen]);

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

  const { allowSubmit } = useAllowSubmit({
    initialValues: initialState,
    values: form,
  });
  const [updatePortfolioMeta, { loading, error }] = useUpdatePortfolioMutation({
    portfolioId: portfolioId,
    ...form,
  });

  async function handleSubmit() {
    try {
      const res = await updatePortfolioMeta();

      if (res?.data?.updatePortfolio) {
        onClose();

        if (isDialogOpen) {
          toggleDialog();
        } // quick fix, always close dialog (even
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const portfolioRiskType = portfolio.type === NexoyaPortfolioType.Budget ? 'BUDGET' : 'TARGET';

  return (
    <>
      <SidePanel
        isOpen={isOpen}
        onClose={onClose}
        data-cy="editPortfolioDialog"
        paperProps={{
          style: {
            width: '850px',
            paddingBottom: '78px',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h3" component="h3">
            Edit portfolio
          </Typography>
        </DialogTitle>
        <SidePanelContent>
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
              {form.optimizationType !== budgetOptimizationType.SKIP ? (
                <>
                  <Typography
                    variant="h3"
                    style={{
                      marginBottom: 24,
                    }}
                  >
                    Risk level
                  </Typography>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 20,
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
                  <RadioGroup style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {getBudgetProposalTargetBiddingApplyTypes(tenantName).map((item) => (
                      <FormControlLabel
                        key={item.type}
                        checked={form.budgetProposalTargetBiddingApplyMode === item.type}
                        onChange={() =>
                          handleChange({
                            target: {
                              name: 'budgetProposalTargetBiddingApplyMode',
                              value: item.type,
                            },
                          })
                        }
                        value={item.type}
                        name="optimizationType"
                        label={item.title}
                        control={<Radio inputProps={{ 'aria-label': 'A' }} />}
                        data-cy={item.type}
                      />
                    ))}
                  </RadioGroup>
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
            {/* Impact groups management */}
            {isSupportUser ? (
              <div className="mb-10">
                <TextWrapper style={{ marginBottom: 24 }}>
                  <Typography variant="h3">Impact groups</Typography>
                  <Typography withEllipsis={false} variant="subtitle">
                    Impact Groups group contents together which impact the same funnel steps. This setting allows
                    defining the impact groups and their assignment to the funnel steps.
                  </Typography>
                  <Typography style={{ fontSize: 13 }} withEllipsis={false} variant="subtitle">
                    Note: Assigning contents to impact groups can be done in the ‘Content’ part of the application. The
                    configuration of the impact groups will influence how budget is allocated to contents in order to
                    ensure an optimal performance per impact group.
                  </Typography>
                </TextWrapper>
                <ImpactGroupsEditTable
                  portfolioId={portfolioId}
                  impactGroups={impactGroupsState}
                  setImpactGroups={setImpactGroups}
                  handleEdit={handleEditImpactGroup}
                  handleDelete={handleDeleteImpactGroup}
                  handleEditImpactGroupFunnelSteps={handleEditImpactGroupFunnelSteps}
                />
              </div>
            ) : null}
            {/* Labels management */}
            {isSupportUser ? (
              <>
                <TextWrapper style={{ marginBottom: 24 }}>
                  <Typography variant="h3">Labels</Typography>
                  <Typography withEllipsis={false} variant="subtitle">
                    This setting allows defining the labels.
                  </Typography>
                  <Typography style={{ fontSize: 13 }} withEllipsis={false} variant="subtitle">
                    Note: Assigning contents to labels can be done in the ‘Content’ part of the application. The
                    configuration of the labels will not influence how budget is allocated to contents in order to
                    ensure an optimal performance per label.
                  </Typography>
                </TextWrapper>
                <LabelsEditTable
                  portfolioId={portfolioId}
                  labels={labelsState}
                  setLabels={setLabels}
                  handleEdit={handleEditLabels}
                  handleDelete={handleDeleteLabels}
                  loadingUpdate={loadingLabelsUpdate}
                  loadingDelete={loadingLabelsDelete}
                />
              </>
            ) : null}
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
            {/*  metabase  */}
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
                    <ButtonIcon
                      style={{ margin: 'auto' }}
                      disabled={metabaseLinks?.length === 1 && idx === 0 && mb.name === '' && mb.url === ''}
                      onClick={() => {
                        if (metabaseLinks?.length === 1 && idx === 0 && (mb.name || mb.url)) {
                          setMetabaseLinks([{ name: '', url: '' }]);
                        } else {
                          setMetabaseLinks((currentLinks) => currentLinks.filter((_, linkIdx) => idx !== linkIdx));
                        }
                      }}
                    >
                      <SvgTrash />
                    </ButtonIcon>
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
        </SidePanelContent>
        <SidePanelActions>
          <Button id="discard" variant="contained" onClick={onClose}>
            Discard changes
          </Button>
          <ButtonAsync
            variant="contained"
            color="primary"
            id="save"
            loading={loading}
            disabled={!allowSubmit}
            onClick={() => {
              if (
                !dayjs(initialState?.startDate).isSame(dayjs(form.startDate), 'day') ||
                !dayjs(initialState?.endDate).isSame(dayjs(form.endDate), 'day')
              ) {
                toggleDialog();
              } else handleSubmit();
            }}
          >
            Save changes
          </ButtonAsync>
        </SidePanelActions>
        {error ? <ErrorMessage error={error} /> : null}
      </SidePanel>
      <PortfolioDatesConfirmationDialog
        isOpen={isDialogOpen}
        toggleDialog={toggleDialog}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
}

export default withRouter(PortfolioEditMetaSidepanel);
