import React from 'react';

import dayjs from 'dayjs';
import { round } from 'lodash';
import { BooleanParam, StringParam, useQueryParams } from 'use-query-params';

import {
  NexoyaAttributionOptimizedMetric,
  NexoyaFunnelStepType,
  NexoyaFunnelStepV2,
  NexoyaOptimizationV2,
  NexoyaOptimizedContent,
  NexoyaOptimizedDailyBudget,
  NexoyaOptimizedFunnelStep,
  NexoyaOptimizedTarget,
  NexoyaOptimizedTotal,
  NexoyaPortfolioType,
  NexoyaTargetBiddingApplyMode,
} from '../../../../types';

import { sumLifetimeBudgetSegments } from '../../utils/utils';

import MenuList from '../../../../components/ArrayMenuList/ArrayMenuList';
import ButtonIcon from '../../../../components/ButtonIcon';
import Divider from '../../../../components/Divider';
import { useDropdownMenu } from '../../../../components/DropdownMenu';
import Flex from '../../../../components/Flex';
import FormattedCurrency from '../../../../components/FormattedCurrency';
import MenuItem from '../../../../components/MenuItem';
import NumberValue from '../../../../components/NumberValue';
import Panel from '../../../../components/Panel';
import { PortfolioTargetTypeSwitch, PortfolioTypeSwitch } from '../../../../components/PortfolioTypeSwitch';
import Switch from '../../../../components/Switch';
import { sortTypes } from '../../../../components/Table/sortTypes';
import Tooltip from '../../../../components/Tooltip';
import Typography from '../../../../components/Typography';
import SvgCog from '../../../../components/icons/Cog';
import SvgFullScreen from '../../../../components/icons/FullScreen';
import SvgFullScreenClose from '../../../../components/icons/FullScreenClose';
import SvgInfo from '../../../../components/icons/Info';
import SvgWarningTwo from '../../../../components/icons/WarningTwo';

import {
  BigHeaderCell,
  BlueFormula,
  FormulaTooltipContainer,
  FormulaTooltipContent,
  FormulaTooltipHeader,
  FormulaTooltipRow,
  FormulaTooltipTableContainer,
  GreenFormula,
  LabelStyled,
  NumberWrapperStyled,
  PurpleFormula,
  StyledSpan,
  TagStyled,
  TotalHeaderCell,
  TotalTooltipContentContainer,
  WrapperStyled,
} from '../../styles/OptimizationProposal';

import { nexyColors } from '../../../../theme';
import { buildContentPath } from '../../../paths';
import { SwitchContainerStyled } from '../Funnel/styles';
import { OptimizationDetailsTDM } from './OptimizationDetailsTDM';
import { IEditRowProps } from './OptimizationProposalTable';
import { RowRaw } from './optimizationDetailsTableTypes';
import { AvatarCell, ContentCell, StatusCell } from './tableCellComponents';
import {
  formatWeekdayWithDates,
  getOptiAttributedTooltipContent,
  isNullOrUndefined,
  renderBiddingStrategyValueCell,
  translateBiddingStrategyType,
} from './utils';
import { withSortSkipped } from './withSortSkipped';
import { ProposedBiddingStrategyTooltip } from './ProposedBiddingStrategyTooltip/ProposedBiddingStrategyTooltip';
import { HoverableTooltip } from '../../../../components-ui/HoverCard';
import { Info } from 'lucide-react';

export const ACTIONS_HEADER_ID = 'actionsHeader';
export const SELECT_HEADER_ID = 'selectHeader';
export const CHANNEL_HEADER_ID = 'channelHeader';
export const IMPACT_GROUP_HEADER_ID = 'impactGroupHeader';
export const LABEL_HEADER_ID = 'labelHeader';
export const PLATFORM_BUDGET_HEADER_ID = 'platformBudgetHeader';
export const IDS_NOT_ALLOWED_TO_HIDE = [ACTIONS_HEADER_ID, CHANNEL_HEADER_ID, IMPACT_GROUP_HEADER_ID];

export const isConversionValueFunnelStep = (funnelStepType: NexoyaFunnelStepType) =>
  funnelStepType === NexoyaFunnelStepType.ConversionValue;

export const isCostFunnelStep = (funnelStepType: NexoyaFunnelStepType) => funnelStepType === NexoyaFunnelStepType.Cost;

export const TotalHeaderCellElement = () => {
  const [queryParams] = useQueryParams({
    showSkippedContents: BooleanParam,
  });
  return (
    <>
      <TotalHeaderCell>
        Total
        <Tooltip
          size="large"
          style={{
            maxWidth: 414,
          }}
          popperProps={{
            style: {
              zIndex: 3300,
            },
          }}
          placement="bottom-start"
          variant="dark"
          content={
            <TotalTooltipContentContainer>
              The “Total” row only contains the combined numbers for:
              <br />
              <Typography
                style={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}
                withEllipsis={false}
              >
                Contents marked as{' '}
                <TagStyled color={nexyColors.darkGrey} bgColor="#88E7B7">
                  Standard
                </TagStyled>{' '}
                ,{' '}
                <TagStyled color={nexyColors.darkGrey} bgColor="#FAB570">
                  Limited
                </TagStyled>
                ,{' '}
                <TagStyled color={nexyColors.darkGrey} bgColor="#94DCF4">
                  Insight
                </TagStyled>
                {queryParams.showSkippedContents ? (
                  <>
                    and{' '}
                    <TagStyled color={nexyColors.darkGrey} bgColor={nexyColors.frenchGray}>
                      Skip
                    </TagStyled>
                  </>
                ) : (
                  '.'
                )}
              </Typography>
            </TotalTooltipContentContainer>
          }
        >
          <div>
            <SvgInfo style={{ color: nexyColors.coolGray, width: 18, height: 18 }} />
          </div>
        </Tooltip>
      </TotalHeaderCell>
    </>
  );
};

const ActionsCornerElementHeader = () => {
  const { open: tooltipOpen, closeMenu: closeTooltip, openMenu: openTooltip } = useDropdownMenu();
  const { anchorEl, open, toggleMenu, closeMenu } = useDropdownMenu();
  const [queryParams, setQueryParams] = useQueryParams({
    expandedOptimizationView: BooleanParam,
    showSkippedContents: BooleanParam,
    tableViewSwitch: StringParam,
  });
  return (
    <>
      <Tooltip
        popperProps={{
          style: {
            zIndex: 3301,
          },
        }}
        open={tooltipOpen}
        size="small"
        placement="right"
        variant="dark"
        content={queryParams.expandedOptimizationView ? 'Minimize view' : 'Expand view'}
      >
        <ButtonIcon
          onMouseLeave={closeTooltip}
          onMouseEnter={openTooltip}
          onClick={() => {
            closeTooltip();
            setQueryParams({
              expandedOptimizationView: !queryParams.expandedOptimizationView,
            });
          }}
          style={{ marginRight: 'auto', padding: 9 }}
        >
          {queryParams.expandedOptimizationView ? (
            <SvgFullScreenClose style={{ color: nexyColors.coolGray, width: 17, height: 17 }} />
          ) : (
            <SvgFullScreen style={{ color: nexyColors.coolGray, width: 17, height: 17 }} />
          )}
        </ButtonIcon>
      </Tooltip>
      {queryParams.tableViewSwitch === 'all-content' ? (
        <>
          <Tooltip
            popperProps={{
              style: {
                zIndex: 3301,
              },
            }}
            size="small"
            placement="right"
            variant="dark"
            content="Table view settings"
          >
            <div>
              <ButtonIcon ref={anchorEl} onClick={toggleMenu} style={{ marginRight: 'auto', padding: 9 }}>
                <SvgCog style={{ color: nexyColors.coolGray, width: 17, height: 17 }} />
              </ButtonIcon>
            </div>
          </Tooltip>
          <Panel
            open={open}
            onClose={closeMenu}
            color="dark"
            anchorEl={anchorEl.current}
            placement="bottom-start"
            popperProps={{
              style: {
                zIndex: 3301,
              },
            }}
          >
            <MenuList color="dark">
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setQueryParams({
                    showSkippedContents: !queryParams.showSkippedContents,
                  });
                }}
                style={{
                  minWidth: 125,
                  maxHeight: 500,
                }}
              >
                <SwitchContainerStyled>
                  <Typography>Show skipped and disabled contents</Typography>
                  <Switch
                    isOn={queryParams.showSkippedContents}
                    onToggle={() => {
                      setQueryParams({
                        showSkippedContents: !queryParams.showSkippedContents,
                      });
                    }}
                  />
                </SwitchContainerStyled>
              </MenuItem>
            </MenuList>
          </Panel>
        </>
      ) : null}
    </>
  );
};

export const getChannelColumns = (
  optimizedTotal: NexoyaOptimizedTotal,
  tableMetricsSwitch: string,
  tableViewSwitch: string,
  portfolioType: NexoyaPortfolioType,
  isBaselinePredictionRescaled: boolean,
  ignoreWeekdays?: string[],
  optimizationStartDate?: string,
) => {
  return [
    {
      Header: ActionsCornerElementHeader,
      accessor: ACTIONS_HEADER_ID,
      disableSortBy: true,
      disableHiding: true,
      tableManagerHeader: <BigHeaderCell>Channel</BigHeaderCell>,
      columns: [
        {
          Header: TotalHeaderCellElement,
          accessor: 'total' + tableViewSwitch,
          isHiddenInManager: true,
          disableSortBy: true,
          disableHiding: true,
          columns: [
            {
              Header: 'Channel',
              accessor: 'channel',
              id: 'channel' + tableViewSwitch,
              sortType: withSortSkipped(sortTypes.jsxKey),
              enableColumnResize: true,
              disableHiding: true,
            },
          ],
        },
      ],
    },
    portfolioType !== NexoyaPortfolioType.Budget &&
      getTargetColumns(optimizedTotal.target, isBaselinePredictionRescaled),
    ...getBudgetColumns(optimizedTotal.budget, false, ignoreWeekdays, optimizationStartDate),
    ...(tableViewSwitch === 'all-content' ? getBiddingStrategyColumns() : []),
    ...getFunnelStepColumns({
      optimizedFunnelSteps: optimizedTotal.funnelSteps?.filter(Boolean),
      tableMetricsSwitch,
      isBaselinePredictionRescaled,
    }),
  ].filter(Boolean);
};

export const getLabelColumns = (
  optimizedTotal: NexoyaOptimizedTotal,
  tableMetricsSwitch: string,
  tableViewSwitch: string,
  portfolioType: NexoyaPortfolioType,
  isBaselinePredictionRescaled: boolean,
  ignoreWeekdays?: string[],
  optimizationStartDate?: string,
) => {
  return [
    {
      Header: ActionsCornerElementHeader,
      accessor: ACTIONS_HEADER_ID,
      disableSortBy: true,
      disableHiding: true,
      tableManagerHeader: <BigHeaderCell>Label</BigHeaderCell>,
      columns: [
        {
          Header: TotalHeaderCellElement,
          accessor: 'total' + tableViewSwitch,
          isHiddenInManager: true,
          disableSortBy: true,
          disableHiding: true,
          columns: [
            {
              Header: 'Label',
              accessor: 'label' + tableViewSwitch,
              id: 'label' + tableViewSwitch,
              sortType: withSortSkipped(sortTypes.jsxKey),
              enableColumnResize: true,
              disableHiding: true,
            },
          ],
        },
      ],
    },
    portfolioType !== NexoyaPortfolioType.Budget &&
      getTargetColumns(optimizedTotal.target, isBaselinePredictionRescaled),
    ...getBudgetColumns(optimizedTotal.budget, false, ignoreWeekdays, optimizationStartDate),
    ...(tableViewSwitch === 'all-content' ? getBiddingStrategyColumns() : []),
    ...getFunnelStepColumns({
      optimizedFunnelSteps: optimizedTotal.funnelSteps?.filter(Boolean),
      tableMetricsSwitch,
      isBaselinePredictionRescaled,
    }),
  ].filter(Boolean);
};

export const getAllContentsColumns = (
  optimizedTotal: NexoyaOptimizedTotal,
  tableMetricsSwitch: string,
  tableViewSwitch: string,
  hasTargets: boolean,
  hasLifetimeBudget: boolean,
  hasLabels: boolean,
  isBaselinePredictionRescaled: boolean,
  isPortfolioAttributed: boolean,
  ignoreWeekdays?: string[],
  optimizationStartDate?: string,
) =>
  [
    {
      Header: ActionsCornerElementHeader,
      accessor: ACTIONS_HEADER_ID,
      tableManagerHeader: <BigHeaderCell>Content</BigHeaderCell>,
      disableSortBy: true,
      disableHiding: true,
      columns: [
        {
          Header: '',
          accessor: 'editRowHeader',
          id: 'editRowHeader',
          width: '48',
          isHiddenInManager: true,
          disableSortBy: true,
          disableHiding: true,
          columns: [
            {
              Header: '',
              accessor: 'editRow',
              id: 'editRow',
              width: '48',
              isHiddenInManager: true,
              disableSortBy: true,
              disableHiding: true,
            },
          ],
        },
        {
          Header: TotalHeaderCellElement,
          accessor: 'total',
          disableSortBy: true,
          className: 'border-right',
          enableColumnResize: true,
          disableHiding: true,
          columns: [
            {
              Header: 'Content',
              accessor: 'content',
              className: 'border-right',
              sortType: withSortSkipped(sortTypes.jsxKey),
              enableColumnResize: true,
              disableHiding: true,
            },
          ],
        },
      ],
    },
    {
      Header: '',
      accessor: 'emptyStatusHeader',
      id: 'emptyStatusHeader',
      isHiddenInManager: false,
      tableManagerHeader: <BigHeaderCell>Status</BigHeaderCell>,
      disableSortBy: true,
      columns: [
        {
          id: 'statusHeader',
          Header: '',
          accessor: 'statusHeader',
          disableSortBy: true,
          columns: [
            {
              id: 'status',
              accessor: 'status',
              Header: 'Status',
              sortType: withSortSkipped(sortTypes.jsxKey),
            },
          ],
        },
      ],
    },
    {
      Header: '',
      accessor: 'emptyChannelHeader',
      id: 'emptyChannelHeader',
      isHiddenInManager: false,
      tableManagerHeader: <BigHeaderCell>Channel</BigHeaderCell>,
      disableSortBy: true,
      columns: [
        {
          id: CHANNEL_HEADER_ID,
          Header: '',
          accessor: CHANNEL_HEADER_ID,
          disableSortBy: true,
          columns: [
            {
              id: 'channel',
              accessor: 'channel',
              Header: 'Channel',
              sortType: withSortSkipped(sortTypes.jsxKey),
            },
          ],
        },
      ],
    },
    !isPortfolioAttributed
      ? {
          Header: '',
          accessor: 'emptyImpactGroupHeader',
          id: 'emptyImpactGroupHeader',
          isHiddenInManager: false,
          tableManagerHeader: <BigHeaderCell>Impact group</BigHeaderCell>,
          disableSortBy: true,
          columns: [
            {
              id: IMPACT_GROUP_HEADER_ID,
              Header: '',
              accessor: IMPACT_GROUP_HEADER_ID,
              disableSortBy: true,
              columns: [
                {
                  id: 'impactGroup',
                  accessor: 'impactGroup',
                  Header: 'Impact group',
                  sortType: withSortSkipped(sortTypes.jsxKey),
                },
              ],
            },
          ],
        }
      : null,
    hasLabels
      ? {
          Header: '',
          accessor: 'emptyLabelHeader',
          id: 'emptyLabelHeader',
          isHiddenInManager: false,
          tableManagerHeader: <BigHeaderCell>Label</BigHeaderCell>,
          disableSortBy: true,
          columns: [
            {
              id: LABEL_HEADER_ID,
              Header: '',
              accessor: LABEL_HEADER_ID,
              disableSortBy: true,
              columns: [
                {
                  id: 'label' + tableViewSwitch,
                  accessor: 'label' + tableViewSwitch,
                  Header: 'Label',
                  sortType: withSortSkipped(sortTypes.jsxKey),
                },
              ],
            },
          ],
        }
      : null,
    {
      Header: '',
      accessor: 'emptyPlatformBudgetHeader',
      id: 'emptyPlatformBudgetHeader',
      isHiddenInManager: false,
      tableManagerHeader: <BigHeaderCell>Current daily budget</BigHeaderCell>,
      disableSortBy: true,
      columns: [
        {
          id: PLATFORM_BUDGET_HEADER_ID,
          Header: '',
          accessor: PLATFORM_BUDGET_HEADER_ID,
          disableSortBy: true,
          columns: [
            {
              minWidth: 165,
              id: 'platformBudget',
              accessor: 'platformBudget',
              Header: 'Current daily budget',
              sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
            },
          ],
        },
      ],
    },
    ...getBudgetColumns(optimizedTotal.budget, hasLifetimeBudget, ignoreWeekdays, optimizationStartDate),
    ...(tableViewSwitch === 'all-content' && hasTargets ? getBiddingStrategyColumns() : []),
    ...getFunnelStepColumns({
      optimizedFunnelSteps: optimizedTotal.funnelSteps?.filter(Boolean),
      tableMetricsSwitch,
      isBaselinePredictionRescaled,
    }),
  ].filter(Boolean);

export const getImpactGroupColumns = (
  optimizedTotal: NexoyaOptimizedTotal,
  tableMetricsSwitch: string,
  tableViewSwitch: string,
  portfolioType: NexoyaPortfolioType,
  isBaselinePredictionRescaled: boolean,
  ignoreWeekdays?: string[],
  optimizationStartDate?: string,
) =>
  [
    {
      Header: ActionsCornerElementHeader,
      accessor: ACTIONS_HEADER_ID,
      disableSortBy: true,
      disableHiding: true,
      tableManagerHeader: <BigHeaderCell>Impact group</BigHeaderCell>,
      columns: [
        {
          Header: TotalHeaderCellElement,
          accessor: 'total' + tableViewSwitch,
          isHiddenInManager: true,
          disableSortBy: true,
          enableColumnResize: true,
          disableHiding: true,
          columns: [
            {
              Header: 'Impact group',
              accessor: 'impactGroup',
              id: 'impactGroup' + tableViewSwitch,
              enableColumnResize: true,
              disableHiding: true,
            },
          ],
        },
      ],
    },
    portfolioType !== NexoyaPortfolioType.Budget &&
      getTargetColumns(optimizedTotal.target, isBaselinePredictionRescaled),
    ...getBudgetColumns(optimizedTotal.budget, false, ignoreWeekdays, optimizationStartDate),
    ...(tableViewSwitch === 'all-content' ? getBiddingStrategyColumns() : []),
    ...getFunnelStepColumns({
      optimizedFunnelSteps: optimizedTotal.funnelSteps?.filter(Boolean),
      tableMetricsSwitch,
      isBaselinePredictionRescaled,
    }),
  ].filter(Boolean);

const getBudgetColumns = (
  budgetTotals: NexoyaOptimizedDailyBudget,
  hasLifetimeBudget: boolean,
  ignoreWeekdays?: string[],
  optimizationStartDate?: string,
) => [
  {
    id: 'bHeaderPreviousBudget',
    title: 'Avg. daily spend',
    className: 'border-left',
    Header: (
      <BigHeaderCell>
        <Tooltip
          variant="dark"
          style={{ maxWidth: 420, wordBreak: 'break-word' }}
          popperProps={{
            style: {
              zIndex: 3305,
            },
          }}
          content={
            <Typography withEllipsis={false} style={{ fontSize: 12 }}>
              This is the average daily spend of the last 7 eligible days or since the last budget application.
              {ignoreWeekdays && ignoreWeekdays.length > 0 && (
                <>
                  <br />
                  <br />
                  <span className="font-semibold">Days ignored in the calculation:</span>
                  <br />
                  {ignoreWeekdays.map((weekday) => (
                    <>
                      {formatWeekdayWithDates(weekday, optimizationStartDate)}
                      <br />
                    </>
                  ))}
                </>
              )}
            </Typography>
          }
        >
          <HoverableTooltip>
            <div>Avg. daily spend</div>
          </HoverableTooltip>
        </Tooltip>
      </BigHeaderCell>
    ),
    disableSortBy: true,
    columns: [
      {
        id: 'totalPreviousBudget',
        accessor: 'totalPreviousBudget',
        className: 'border-left',
        Header: (
          <TotalHeaderCell>
            <FormattedCurrency amount={budgetTotals.spent} />
          </TotalHeaderCell>
        ),
        disableSortBy: true,
        columns: [
          {
            id: 'previousDailyBudget',
            accessor: 'previousDailyBudget',
            className: 'border-left',
            sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
            Header: 'Value',
          },
        ],
      },
    ],
  },
  {
    id: 'bHeaderProposedBudget',
    title: 'Proposed daily budget',
    Header: (
      <BigHeaderCell>
        <Tooltip
          variant="dark"
          style={{ maxWidth: 348, wordBreak: 'break-word' }}
          popperProps={{
            style: {
              zIndex: 3305,
            },
          }}
          content={
            <Typography withEllipsis={false} style={{ fontSize: 12 }}>
              This is the proposed daily budget for the optimization timeframe.
            </Typography>
          }
        >
          <HoverableTooltip>
            <div>Proposed daily budget</div>
          </HoverableTooltip>
        </Tooltip>
      </BigHeaderCell>
    ),
    disableSortBy: true,
    columns: [
      {
        id: 'totalProposedBudget',
        accessor: 'totalProposedBudget',
        disableSortBy: true,
        className: 'budget',
        Header: (
          <TotalHeaderCell>
            <FormattedCurrency amount={budgetTotals.proposed} />
          </TotalHeaderCell>
        ),
        columns: [
          {
            id: 'proposedDailyBudget',
            accessor: 'proposedDailyBudget',
            className: 'budget',
            sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
            minWidth: 200,
            Header: 'Value',
          },
        ],
      },
    ].filter(Boolean),
  },
  {
    id: 'bHeaderChangePercent',
    title: '% Change',
    className: hasLifetimeBudget ? '' : 'border-right',
    Header: (
      <BigHeaderCell>
        <Tooltip
          variant="dark"
          style={{ maxWidth: 370, wordBreak: 'break-word' }}
          popperProps={{
            style: {
              zIndex: 3305,
            },
          }}
          content={
            <Typography withEllipsis={false} style={{ fontSize: 12 }}>
              This is the difference between the average daily spend and the proposed daily budget.
            </Typography>
          }
        >
          <HoverableTooltip>
            <div>% Change</div>
          </HoverableTooltip>
        </Tooltip>
      </BigHeaderCell>
    ),
    disableSortBy: true,
    columns: [
      {
        id: 'totalBudgetChange',
        className: hasLifetimeBudget ? '' : 'border-right',
        Header: (
          <TotalHeaderCell>
            <NumberValue
              style={{ color: '#a0a2ad' }}
              value={budgetTotals.changePercent}
              variant={budgetTotals.changePercent > 0 ? 'positive' : 'negative'}
              showChangePrefix
              datatype={{
                suffix: true,
                symbol: '%',
              }}
            />
          </TotalHeaderCell>
        ),
        disableSortBy: true,
        columns: [
          {
            id: 'proposedDailyBudgetChange',
            accessor: 'proposedDailyBudgetChange',
            className: hasLifetimeBudget ? '' : 'border-right',
            sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
            Header: '% Change',
          },
        ],
      },
    ].filter(Boolean),
  },
  {
    id: 'bHeaderLifetimeBudget',
    title: 'Lifetime budget',
    Header: <BigHeaderCell>Lifetime Budget</BigHeaderCell>,
    disableSortBy: true,
    className: 'border-right',
    columns: [
      hasLifetimeBudget && {
        id: 'totalLifetimeBudget',
        className: 'border-right',
        Header: '',
        disableSortBy: true,
        columns: [
          {
            className: 'border-right',
            id: 'lifetimeBudgetSegments',
            accessor: 'lifetimeBudgetSegments',
            sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
            Header: 'Value',
          },
        ],
      },
    ].filter(Boolean),
  },
];

const getBiddingStrategyColumns = () => [
  {
    id: 'targetHeaderInitial',
    Header: <BigHeaderCell>Current target</BigHeaderCell>,
    disableSortBy: true,
    title: 'Value',
    columns: [
      {
        id: 'totalBiddingStrategy',
        accessor: 'totalBiddingStrategy',
        Header: '',
        disableSortBy: true,
        columns: [
          {
            id: 'initialBiddingStrategy',
            accessor: 'initialBiddingStrategy',
            Header: 'Value',
            sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
          },
        ],
      },
    ],
  },
  {
    id: 'targetHeaderProposed',
    Header: <BigHeaderCell>Proposed target</BigHeaderCell>,
    disableSortBy: true,
    title: 'Value',
    columns: [
      {
        id: 'totalProposedBiddingStrategy',
        accessor: 'totalProposedBiddingStrategy',
        Header: '',
        disableSortBy: true,
        columns: [
          {
            id: 'proposedBiddingStrategy',
            accessor: 'proposedBiddingStrategy',
            Header: 'Value',
            sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
          },
        ],
      },
    ],
  },
  {
    id: 'targetHeaderChangePercent',
    Header: <BigHeaderCell>% Change</BigHeaderCell>,
    disableSortBy: true,
    title: 'Target',
    className: 'border-right',
    columns: [
      {
        id: 'totalBiddingStrategyChangePercent',
        className: 'border-right',
        Header: '',
        disableSortBy: true,
        columns: [
          {
            id: 'biddingStrategyChangePercent',
            accessor: 'biddingStrategyChangePercent',
            Header: '% Change',
            className: 'border-right',
            sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
          },
        ],
      },
    ],
  },
];

const getTargetColumns = (targetTotals: NexoyaOptimizedTarget, isBaselinePredictionRescaled: boolean) => ({
  id: 'tHeader',
  title: 'Target',
  Header: <BigHeaderCell>Portfolio Target</BigHeaderCell>,
  disableSortBy: true,
  columns: [
    {
      id: 'totalPreviousTarget',
      accessor: 'totalPreviousTarget',
      className: 'border-left',
      Header: (
        <TotalHeaderCell>
          <PortfolioTargetTypeSwitch
            renderForCPAType={() => <FormattedCurrency amount={targetTotals?.previous} />}
            renderForROASType={() => (
              <NumberValue
                value={targetTotals?.previous}
                datatype={{
                  suffix: true,
                  symbol: '%',
                }}
              />
            )}
          />
        </TotalHeaderCell>
      ),
      disableSortBy: true,
      columns: [
        {
          id: 'previousDailyTarget',
          accessor: 'previousDailyTarget',
          className: 'border-left',
          sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
          minWidth: 155,
          Header: (
            <Tooltip
              variant="dark"
              style={{ maxWidth: 420, wordBreak: 'break-word' }}
              popperProps={{
                style: {
                  zIndex: 3305,
                },
              }}
              content={
                <Typography withEllipsis={false} style={{ fontSize: 12 }}>
                  This is the predicted portfolio target without optimization.
                </Typography>
              }
            >
              <HoverableTooltip>
                <div>Predicted baseline</div>
              </HoverableTooltip>
            </Tooltip>
          ),
        },
      ],
    },
    {
      id: 'totalProposedTarget',
      accessor: 'totalProposedTarget',
      disableSortBy: true,
      className: 'target',
      Header: (
        <TotalHeaderCell>
          <PortfolioTargetTypeSwitch
            renderForCPAType={() => <FormattedCurrency amount={targetTotals?.proposed} />}
            renderForROASType={() => (
              <NumberValue
                value={targetTotals?.proposed}
                datatype={{
                  suffix: true,
                  symbol: '%',
                }}
              />
            )}
          />
        </TotalHeaderCell>
      ),
      columns: [
        {
          id: 'proposedDailyTarget',
          accessor: 'proposedDailyTarget',
          className: 'target',
          sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
          Header: (
            <Tooltip
              variant="dark"
              style={{ maxWidth: 335, wordBreak: 'break-word' }}
              popperProps={{
                style: {
                  zIndex: 3305,
                },
              }}
              content={
                <Typography withEllipsis={false} style={{ fontSize: 12 }}>
                  This is the suggested portfolio target at the end of the timeframe of this optimization proposal.
                </Typography>
              }
            >
              <HoverableTooltip>
                <div>Proposed</div>
              </HoverableTooltip>
            </Tooltip>
          ),
        },
      ],
    },
    {
      id: 'totalTargetChange',
      Header: (
        <TotalHeaderCell>
          <NumberValue
            textWithColor
            showChangePrefix
            value={targetTotals?.changePercent}
            lowerIsBetter={targetTotals?.lowerIsBetter}
            variant={targetTotals?.changePercent > 0 ? 'positive' : 'negative'}
            datatype={{
              suffix: true,
              symbol: '%',
            }}
          />
        </TotalHeaderCell>
      ),
      disableSortBy: true,
      columns: [
        {
          id: 'proposedDailyTargetChange',
          accessor: 'proposedDailyTargetChange',
          sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
          Header: (
            <Tooltip
              variant="dark"
              style={{ maxWidth: 360, wordBreak: 'break-word' }}
              popperProps={{
                style: {
                  zIndex: 3305,
                },
              }}
              content={
                <Typography withEllipsis={false} style={{ fontSize: 12 }}>
                  <PortfolioTypeSwitch
                    renderForBudgetType={() =>
                      isBaselinePredictionRescaled
                        ? 'This is the uplift in % of the suggested portfolio target compared to the predicted baseline.'
                        : 'This is the difference between the predicted values with and without the suggested budget change.'
                    }
                    renderForTargetType={() =>
                      'This is the change in % of the suggested portfolio target compared to the predicted baseline.'
                    }
                  />
                </Typography>
              }
            >
              <HoverableTooltip>
                <PortfolioTypeSwitch
                  renderForBudgetType={() => <div>{isBaselinePredictionRescaled ? '% Uplift' : '% Change'}</div>}
                  renderForTargetType={() => <div>% Change</div>}
                />
              </HoverableTooltip>
            </Tooltip>
          ),
        },
      ],
    },
  ],
});

export const getFunnelStepColumns = ({
  optimizedFunnelSteps,
  tableMetricsSwitch,
  isBaselinePredictionRescaled,
}: {
  optimizedFunnelSteps: NexoyaOptimizedFunnelStep[];
  tableMetricsSwitch: string;
  isBaselinePredictionRescaled: boolean;
}) => {
  if (tableMetricsSwitch === 'roas') {
    return optimizedFunnelSteps
      .map((optimizedFunnelStep) => {
        const funnelStep = optimizedFunnelStep?.funnelStep;
        if (funnelStep?.type !== NexoyaFunnelStepType.ConversionValue) {
          return null;
        }

        const isAttributed = funnelStep?.isAttributed;

        const columns = createColumnStructure({
          idPrefix: 'funnelStepRoas',
          funnelStepId: funnelStep.funnelStepId,
          accessorPrefix: 'funnelStepRoas',
          isCostPerView: false,
          isPercent: true,
          funnelStepType: funnelStep?.type,
          isBaselinePredictionRescaled,
          funnelStepTitle: funnelStep?.title,
          isAttributed,
          total: {
            predicted: optimizedFunnelStep?.roas?.predicted,
            changePercent: optimizedFunnelStep?.roas?.changePercent,
          },
        });

        return {
          id: `funnel-step-header-${funnelStep?.funnelStepId}`,
          title: funnelStep?.title,
          disableSticky: true,
          Header: <BigHeaderCell>{funnelStep?.title}</BigHeaderCell>,
          disableSortBy: true,
          columns,
        };
      })
      .filter(Boolean);
  }
  return optimizedFunnelSteps.map((optimizedFunnelStep) => {
    const header: string = getHeader(optimizedFunnelStep?.funnelStep);
    const funnelStep = optimizedFunnelStep?.funnelStep;

    const isCostPerView = tableMetricsSwitch === 'cost-per';
    const isAttributed = funnelStep?.isAttributed;

    const columns =
      tableMetricsSwitch === 'cost-per'
        ? createColumnStructure({
            isAttributed,
            idPrefix: 'funnelStepCostPer',
            funnelStepId: funnelStep?.funnelStepId,
            accessorPrefix: 'funnelStepCostPer',
            isCostPerView: isCostPerView,
            funnelStepType: funnelStep?.type,
            isBaselinePredictionRescaled,
            funnelStepTitle: funnelStep?.title,
            total: {
              predicted: optimizedFunnelStep?.costPer?.predicted,
              changePercent: optimizedFunnelStep?.costPer?.changePercent,
            },
          })
        : createColumnStructure({
            isAttributed,
            idPrefix: 'funnelStepValue',
            funnelStepId: funnelStep?.funnelStepId,
            accessorPrefix: 'funnelStepValue',
            isCostPerView: isCostPerView,
            funnelStepType: funnelStep?.type,
            isBaselinePredictionRescaled,
            funnelStepTitle: funnelStep?.title,
            total: {
              attribution: optimizedFunnelStep?.attribution,
              predicted: optimizedFunnelStep?.metric?.predicted,
              changePercent: optimizedFunnelStep?.metric?.changePercent,
            },
          });

    return {
      id: `funnel-step-header-${funnelStep?.funnelStepId}`,
      title: funnelStep?.title,
      disableSticky: true,
      className: 'border-right',

      Header: (
        <BigHeaderCell style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {tableMetricsSwitch === 'cost-per' ? header : funnelStep?.title}
          {isAttributed ? ': Attributed' : null}
          {optimizedFunnelStep?.lowDataVolume ? (
            <Tooltip
              variant="dark"
              content="Low data volume"
              popperProps={{
                style: {
                  zIndex: 3305,
                },
              }}
            >
              <div>
                <SvgWarningTwo style={{ width: 24, height: 24 }} />
              </div>
            </Tooltip>
          ) : null}
        </BigHeaderCell>
      ),
      disableSortBy: true,
      columns,
    };
  });
};

const createColumnStructure = ({
  idPrefix,
  funnelStepId,
  accessorPrefix,
  isCostPerView,
  funnelStepType,
  funnelStepTitle,
  total,
  isPercent = false,
  isBaselinePredictionRescaled,
  isAttributed,
}: {
  idPrefix: 'funnelStepCostPer' | 'funnelStepValue' | 'funnelStepRoas';
  funnelStepId: number;
  accessorPrefix: string;
  isCostPerView: boolean;
  funnelStepType: NexoyaFunnelStepType;
  funnelStepTitle: string;
  total: { predicted?: number; changePercent?: number; attribution?: NexoyaAttributionOptimizedMetric };
  isPercent?: boolean;
  isBaselinePredictionRescaled: boolean;
  isAttributed?: boolean;
}) => {
  return [
    {
      id: `${idPrefix}_total_${funnelStepId}`,
      Header: (
        <TotalHeaderCell>
          {isNullOrUndefined(total.predicted) ? (
            '-'
          ) : isPercent ? (
            <NumberValue
              datatype={{ suffix: true, symbol: '%' }}
              variant={total.predicted > 0 ? 'positive' : 'negative'}
              value={total.predicted}
            />
          ) : idPrefix === 'funnelStepCostPer' && funnelStepType !== NexoyaFunnelStepType.ConversionValue ? (
            <FormattedCurrency withColor={true} amount={total.predicted} />
          ) : isAttributed ? (
            <Tooltip
              variant="dark"
              style={{ maxWidth: 300, wordBreak: 'break-word', padding: 0 }}
              popperProps={{
                style: {
                  zIndex: 3305,
                },
              }}
              content={getOptiAttributedTooltipContent({
                funnelStepTitle,
                attributed: total.attribution?.attributed ?? 0,
                measured: total.attribution?.measured ?? 0,
                changePercent: total?.attribution?.changePercent ?? 0,
              })}
            >
              <div>
                <NumberValue variant={total.predicted > 0 ? 'positive' : 'negative'} value={total.predicted} />
              </div>
            </Tooltip>
          ) : (
            <NumberValue variant={total.predicted > 0 ? 'positive' : 'negative'} value={total.predicted} />
          )}
        </TotalHeaderCell>
      ),
      disableSortBy: true,
      columns: [
        {
          // Stable column id across tableMetricsSwitch views

          Header: (
            <Tooltip
              style={{ maxWidth: 320, wordBreak: 'break-word' }}
              variant="dark"
              popperProps={{
                style: {
                  zIndex: 3305,
                },
              }}
              content={
                <Typography withEllipsis={false} style={{ fontSize: 12 }}>
                  This is the predicted {isCostPerView ? 'cost-per' : 'value'} for the timeframe of this optimization.
                </Typography>
              }
            >
              <HoverableTooltip>
                <div>{isCostPerView ? 'Cost-per' : 'Value'}</div>
              </HoverableTooltip>
            </Tooltip>
          ),
          accessor: `${accessorPrefix}_${funnelStepId}`,
          sortType: withSortSkipped(sortTypes.createSortByAccessor(`${accessorPrefix}_${funnelStepId}`)),
          id:
            idPrefix === 'funnelStepRoas'
              ? `funnelStep_roas_${funnelStepId}_value`
              : `funnelStep_${funnelStepId}_value`,
        },
      ],
    },
    {
      id: `${idPrefix}_total_${funnelStepId}_change`,
      className: 'border-right',
      Header: (
        <TotalHeaderCell>
          {isNullOrUndefined(total.predicted) ? (
            '-'
          ) : (
            <NumberValue
              value={total.changePercent}
              textWithColor
              showChangePrefix
              variant={total.changePercent > 0 ? 'positive' : 'negative'}
              datatype={{ suffix: true, symbol: '%' }}
              lowerIsBetter={idPrefix === 'funnelStepCostPer'}
            />
          )}
        </TotalHeaderCell>
      ),
      disableSortBy: true,
      columns: [
        {
          // Stable column id across tableMetricsSwitch views

          Header: (
            <Tooltip
              variant="dark"
              style={{ maxWidth: 280, wordBreak: 'break-word' }}
              popperProps={{
                style: {
                  zIndex: 3305,
                },
              }}
              content={
                <Typography withEllipsis={false} style={{ fontSize: 12 }}>
                  <PortfolioTypeSwitch
                    renderForBudgetType={() =>
                      isBaselinePredictionRescaled
                        ? 'This is the uplift compared to the baseline without an optimization.'
                        : 'This is the difference between the predicted values with and without the suggested budget change.'
                    }
                    renderForTargetType={() => 'This is the change compared to the baseline without an optimization.'}
                  />
                </Typography>
              }
            >
              <HoverableTooltip>
                <PortfolioTypeSwitch
                  renderForBudgetType={() => <div>{isBaselinePredictionRescaled ? '% Uplift' : '% Change'}</div>}
                  renderForTargetType={() => <div>% Change</div>}
                />
              </HoverableTooltip>
            </Tooltip>
          ),
          className: 'border-right',
          accessor: `${accessorPrefix}_${funnelStepId}_change`,
          sortType: withSortSkipped(sortTypes.createSortByAccessor(`${accessorPrefix}_${funnelStepId}_change`)),
          id:
            idPrefix === 'funnelStepRoas'
              ? `funnelStep_roas_${funnelStepId}_change`
              : `funnelStep_${funnelStepId}_change`,
        },
      ],
    },
  ];
};

export const getHeader = (funnelStep: NexoyaFunnelStepV2) => {
  const headerMap = {
    [NexoyaFunnelStepType.ConversionValue]: 'Ratio-per',
    [NexoyaFunnelStepType.Awareness]: 'CPM',
  };
  const headerStart: string = headerMap[funnelStep?.type] || 'Cost-per';
  return funnelStep?.type === NexoyaFunnelStepType.Awareness ? headerStart : `${headerStart} ${funnelStep?.title}`;
};

export const includedRowToJsx = (
  row: RowRaw,
  editRowProps: IEditRowProps,
  tableViewSwitch,
  usedBudgetProposalTargetBiddingApplyMode: NexoyaTargetBiddingApplyMode,
) => {
  const ltbSegmentsSum = sumLifetimeBudgetSegments(row.lifetimeBudgetSegments);

  return {
    sortGroup: row.isExcluded ? 1 : 0,
    highlight: row.isExcluded,
    editRow: (
      <OptimizationDetailsTDM
        remove={!row.isExcluded}
        collectionId={row.contentId?.toString()}
        contentTitle={row.title}
        isWorking={editRowProps.isPageLoading}
        onConfirm={() =>
          row.isExcluded ? editRowProps.handleInclude(row.contentId) : editRowProps.handleExclude(row.contentId)
        }
      />
    ),
    channel: <AvatarCell key={row.providerId} providerId={row.providerId} />,
    content: (
      <ContentCell key={row.title} title={row.title} titleLink={row.titleLink} isPerforming={row.isPerforming} />
    ),
    status: <StatusCell key={row?.status?.type || 'Standard'} status={{ ...row.status, contentId: row.contentId }} />,
    impactGroup: (
      <Flex
        funnelSteps={row?.impactGroup?.funnelSteps?.map((fs) => fs.funnel_step_id).join(',')}
        id={row?.impactGroup?.impactGroupId?.toString()}
        key={row?.impactGroup?.impactGroupId?.toString()}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Typography style={{ fontWeight: 500 }} variant="paragraph" key={row?.impactGroup?.impactGroupId}>
          {row?.impactGroup?.name}
        </Typography>
      </Flex>
    ),
    ['label' + tableViewSwitch]: (
      <Flex
        id={row?.label?.name?.toString()}
        key={row?.label?.name?.toString()}
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          marginLeft: 16,
        }}
      >
        <Typography style={{ fontWeight: 500 }} variant="paragraph">
          {row?.label?.name}
        </Typography>
      </Flex>
    ),
    biddingStrategyData: {
      initialBiddingStrategy: row?.initialBiddingStrategy?.value,
      proposedBiddingStrategy: row?.proposedBiddingStrategy?.value,
      biddingStrategyChangePercent: row?.biddingStrategyChangePercent,
    },
    budgetWillBeApplied: row.budgetWillBeApplied,
    biddingStrategyWillBeApplied: row.biddingStrategyWillBeApplied,
    initialBiddingStrategy: (
      <WrapperStyled key={row?.initialBiddingStrategy?.value || 0}>
        {row?.initialBiddingStrategy?.value ? (
          <Tooltip
            variant="dark"
            content={translateBiddingStrategyType(row?.initialBiddingStrategy?.type)}
            popperProps={{
              style: {
                zIndex: 3305,
              },
            }}
          >
            <div className="flex flex-col items-center">
              {renderBiddingStrategyValueCell(row?.initialBiddingStrategy)}
              <LabelStyled>{translateBiddingStrategyType(row?.initialBiddingStrategy?.type)}</LabelStyled>
            </div>
          </Tooltip>
        ) : null}
      </WrapperStyled>
    ),
    proposedBiddingStrategy: (
      <WrapperStyled key={row?.proposedBiddingStrategy?.value || 0}>
        {row?.proposedBiddingStrategy?.value ? (
          <ProposedBiddingStrategyTooltip proposedBiddingStrategy={row?.proposedBiddingStrategy} />
        ) : null}
      </WrapperStyled>
    ),
    biddingStrategyChangePercent: (
      <WrapperStyled key={row?.biddingStrategyChangePercent || 0}>
        {row?.biddingStrategyChangePercent ? (
          <Tooltip
            variant="dark"
            content={translateBiddingStrategyType(row?.proposedBiddingStrategy?.type)}
            popperProps={{
              style: {
                zIndex: 3305,
              },
            }}
          >
            <div className="flex flex-col items-center">
              <NumberValue
                style={{ justifyContent: 'flex-end' }}
                value={row?.biddingStrategyChangePercent}
                showChangePrefix
                textWithColor
                variant={
                  row?.biddingStrategyChangePercent > 0
                    ? 'positive'
                    : row?.biddingStrategyChangePercent === 0
                      ? 'default'
                      : 'negative'
                }
                datatype={{
                  suffix: true,
                  symbol: '%',
                }}
              />
              <LabelStyled>{translateBiddingStrategyType(row?.proposedBiddingStrategy?.type)}</LabelStyled>
            </div>
          </Tooltip>
        ) : null}
      </WrapperStyled>
    ),
    lifetimeBudgetSegments: (
      <NumberWrapperStyled key={ltbSegmentsSum?.proposedBudget}>
        {ltbSegmentsSum?.proposedBudget ? (
          <Tooltip
            variant="dark"
            content={
              <FormulaTooltipContent>
                <FormulaTooltipHeader>
                  {dayjs(ltbSegmentsSum?.startDate).format('DD MMM YYYY')} -{' '}
                  {dayjs(ltbSegmentsSum?.endDate).format('DD MMM YYYY')}
                </FormulaTooltipHeader>
                <Divider margin="0" style={{ background: nexyColors.charcoalGrey }} />
                <FormulaTooltipTableContainer>
                  <FormulaTooltipRow>
                    <StyledSpan>Previous</StyledSpan> <FormattedCurrency amount={ltbSegmentsSum?.initialBudget} />
                  </FormulaTooltipRow>
                  <FormulaTooltipRow>
                    <StyledSpan>Proposed</StyledSpan> <FormattedCurrency amount={ltbSegmentsSum?.proposedBudget} />
                  </FormulaTooltipRow>
                  <FormulaTooltipRow>
                    <StyledSpan>Change (%)</StyledSpan>{' '}
                    <NumberValue
                      value={round(
                        ((ltbSegmentsSum?.proposedBudget - ltbSegmentsSum?.initialBudget) /
                          ltbSegmentsSum?.initialBudget) *
                          100,
                        2,
                      )}
                      showChangePrefix
                      textWithColor
                      datatype={{
                        suffix: true,
                        symbol: '%',
                      }}
                    />
                  </FormulaTooltipRow>
                  <FormulaTooltipRow>
                    <StyledSpan>Spent</StyledSpan> <FormattedCurrency amount={ltbSegmentsSum?.spend} />
                  </FormulaTooltipRow>
                  <FormulaTooltipRow>
                    <StyledSpan>Remaining</StyledSpan>
                    <FormattedCurrency amount={ltbSegmentsSum?.initialBudget - ltbSegmentsSum?.spend} />
                  </FormulaTooltipRow>
                  <FormulaTooltipRow>
                    <StyledSpan>Calculated at</StyledSpan> {dayjs(ltbSegmentsSum?.spendUpdatedAt).format('DD MMM YYYY')}
                  </FormulaTooltipRow>
                </FormulaTooltipTableContainer>
                <Divider margin="0" style={{ background: nexyColors.charcoalGrey }} />
                <FormulaTooltipContainer>
                  <BlueFormula>Lifetime budget</BlueFormula> = <GreenFormula>spent so far</GreenFormula>{' '}
                  <PurpleFormula>+</PurpleFormula> <GreenFormula>days left</GreenFormula>{' '}
                  <PurpleFormula>*</PurpleFormula> <GreenFormula>daily budget</GreenFormula>
                </FormulaTooltipContainer>
              </FormulaTooltipContent>
            }
            popperProps={{
              style: {
                padding: 12,
                width: 300,
                zIndex: 3305,
              },
            }}
          >
            <HoverableTooltip>
              <FormattedCurrency
                amount={row.lifetimeBudgetSegments?.reduce((acc, curr) => acc + curr.proposedBudget, 0)}
              />
            </HoverableTooltip>
          </Tooltip>
        ) : null}
      </NumberWrapperStyled>
    ),
    previousDailyTarget: (
      <NumberWrapperStyled key={row?.target?.previous}>
        {!isNullOrUndefined(row?.target?.previous) ? (
          <PortfolioTargetTypeSwitch
            renderForCPAType={() => <FormattedCurrency amount={row?.target?.previous} />}
            renderForROASType={() => (
              <NumberValue
                value={row?.target?.previous}
                datatype={{
                  suffix: true,
                  symbol: '%',
                }}
              />
            )}
          />
        ) : (
          '-'
        )}
      </NumberWrapperStyled>
    ),
    proposedDailyTarget: (
      <NumberWrapperStyled key={row?.target?.proposed}>
        {!isNullOrUndefined(row?.target?.proposed) ? (
          <PortfolioTargetTypeSwitch
            renderForCPAType={() => <FormattedCurrency amount={row?.target?.proposed} />}
            renderForROASType={() => (
              <NumberValue
                value={row?.target?.proposed}
                datatype={{
                  suffix: true,
                  symbol: '%',
                }}
              />
            )}
          />
        ) : (
          '-'
        )}
      </NumberWrapperStyled>
    ),
    platformBudget: (
      <NumberWrapperStyled key={row.initialBudgetDaily || 0}>
        {isNullOrUndefined(row.initialBudgetDaily) ? '' : <FormattedCurrency amount={row.initialBudgetDaily} />}
      </NumberWrapperStyled>
    ),
    previousDailyBudget: (
      <NumberWrapperStyled key={row.previousDailyBudget}>
        <FormattedCurrency amount={row.previousDailyBudget} />
      </NumberWrapperStyled>
    ),
    proposedDailyBudget: (
      <div key={row.proposedDailyBudget} className="flex gap-2">
        <NumberWrapperStyled key={row.proposedDailyBudget}>
          <FormattedCurrency amount={row.proposedDailyBudget} />
          {typeof row.initialBudgetDaily === 'number' &&
            row.proposedDailyBudget > row.initialBudgetDaily &&
            usedBudgetProposalTargetBiddingApplyMode === NexoyaTargetBiddingApplyMode.BiddingStrategyOnly &&
            row?.proposedBiddingStrategy?.value && (
              <Tooltip
                popperProps={{
                  style: {
                    zIndex: 33021,
                  },
                }}
                style={{ maxWidth: 420, wordBreak: 'break-word' }}
                size="small"
                placement="right"
                variant="dark"
                content="The proposed budget exceeds the current platform budget. To avoid underspending, the budget will be applied automatically."
              >
                <div className="flex h-full items-center justify-center">
                  <Info className="ml-1 size-5 text-neutral-400" />
                </div>
              </Tooltip>
            )}
        </NumberWrapperStyled>
      </div>
    ),
    proposedDailyBudgetChange: (
      <NumberWrapperStyled key={row.proposedDailyBudgetChange}>
        <NumberValue
          value={row.proposedDailyBudgetChange}
          showChangePrefix
          textWithColor
          variant={
            row.proposedDailyBudgetChange > 0
              ? 'positive'
              : row.proposedDailyBudgetChange === 0
                ? 'default'
                : 'negative'
          }
          datatype={{
            suffix: true,
            symbol: '%',
          }}
        />
      </NumberWrapperStyled>
    ),
    proposedDailyTargetChange: (
      <NumberWrapperStyled key={row?.target?.changePercent}>
        {isNullOrUndefined(row?.target?.changePercent) ? (
          <NumberValue
            value={row?.target?.changePercent}
            lowerIsBetter={row?.target?.lowerIsBetter}
            showChangePrefix
            variant={row?.target?.changePercent > 0 ? 'positive' : 'negative'}
            textWithColor
            datatype={{
              suffix: true,
              symbol: '%',
            }}
          />
        ) : (
          '-'
        )}
      </NumberWrapperStyled>
    ),
    ...(row.funnelSteps || [])
      .map((optimizedFunnelStep) => ({
        [`funnelStepCostPer_${optimizedFunnelStep?.funnelStep?.funnelStepId}`]: (
          <NumberWrapperStyled key={optimizedFunnelStep?.costPer?.predicted || Infinity}>
            {isNullOrUndefined(optimizedFunnelStep?.costPer?.predicted) ? (
              '-'
            ) : isConversionValueFunnelStep(optimizedFunnelStep?.funnelStep?.type) ? (
              <NumberValue value={optimizedFunnelStep?.costPer?.predicted ?? 0} lowerIsBetter />
            ) : (
              <FormattedCurrency amount={optimizedFunnelStep?.costPer?.predicted} withColor={true} />
            )}
          </NumberWrapperStyled>
        ),
        [`funnelStepCostPer_${optimizedFunnelStep?.funnelStep?.funnelStepId}_change`]: (
          <NumberWrapperStyled key={optimizedFunnelStep?.costPer?.changePercent || Infinity}>
            {isNullOrUndefined(optimizedFunnelStep?.costPer?.changePercent) ? (
              '-'
            ) : (
              <NumberValue
                textWithColor
                showChangePrefix
                variant={optimizedFunnelStep?.costPer?.changePercent > 0 ? 'positive' : 'negative'}
                value={optimizedFunnelStep?.costPer?.changePercent ?? 0}
                datatype={{
                  suffix: true,
                  symbol: '%',
                }}
                lowerIsBetter
              />
            )}
          </NumberWrapperStyled>
        ),
        [`funnelStepValue_${optimizedFunnelStep?.funnelStep?.funnelStepId}`]: (
          <NumberWrapperStyled key={optimizedFunnelStep?.metric?.predicted || 0}>
            {isNullOrUndefined(optimizedFunnelStep?.metric?.predicted) ? (
              '-'
            ) : optimizedFunnelStep?.funnelStep?.isAttributed ? (
              <Tooltip
                variant="dark"
                style={{ maxWidth: 300, wordBreak: 'break-word', padding: 0 }}
                popperProps={{
                  style: {
                    zIndex: 3305,
                  },
                }}
                content={getOptiAttributedTooltipContent({
                  funnelStepTitle: optimizedFunnelStep?.funnelStep?.title,
                  attributed: optimizedFunnelStep?.attribution?.attributed || optimizedFunnelStep?.metric?.predicted,
                  measured: optimizedFunnelStep?.attribution?.measured ?? 0,
                  changePercent: optimizedFunnelStep?.attribution?.changePercent ?? 0,
                })}
              >
                <div>
                  <NumberValue value={optimizedFunnelStep?.metric?.predicted ?? 0} />
                </div>
              </Tooltip>
            ) : (
              <NumberValue value={optimizedFunnelStep?.metric?.predicted ?? 0} />
            )}
          </NumberWrapperStyled>
        ),
        [`funnelStepValue_${optimizedFunnelStep?.funnelStep?.funnelStepId}_change`]: (
          <NumberWrapperStyled key={optimizedFunnelStep?.metric?.changePercent || 0}>
            {isNullOrUndefined(optimizedFunnelStep?.metric?.changePercent) ? (
              '-'
            ) : (
              <NumberValue
                textWithColor
                showChangePrefix
                variant={optimizedFunnelStep?.metric?.changePercent > 0 ? 'positive' : 'negative'}
                value={optimizedFunnelStep?.metric?.changePercent ?? 0}
                datatype={{
                  suffix: true,
                  symbol: '%',
                }}
              />
            )}
          </NumberWrapperStyled>
        ),
        [`funnelStepRoas_${optimizedFunnelStep?.funnelStep?.funnelStepId}`]: (
          <NumberWrapperStyled key={optimizedFunnelStep?.roas?.predicted || 0}>
            <NumberValue
              value={optimizedFunnelStep?.roas?.predicted ?? 0}
              datatype={{
                suffix: true,
                symbol: '%',
              }}
            />
          </NumberWrapperStyled>
        ),
        [`funnelStepRoas_${optimizedFunnelStep?.funnelStep?.funnelStepId}_change`]: (
          <NumberWrapperStyled key={optimizedFunnelStep?.roas?.changePercent || 0}>
            <NumberValue
              textWithColor
              showChangePrefix
              variant={optimizedFunnelStep?.roas?.changePercent > 0 ? 'positive' : 'negative'}
              value={optimizedFunnelStep?.roas?.changePercent ?? 0}
              datatype={{
                suffix: true,
                symbol: '%',
              }}
            />
          </NumberWrapperStyled>
        ),
      }))
      .reduce((acc, goal) => ({ ...acc, ...goal }), {}),
  };
};
export const skippedRowToJsx = (
  skippedRow: NexoyaOptimizedContent,
  optimization: NexoyaOptimizationV2,
  isActivePortfolio: boolean,
) => {
  const data = {
    contentId: skippedRow?.content?.collection_id,
    description: skippedRow.status.reason,
    activePortfolio: isActivePortfolio,
    providerId: skippedRow.content?.provider?.provider_id,
    title: skippedRow.content?.title || '',
    titleLink: skippedRow?.content?.collection_id
      ? buildContentPath(skippedRow?.content?.collection_id, {
          dateFrom: optimization.start.substring(0, 10),
          dateTo: optimization.end.substring(0, 10),
        })
      : undefined,
    status: skippedRow.status,
  };

  return {
    highlight: true,
    sortGroup: 2,
    channel: <AvatarCell key={data.providerId} providerId={data.providerId} />,
    content: <ContentCell key={data.title} title={data.title} titleLink={data.titleLink} isPerforming={false} />,
    status: <StatusCell status={data.status} />,
  };
};
