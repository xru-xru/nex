import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'components-ui/DropdownMenu';

import { usePortfolio } from '../../../../../context/PortfolioProvider';

import { track } from '../../../../../constants/datadog';
import { EVENT } from '../../../../../constants/events';

import Switch from '../../../../../components/Switch';
import SvgCog from '../../../../../components/icons/Cog';

import { SwitchContainerStyled } from '../../Funnel/styles';
import { ButtonStyled } from '../PerformanceChartHeader.styles';
import { useCustomizationStore } from '../../../../../store/customization';

function Customization() {
  const {
    performanceChart: { showEvents, setShowEvents },
  } = usePortfolio();

  const {
    compareTo,
    setCompareTo,
    isStackedAreaChartActive,
    setIsStackedAreaChartActive,
    conversionRateToggle,
    setConversionRateToggle,
  } = useCustomizationStore();

  const handleConversionRateToggle = (e) => {
    e?.preventDefault();
    setConversionRateToggle(!conversionRateToggle);
    track(EVENT.PERFORMANCE_FUNNEL_CUSTOMIZE, {
      'Show conversion rate': !conversionRateToggle,
    });
  };

  const handleStackedAreaChartToggle = (e) => {
    e?.preventDefault();
    setIsStackedAreaChartActive(!isStackedAreaChartActive);
    track(EVENT.PERFORMANCE_FUNNEL_CUSTOMIZE, {
      'Show stacked area chart': !isStackedAreaChartActive,
    });
  };

  const handleCompareToToggle = (e) => {
    e?.preventDefault();
    setCompareTo(!compareTo);
    track(EVENT.PERFORMANCE_FUNNEL_CUSTOMIZE, {
      'Compare to rest of the data': !compareTo,
    });
  };

  const handleShowEvents = (e) => {
    e?.preventDefault();
    setShowEvents(!showEvents);
    track(EVENT.PERFORMANCE_FUNNEL_CUSTOMIZE, {
      'Show events': !showEvents,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonStyled variant="contained" color="secondary" data-cy="filterSourceBtn">
          <SvgCog />
          <span style={{ marginLeft: 5 }}>Customize</span>
        </ButtonStyled>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 font-normal" align="end">
        <DropdownMenuItem onSelect={handleConversionRateToggle}>
          <SwitchContainerStyled>
            <p>Show conversion rate</p>
            <Switch isOn={conversionRateToggle} className="pointer-events-none" />
          </SwitchContainerStyled>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handleStackedAreaChartToggle}>
          <SwitchContainerStyled>
            <p>Show stacked area chart</p>
            <Switch isOn={isStackedAreaChartActive} className="pointer-events-none" />
          </SwitchContainerStyled>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handleCompareToToggle}>
          <SwitchContainerStyled>
            <p>Compare to rest of the data</p>
            <Switch isOn={compareTo} className="pointer-events-none" />
          </SwitchContainerStyled>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handleShowEvents}>
          <SwitchContainerStyled>
            <p>Show events</p>
            <Switch isOn={showEvents} className="pointer-events-none" />
          </SwitchContainerStyled>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { Customization };
