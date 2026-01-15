import React from 'react';
import { Match } from 'react-router-dom';

import dayjs from 'dayjs';
import { get } from 'lodash';
import { DateParam, useQueryParams } from 'use-query-params';

import { NexoyaContent, NexoyaCustomKpiConfigType, NexoyaMetric } from 'types';

import { useContentQuery } from 'graphql/content_old/queryContent';

import useFormatMetadata from 'hooks/useFormatMetadata';
import { distanceRange, format } from 'utils/dates';

import Divider from 'components/Divider';
import MainContent from 'components/MainContent';
import ScrollToTop from 'components/ScrollToTop';

import * as Styles from './content/styles/Content';

import ContentPageHeader from './content/ContentPageHeader';
import ContentPageMeta from './content/ContentPageMeta';
import ContentPageMetricsTable from './content/ContentPageMetricsTable';
import ContentPageTable from './content/ContentPageTable';

type Props = {
  match: Match;
};

function ContentPage({ match }: Props) {
  const contentId = parseInt(match.params.contentID, 10);
  const [condensed, setCondensed] = React.useState(true);
  const { dateFrom: dateFromDR, dateTo: dateToDR } = distanceRange({
    distance: 7,
    startOf: 'day',
    endOf: false,
  });
  const [queryParams, setQueryParams] = useQueryParams({
    dateFrom: DateParam,
    dateTo: DateParam,
  });
  function handleDateChange(event) {
    setQueryParams({
      dateFrom: event.from,
      dateTo: event.to,
    });
  }
  React.useEffect(
    () =>
      setQueryParams({
        dateFrom: queryParams.dateFrom || dateFromDR,
        dateTo: queryParams.dateTo || dateToDR,
      }),
    // eslint-disable-next-line
    [],
  );
  const { data: contentData, loading } = useContentQuery({
    content_id: contentId,
    dateFrom: format(dayjs(queryParams.dateFrom), 'utcStartMidnight'),
    dateTo: format(dayjs(queryParams.dateTo), 'utcEndMidnight'),
  });

  const content: NexoyaContent = get(contentData, 'content');
  const metrics: NexoyaMetric[] = get(content, 'metrics', []);
  const metadataContent = useFormatMetadata(content?.metadata || []);
  const hasAnySystemGeneratedCustomKpi = metrics.some(
    (metric) => metric?.customKpiConfig?.configType === NexoyaCustomKpiConfigType.Placeholder,
  );

  return (
    <ScrollToTop>
      <MainContent className="sectionToPrint">
        {loading ? (
          <>
            <Styles.LoadingWrapStyled>
              <Styles.HeaderStyled>
                <Styles.LoadingStyled>
                  <Styles.AvatarLoader />
                  <div>
                    <Styles.TitleLoader />
                    <Styles.SubtitleLoader />
                  </div>
                </Styles.LoadingStyled>
              </Styles.HeaderStyled>
              <Styles.MetricTableLoader />
            </Styles.LoadingWrapStyled>
            <Styles.TableLoader />
          </>
        ) : (
          <>
            <ContentPageHeader
              from={queryParams.dateFrom}
              to={queryParams.dateTo}
              providerId={content?.provider?.provider_id}
              title={content?.title}
              adminUrl={content?.admin_url}
              handleDateChange={handleDateChange}
              condensed={condensed}
              isSystemGeneratedCustomKpi={hasAnySystemGeneratedCustomKpi}
            />
            <ContentPageMeta
              data={metadataContent}
              title={content?.content_type?.name}
              contentTypeId={content?.content_type?.content_type_id}
              hasBricks={setCondensed}
            />
            <Divider />
            <Styles.TableTitle variant="h2">Metrics</Styles.TableTitle>
            <ContentPageMetricsTable
              items={metrics}
              contentId={contentId}
              from={dayjs(queryParams.dateFrom).format('YYYY-MM-DD')}
              to={dayjs(queryParams.dateTo).format('YYYY-MM-DD')}
            />
            <Styles.TableTitle variant="h2">Subcontent</Styles.TableTitle>
            <ContentPageTable contentId={contentId} />
          </>
        )}
      </MainContent>
    </ScrollToTop>
  );
}

export default ContentPage;
