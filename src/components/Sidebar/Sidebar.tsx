import React, { useLayoutEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { useTeamQuery } from '../../graphql/team/queryTeam';

import { EVENT } from '../../constants/events';

import { EXTERNAL_GOOGLE_ADS_MANAGEMENT_URL, PATHS } from '../../routes/paths';
import SvgPortfolio from 'components/icons/Portfolio';

import { sizes } from '../../theme/device';
import * as Styles from './styles/Sidebar';

import ButtonBase from '../ButtonBase';
import { pathIncludes } from '../ButtonNav';
import { Logo } from '../Logo';
import { LaptopLUp } from '../MediaQuery';
import Account from './components/Account';
import SvgBullseyePointer from '../icons/BullseyePointer';
import SvgCog from '../icons/Cog';
import SvgFileChartLine from '../icons/FileChartLine';
import SvgHomeAlt from '../icons/HomeAlt';
import SvgProjectDiagram from '../icons/ProjectDiagram';
import SvgQuestionCircle from '../icons/QuestionCircle';
import PortfoliosSearchSidebarItem, { SearchComponentType } from './PortfolioSearchSidebarItem';
import SidebarItem from './SidebarItem';
import Teams from './Teams';
import TooltipWrapForSmallScreens from './TooltipWrapForSmallScreens';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { FEATURE_FLAGS } from '../../constants/featureFlags';
import { useSidebar } from '../../context/SidebarProvider';
import { cn } from '../../lib/utils';
import { Button } from '../../components-ui/Button';
import { Skeleton } from '../../components-ui/Skeleton';
import SvgNexoyaLogo from '../icons/NexoyaLogo';
import useUserStore from '../../store/user';
import useOrganizationStore from '../../store/organization';
import SvgAttributions from '../icons/Attributions';

const SIDEBAR_ITEMS = [
  {
    name: (
      <div>
        Welcome <span style={{ marginLeft: 4 }}>👋</span>
      </div>
    ),
    cy: 'welcomeBtnNav',
    link: PATHS.APP.ONBOARD_GUIDE,
    exact: true,
    isOnboarding: true,
  },
  {
    name: 'Dashboard',
    cy: 'dashboardBtnNav',
    link: PATHS.APP.HOME,
    exact: true,
    icon: <SvgHomeAlt />,
  },
  {
    name: 'Portfolios',
    cy: 'portfoliosBtnNav',
    link: PATHS.APP.PORTFOLIOS,
    event: EVENT.ROUTE_PORTFOLIOS,
    icon: <SvgPortfolio />,
    component: SearchComponentType.PORTFOLIOS,
  },
  {
    name: 'Attributions',
    cy: 'attributionsBtnNav',
    link: PATHS.APP.ATTRIBUTIONS,
    event: EVENT.ROUTE_ATTRIBUTION,
    icon: <SvgAttributions />,
    feature: FEATURE_FLAGS.ATTRIBUTION_MODEL,
  },
  {
    name: 'Reports',
    cy: 'reportsBtnNav',
    link: PATHS.APP.REPORTS,
    icon: <SvgFileChartLine />,
    event: EVENT.ROUTE_REPORTS,
  },
  {
    name: 'Metrics',
    cy: 'metricsBtnNav',
    link: PATHS.APP.KPIS,
    icon: <SvgBullseyePointer />,
    isActive: pathIncludes('/content/'),
  },
  {
    name: 'Correlations',
    cy: 'correlationsBtnNav',
    link: PATHS.APP.CORRELATIONS,
    icon: <SvgProjectDiagram />,
    event: EVENT.ROUTE_CORRELATIONS,
  },
  {
    name: 'Campaign Manager',
    link: EXTERNAL_GOOGLE_ADS_MANAGEMENT_URL,
    feature: FEATURE_FLAGS.GOOGLE_ADS_CAMPAIGN_MANAGEMENT,
    icon: <ExternalLink className="h-4 w-4 text-neutral-700" />,
    event: EVENT.ROUTE_CORRELATIONS,
    external: true,
  },
];

const LOWER_SIDEBAR_ITEMS = [
  {
    name: 'Settings',
    cy: 'settings',
    link: PATHS.APP.SETTINGS,
    icon: <SvgCog />,
    isActive: pathIncludes('/settings/'),
  },
];

function SidebarSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Main navigation items skeleton */}
      <div className="flex flex-col gap-2 px-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-2.5">
            {/* Icon skeleton */}
            <Skeleton className="h-5 w-5 rounded" />
            {/* Text skeleton */}
            <Skeleton className="h-5 flex-1 rounded" />
          </div>
        ))}
      </div>

      {/* Lower sidebar items skeleton */}
      <div className="mt-auto flex flex-col gap-2 px-3">
        {[1].map((index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-2.5">
            {/* Icon skeleton */}
            <Skeleton className="h-5 w-5 rounded" />
            {/* Text skeleton */}
            <Skeleton className="h-4 flex-1 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Sidebar() {
  const [filteredItems, setFilteredItems] = useState(SIDEBAR_ITEMS);

  const { user, isSupportUser } = useUserStore();
  const { organization } = useOrganizationStore();

  const { data: teamData, loading } = useTeamQuery({
    withMembers: false,
    withOrg: false,
  });

  const { sidebarWidth, isCollapsed, toggleCollapse } = useSidebar();

  useLayoutEffect(() => {
    if (!loading && user) {
      const isOnboarding = teamData?.team?.onboarding?.onboardingTasks?.length;
      const hasCustomDashboardLinks = teamData?.team?.dashboardUrls?.length;

      let filteredItems = SIDEBAR_ITEMS;

      if (isOnboarding && !isSupportUser) {
        filteredItems = filteredItems.filter((sidebarItem) => sidebarItem.isOnboarding);
      } else {
        filteredItems = filteredItems.filter((sidebarItem) => !sidebarItem.isOnboarding);
      }

      if (!hasCustomDashboardLinks) {
        filteredItems = filteredItems.filter((sidebarItem) => sidebarItem.name !== 'Dashboard');
      }

      if (!isSupportUser) {
        filteredItems = filteredItems.filter((sidebarItem) => sidebarItem.name !== 'Attributions');
      }

      setFilteredItems(filteredItems);
    }
  }, [teamData, user]);

  const isBelowLaptopL = useMediaQuery({
    maxWidth: sizes.laptopL - 1,
  });

  return (
    <Styles.WrapStyled className="group relative" isCollapsed={isCollapsed} sidebarWidth={sidebarWidth}>
      <div className={cn('logo-wrap flex', isCollapsed ? 'justify-center' : 'justify-between')}>
        {isCollapsed ? (
          <SvgNexoyaLogo style={{ width: 24, height: 24 }} />
        ) : (
          <Logo hideName={isBelowLaptopL || isCollapsed} />
        )}

        {!isBelowLaptopL ? (
          <Button
            style={{ filter: 'drop-shadow(0px 4px 8px rgba(138, 140, 158, 0.25))' }}
            className="absolute right-[-10px] top-[54px] z-10 h-5 w-5 rounded-full opacity-0 transition-opacity hover:bg-neutral-50 hover:text-neutral-600 group-hover:opacity-100"
            onClick={toggleCollapse}
            variant="outline"
            size="icon"
          >
            {isCollapsed ? (
              <ChevronRight className={cn('h-[20px] w-[20px]', isBelowLaptopL ? 'opacity-0' : 'opacity-100')} />
            ) : (
              <ChevronLeft className={cn('h-[20px] w-[20px]', isBelowLaptopL ? 'opacity-0' : 'opacity-100')} />
            )}
          </Button>
        ) : null}
      </div>
      <Teams className="team-wrap" />
      <Styles.ScrollbarStyled className="nav-wrap overflow-hidden">
        <div>
          {loading ? (
            <SidebarSkeleton />
          ) : (
            filteredItems.map((item) =>
              item?.component === SearchComponentType.PORTFOLIOS ? (
                <PortfoliosSearchSidebarItem key={item.link} item={item} />
              ) : (
                // @ts-ignore
                <SidebarItem key={item!.link} item={item} />
              ),
            )
          )}
        </div>
        <div>
          {!loading ? LOWER_SIDEBAR_ITEMS.map((item) => <SidebarItem key={item.link} item={item} />) : null}
          <Styles.SupportWrapStyled className="support-wrap">
            <TooltipWrapForSmallScreens content="Help" variant="dark" placement="right">
              <ButtonBase
                data-cy="helpBtnNav"
                href={organization?.tenant?.uiCustomization?.helpPageUrl}
                target="_blank"
              >
                <SvgQuestionCircle className="fill-neutral-700" style={{ width: 19.2, height: 19.2 }} />
                <LaptopLUp>
                  <span className="font-light text-neutral-700">Help</span>
                </LaptopLUp>
              </ButtonBase>
            </TooltipWrapForSmallScreens>
          </Styles.SupportWrapStyled>

          <Account />
        </div>
      </Styles.ScrollbarStyled>
    </Styles.WrapStyled>
  );
}

export default Sidebar;
