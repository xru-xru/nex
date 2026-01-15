import React, { useState } from 'react';
import { portfolioTabs, TAB_TITLES } from '../../configs/portfolio';
import { FEATURE_FLAGS } from '../../constants/featureFlags';
import FeatureSwitch from '../FeatureSwitch';
import { BooleanParam, NumberParam, StringParam, useQueryParam, useQueryParams } from 'use-query-params';
import { nexyColors } from '../../theme';
import * as Styles from '../../routes/portfolio/styles/Portfolio';
import Tooltip from '../Tooltip';
import ButtonIcon from '../ButtonIcon';
import { CirclePlus } from 'lucide-react';
import { DateSelector } from '../DateSelector';
import SimulationCreate from '../../routes/portfolio/components/Simulations/SimulationCreate';
import { cn } from '../../lib/utils';
import useUserStore from '../../store/user';
import { LaunchOptimizationDialog } from '../../routes/portfolio/components/LaunchOptimization/LaunchOptimizationDialog';

interface PortfolioTabHeaderProps {
  portfolioMetaData: any;
  dateSelectorProps: any;
  comparisonDateSelectorProps: any;
}

export const PortfolioTabHeader: React.FC<PortfolioTabHeaderProps> = ({
  portfolioMetaData,
  dateSelectorProps,
  comparisonDateSelectorProps,
}) => {
  const [activeTab] = useQueryParam('activeTab', StringParam);
  const [defaultDatePickerComparisonOpen, setDefaultDatePickerComparisonOpen] = useState(false);
  const portfolioId = portfolioMetaData?.portfolioV2?.portfolioId;
  const { dateFrom, dateTo } = dateSelectorProps;
  const [queryParams, setQueryParams] = useQueryParams({
    simulationId: NumberParam,
    activeTab: StringParam,
    activeContentTab: StringParam,
    selectedScenarioId: NumberParam,
    scenarioMetricSwitch: StringParam,
    xAxis: StringParam,
    yAxis: StringParam,
    dateComparisonActive: BooleanParam,
  });

  const { isSupportUser } = useUserStore();

  // Get the title and subtitle based on activeTab
  const tabTitles =
    activeTab && !queryParams.simulationId
      ? activeTab === portfolioTabs.CONTENT && queryParams.activeContentTab
        ? TAB_TITLES[queryParams.activeContentTab]
        : TAB_TITLES[activeTab]
      : null;

  const renderDateComparison = () => (
    <div
      className={cn(
        'flex h-full items-center justify-center gap-4 rounded-md border bg-neutral-50 p-2',
        'mt-[3px] rounded-b-none border-b-0',
      )}
    >
      <DateSelector
        {...comparisonDateSelectorProps}
        defaultDatePickerOpen={defaultDatePickerComparisonOpen}
        style={{
          fontSize: 12,
          height: 'fit-content',
          padding: '6px 4px 6px 10px',
          color: nexyColors.lilac,
        }}
      />
      <span className="my-auto h-full content-center text-lg font-light text-cloudyBlue">vs</span>
      <DateSelector
        style={{
          fontSize: 12,
          height: 'fit-content',
          padding: '6px 4px 6px 10px',
          color: nexyColors.greenTeal,
        }}
        {...dateSelectorProps}
      />
    </div>
  );

  return (
    <div className="flex">
      {activeTab !== portfolioTabs.SETTINGS && (
        <>
          {tabTitles?.title && (
            <div className="mb-7 ml-1">
              <>
                <div className="text-[20px] font-medium tracking-normal">{tabTitles?.title}</div>
                <div className="text-md font-normal text-neutral-500">{tabTitles?.subtitle}</div>
              </>
            </div>
          )}
        </>
      )}

      <Styles.TimeSpanWrap
        style={{ height: 'fit-content' }}
        lastDivHeight={queryParams.dateComparisonActive ? 'fit-content' : '100%'}
        bottomBorderRadius={4}
      >
        {activeTab === portfolioTabs.PERFORMANCE &&
          (!queryParams.dateComparisonActive ? (
            <>
              <Tooltip placement="left" variant="dark" size="small" content="Compare time periods">
                <ButtonIcon
                  onClick={() => {
                    setQueryParams({ dateComparisonActive: true });
                    setDefaultDatePickerComparisonOpen(true);
                  }}
                  style={{ marginRight: 8 }}
                >
                  <CirclePlus className="h-5 w-5 text-neutral-300" />
                </ButtonIcon>
              </Tooltip>
              <DateSelector {...dateSelectorProps} />
            </>
          ) : (
            renderDateComparison()
          ))}

        {(activeTab === portfolioTabs.VALIDATION || activeTab === portfolioTabs.TARGET) && (
          <DateSelector {...dateSelectorProps} />
        )}

        {activeTab === portfolioTabs.BUDGET && <DateSelector {...dateSelectorProps} />}

        {activeTab === portfolioTabs.OPTIMIZATION && isSupportUser && (
          <LaunchOptimizationDialog portfolioId={portfolioId} />
        )}

        {activeTab === portfolioTabs.SIMULATIONS && (
          <FeatureSwitch
            features={[FEATURE_FLAGS.SIMULATIONS]}
            renderOld={() => null}
            renderNew={() =>
              !queryParams.simulationId ? (
                <SimulationCreate portfolioId={portfolioId} startDate={dateFrom} endDate={dateTo} />
              ) : null
            }
          />
        )}
      </Styles.TimeSpanWrap>
    </div>
  );
};
