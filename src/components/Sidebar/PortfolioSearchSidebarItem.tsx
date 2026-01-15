import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';

import styled from 'styled-components';

import { NexoyaPortfolioEdges, NexoyaSortField } from '../../types';

import { withPortfolioProvider } from '../../context/PortfolioProvider';
import { usePortfoliosFilter, withPortfolioFilterProvider } from '../../context/PortfoliosFilterProvider';
import { usePortfoliosQuery } from '../../graphql/portfolio/queryPortfolios';

import { track } from '../../constants/datadog';
import { djsAnchors, isLaterDay } from '../../utils/dates';
import { buildPortfolioPathWithDates } from '../../utils/portfolio';

import { ExpandButtonStyled } from 'components/ButtonIcon/styles';
import ButtonNav from 'components/ButtonNav';
import { LaptopLUp } from 'components/MediaQuery';
import { Skeleton } from '../../components-ui/Skeleton';

import * as Styles from './styles/Sidebar';

import { nexyColors } from '../../theme';
import Typography from '../Typography';
import SvgChevronDown from '../icons/ChevronDown';
import TooltipWrapForSmallScreens from './TooltipWrapForSmallScreens';
import { useUnsavedChanges } from '../../context/UnsavedChangesProvider';
import { StringParam, useQueryParams } from 'use-query-params';

const StyledTypography = styled(Typography)`
  font-size: 12px;
  padding: 4px 19px 4px 15px;
`;

const PortfoliosFilterWrapper = styled.div`
  margin-left: 16px;
  margin-top: 12px;

  .NEXYInputWrap {
    padding: 6px 10px;
    input {
      font-size: 12px;
      font-weight: 400;
    }
    svg {
      display: none;
    }
  }
`;

const StyledNavLink = styled(NavLink)`
  color: ${nexyColors.neutral600};

  .dot {
    margin-right: 7px;
    height: 5px;
    width: 5px;
    background-color: #d9d9d9;
    border-radius: 50%;
    display: inline-flex;
  }

  .title {
    vertical-align: middle;
  }

  &.active {
    color: ${nexyColors.neutral900};
    .dot {
      color: #41424e;
    }
    .title {
      text-decoration: underline;
    }
  }
`;

const ButtonNavStyled = styled(ButtonNav)`
  display: flex;
  justify-content: space-between !important;
`;

export const enum SearchComponentType {
  PORTFOLIOS = 'PORTFOLIOS',
}

interface SidebarItem {
  name: string;
  cy: string;
  link: string;
  icon: JSX.Element | null;
  event: string;
  isActive: boolean;
  exact: boolean;
}

function PortfolioSkeleton() {
  return (
    <div className="mt-3 space-y-1">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="flex items-center gap-2 px-4 py-1">
          {/* Dot skeleton */}
          <Skeleton className="h-1 w-1 rounded-full" />
          {/* Text skeleton */}
          <Skeleton className="h-3.5 flex-1 rounded" />
        </div>
      ))}
    </div>
  );
}

function PortfoliosSearchSidebarItem({ item }: { item: SidebarItem }) {
  const location = useLocation();
  const history = useHistory();
  const isActive = item.isActive || location.pathname.includes(item.link);
  const [expanded, setExpanded] = useState(isActive);
  const { search, order } = usePortfoliosFilter();
  const [qp] = useQueryParams({
    dateFrom: StringParam,
    dateTo: StringParam,
  });
  const { setHasUnsavedChanges, handleNavigation } = useUnsavedChanges();

  useEffect(() => {
    if (isActive) {
      setExpanded(isActive);
    }
  }, [isActive]);

  const { data, loading } = usePortfoliosQuery({
    first: 100,
    where: {
      search: search.value,
    },
    sortBy: {
      field: NexoyaSortField.Title,
      order: order?.value?.orderByTitle,
    },
  });

  const portfolios: NexoyaPortfolioEdges[] =
    data?.portfolios?.edges?.filter((portfolio: NexoyaPortfolioEdges) =>
      isLaterDay(portfolio.node.endDate, djsAnchors.today),
    ) || [];

  const onClick = (e) => {
    e.preventDefault();
    if (item.event) {
      track(item.event);
    }

    handleNavigation(() => {
      setHasUnsavedChanges(false);
      history.push(item.link);
    });
  };

  return (
    <TooltipWrapForSmallScreens content={item.name} variant="dark" placement="right">
      <Styles.NavWrapStyled>
        <ButtonNavStyled data-cy={item.cy} to={item.link} exact={item.exact} isActive={item.isActive} onClick={onClick}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {item.icon}
            <LaptopLUp>{item.name}</LaptopLUp>
          </div>
          <LaptopLUp>
            <ExpandButtonStyled
              style={{ padding: 0, justifyContent: 'end' }}
              onClick={(e) => {
                e.preventDefault();
                setExpanded((s) => !s);
              }}
            >
              <SvgChevronDown
                style={{
                  height: 15,
                  width: 15,
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </ExpandButtonStyled>
          </LaptopLUp>
        </ButtonNavStyled>
        <LaptopLUp>
          {expanded ? (
            <div className="transition-all">
              {loading ? (
                <PortfolioSkeleton />
              ) : (
                <div className="mt-2 max-h-96 overflow-y-auto pr-1">
                  {portfolios?.map((portfolio) => {
                    const portfolioPath = buildPortfolioPathWithDates(portfolio?.node, {
                      dateFrom: qp.dateFrom,
                      dateTo: qp.dateTo,
                    });
                    const handlePortfolioClick = (e) => {
                      e.preventDefault();

                      handleNavigation(() => {
                        setHasUnsavedChanges(false);
                        history.push(portfolioPath);
                      });
                    };

                    return (
                      <StyledNavLink
                        key={portfolio.node.portfolioId}
                        to={portfolioPath}
                        isActive={(match: { url: string }) => {
                          if (!match) {
                            return false;
                          }
                          const portfolioId = parseInt(match?.url?.split('/')?.pop());
                          return portfolioId === portfolio.node.portfolioId;
                        }}
                        onClick={handlePortfolioClick} // Ensures navigation goes through handleNavigation
                      >
                        <StyledTypography tooltipValue={portfolio.node?.title} withTooltipV2>
                          <span className="dot"></span>
                          <span className="title">{portfolio.node?.title}</span>
                        </StyledTypography>
                      </StyledNavLink>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}
        </LaptopLUp>
      </Styles.NavWrapStyled>
    </TooltipWrapForSmallScreens>
  );
}

export default withPortfolioFilterProvider(withPortfolioProvider(PortfoliosSearchSidebarItem));
