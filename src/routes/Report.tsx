import React, { lazy, Suspense } from 'react';
import { Match, RouterHistory } from 'react-router-dom';

import { get } from 'lodash';
import styled from 'styled-components';

import { CollectionProvider } from '../context/CollectionsProvider';
import { useReportSummaryQuery } from '../graphql/report/queryReportSummary';

import ErrorBoundary from '../components/ErrorBoundary';
import ErrorMessage from '../components/ErrorMessage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import MainContent from '../components/MainContent';
import BackButton from '../components/Sidebar/components/BackButton';
import ScrollToTop from 'components/ScrollToTop';

const ReportKpi = lazy(() => import('./report/ReportKpi'));
const ReportChannel = lazy(() => import('./report/ReportChannel'));
type Props = {
  history?: RouterHistory;
  match: Match;
};
const WrapLoadingStyled = styled.div`
  & > div:first-child {
    margin-bottom: 25px;

    div {
      height: 50px;
      width: 75%;
    }
  }

  & > div:last-child {
    & > div:nth-child(1) {
      height: 50px;
      width: 25%;
      opacity: 0.75;
      margin-bottom: 25px;
    }

    & > div:nth-child(2) {
      opacity: 0.35;
      height: 400px;
      margin-bottom: 25px;
    }

    & > div:nth-child(3) {
      opacity: 0.2;
      height: 50px;
    }
  }
`;

function Report({ match }: Props) {
  const reportId = parseInt(match.params.reportID, 10);
  const { data, loading, refetch, refetching, error } = useReportSummaryQuery({
    reportId,
  });
  const report = get(data, 'reportSummary.data', {});
  return (
    <ScrollToTop>
      <MainContent>
        <ErrorBoundary>
          {loading ? (
            <WrapLoadingStyled>
              <div>
                <LoadingPlaceholder />
              </div>
              <div>
                <LoadingPlaceholder />
                <LoadingPlaceholder />
                <LoadingPlaceholder />
              </div>
            </WrapLoadingStyled>
          ) : error ? (
            <ErrorMessage error={error} />
          ) : report.report_type === 'KPI' ? (
            <Suspense fallback={null}>
              <BackButton />
              <ReportKpi report={report} refetch={refetch} refetching={refetching} />
            </Suspense>
          ) : report.report_type === 'CHANNEL' ? (
            <Suspense fallback={null}>
              <CollectionProvider>
                <BackButton />
                <ReportChannel report={report} refetch={refetch} />
              </CollectionProvider>
            </Suspense>
          ) : (
            <>
              <BackButton />
              <div>Wrong report type...</div>
            </>
          )}
        </ErrorBoundary>
      </MainContent>
    </ScrollToTop>
  );
}

export default Report;
