import React from 'react';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaSortField, NexoyaSortOrder } from '../../types/types';
import { NexoyaPortfolioEdges } from 'types';

import { withPortfolioProvider } from '../../context/PortfolioProvider';
import { withPortfolioFilterProvider } from '../../context/PortfoliosFilterProvider';
import { usePortfoliosQuery } from '../../graphql/portfolio/queryPortfolios';

import { format } from '../../utils/dates';
import { buildPortfolioPathWithDates } from '../../utils/portfolio';

import Button from '../../components/Button';
import CSSGrid from '../../components/CSSGrid';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import ErrorMessage from '../../components/ErrorMessage';
import FormattedCurrency from '../../components/FormattedCurrency';
import GridHeader from '../../components/GridHeader/GridHeader';
import GridNameLink from '../../components/GridNameLink';
import GridWrap from '../../components/GridWrap';
import LoadingPlaceholder from '../../components/LoadingPlaceholder';
import { PageHeader, PageHeaderActions, PageHeaderTitle } from '../../components/PageHeader';
import Typography from '../../components/Typography';

import { colorByKey } from '../../theme/utils';

import { PATHS } from '../paths';
import CreatePortfolio from '../portfolios/CreatePortfolio';

const LoadingWrapStyled = styled.div`
  & > div {
    height: 52px;
    margin-bottom: 12px;

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
const GridWrapStyled = styled(GridWrap)`
  .NEXYCSSGrid {
    grid-column-gap: 10px;
  }
  .NEXYPercentCircle {
    justify-self: center;
  }
`;
const RowGridStyled = styled(CSSGrid)`
  align-items: center;
  min-height: 54px;
  color: ${colorByKey('blueGrey')};
  font-weight: 400;
  border-bottom: 1px solid ${colorByKey('paleGrey')};
  .NEXYGridNameLink {
    color: ${colorByKey('darkGrey')};
    &:hover {
      color: ${colorByKey('greenTeal')};
    }
  }
`;
const CreatePortfolioWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
`;

const DashboardPortfolios = () => {
  const { data, loading, error } = usePortfoliosQuery({
    first: 4,
    sortBy: {
      field: NexoyaSortField.Title,
      order: NexoyaSortOrder.Asc,
    },
  });
  const portfolios: NexoyaPortfolioEdges[] = get(data, 'portfolios.edges', []);
  return (
    <>
      <PageHeader
        style={{
          alignItems: 'baseline',
        }}
      >
        <PageHeaderTitle>
          <Typography variant="h2" component="h3">
            Portfolios
          </Typography>
        </PageHeaderTitle>
        <PageHeaderActions
          style={{
            marginTop: 0,
          }}
        >
          <Button data-cy="viewAllCampaignsDashboardBtn" to={PATHS.APP.PORTFOLIOS} variant="contained" size="small">
            View all
          </Button>
        </PageHeaderActions>
      </PageHeader>
      {portfolios.length === 0 ? (
        <CreatePortfolioWrapperStyled>
          <CreatePortfolio />
        </CreatePortfolioWrapperStyled>
      ) : (
        <div style={{ marginBottom: 25 }}>
          <ErrorBoundary>
            <GridWrapStyled gridTemplateColumns="minmax(250px, 1.5fr) minmax(250px, 1.5fr) 1fr">
              <GridHeader
                style={{
                  gridColumnGap: '10px',
                }}
                data-cy="portfolioTableHeader"
              >
                <Typography>Portfolio Name</Typography>
                <Typography>Scheduled Through</Typography>
                <Typography>Budget</Typography>
                <span />
              </GridHeader>
              {loading ? (
                <LoadingWrapStyled>
                  <LoadingPlaceholder />
                  <LoadingPlaceholder />
                  <LoadingPlaceholder />
                </LoadingWrapStyled>
              ) : error ? (
                <ErrorMessage error={error} />
              ) : (
                portfolios.map((portfolio) => (
                  <RowGridStyled key={portfolio.node.portfolioId}>
                    <GridNameLink to={buildPortfolioPathWithDates(portfolio.node)}>
                      <Typography>{portfolio.node.title}</Typography>
                    </GridNameLink>
                    <Typography>
                      {`${portfolio.node.startDate ? format(portfolio.node.startDate, 'DD MMM YYYY') : ''} - 
                  ${portfolio.node.endDate ? format(portfolio.node.endDate, 'DD MMM YYYY') : ''}`}
                    </Typography>
                    <FormattedCurrency amount={portfolio.node.moneyAllocatedTotal || 0} />
                  </RowGridStyled>
                ))
              )}
            </GridWrapStyled>
          </ErrorBoundary>
        </div>
      )}
    </>
  );
};

export default withPortfolioProvider(withPortfolioFilterProvider(DashboardPortfolios));
