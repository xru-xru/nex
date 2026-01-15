import React, { useEffect, useMemo, useState } from 'react';

import { get } from 'lodash';
import { NumberParam, useQueryParams } from 'use-query-params';
import { NexoyaCollection, NexoyaPortfolio, NexoyaPortfolioContentDetail, PortfolioCollectionContent } from 'types';

import { usePortfolio } from '../../../../context/PortfolioProvider';
import { useRemovePortfolioContentMutation } from 'graphql/portfolio/mutationRemovePortfolioContent';
import { useAddPortfolioContentMutation } from 'graphql/portfolio/mutationaddPortfolioContent';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';

import Button from '../../../../components/Button';
import ButtonAsync from '../../../../components/ButtonAsync';
import ContentSelection from '../../../../components/ContentSelection/ContentSelection';
import DialogTitle from '../../../../components/DialogTitle';
import ErrorMessage from '../../../../components/ErrorMessage';
import SidePanel, { SidePanelActions, useSidePanelState } from '../../../../components/SidePanel';
import Text from '../../../../components/Text';
import { usePortfolioQuery } from 'graphql/portfolio/queryPortfolio';
import { useRouteMatch } from 'react-router';

type Props = {
  dateFrom: Date;
  dateTo: Date | string;
};

function ContentEdit({ dateFrom, dateTo }: Props) {
  const [mappedContentIds, setMappedContentIds] = useState<PortfolioCollectionContent[]>([]);

  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const [removeContentIds, setRemoveContentIds] = React.useState<number[]>([]);
  const [addContentIds, setAddContentIds] = React.useState<number[]>([]);
  const {
    meta,
    contentSelection: { selected, reset },
  } = usePortfolio();

  const { data: legacyPortfolioData, refetch: refetchPortfolio } = usePortfolioQuery({
    portfolioId,
    dateFrom,
    dateTo,
    withBudget: true,
  });

  const portfolio: NexoyaPortfolio = legacyPortfolioData?.portfolio;
  const content: NexoyaPortfolioContentDetail[] | NexoyaCollection[] = useMemo(
    () => portfolio?.content?.contentDetails || [],
    [portfolio],
  );

  const goalKey = portfolio?.defaultOptimizationTarget?.optimizationTargetType || '';
  const { isOpen, toggleSidePanel } = useSidePanelState();

  const { contentSelection } = usePortfolio();

  const [
    removePortfolioContent,
    // @ts-expect-error
    { loading: removeContentLoading, error: removeContentError },
  ] = useRemovePortfolioContentMutation({
    portfolioId: portfolio?.portfolioId,
    portfolioContentIds: removeContentIds,
  });
  const [, setQueryParams] = useQueryParams({
    searchPg: NumberParam,
    offset: NumberParam,
  });
  const [
    addPortfolioContent,
    // @ts-expect-error
    { loading: addContentLoading, error: addContentError },
  ] = useAddPortfolioContentMutation({
    portfolioId: portfolio?.portfolioId,
    collectionIds: addContentIds,
  });

  // repact collection info so it matches the schema returned from
  // collections query
  useEffect(() => {
    contentSelection.reset();
    const preselectedContent = [];
    content.forEach((item) => {
      preselectedContent.push({
        collection_id: item.contentId,
        title: get(item, 'content.title'),
        provider: get(item, 'content.provider'),
        collectionType: item.content?.collectionType,
        portfolioContentId: item.portfolioContentId,
        parent: true,
        childContent: item.childContent
          ? item.childContent.map((childItem) => ({
              collection_id: childItem.contentId,
              title: get(childItem, 'content.title'),
              portfolioContentId: item.portfolioContentId,
              parent: false,
            }))
          : null,
      });
      setMappedContentIds((s) => [
        ...s,
        {
          collection_id: item.contentId,
          portfolio_content_id: item.portfolioContentId,
        },
      ]);
    });
    contentSelection.add(preselectedContent);
    contentSelection.setInitial(preselectedContent);
  }, [portfolio?.content, contentSelection.reset]);

  useEffect(
    () => {
      // flat two arrays to compare them with content/collection ids
      const existingContentIds = portfolio?.content.contentDetails.reduce(
        (acc, { contentId }) => [...acc, contentId],
        [],
      );
      const selectedContentIds = selected.reduce((acc, { collection_id }) => [...acc, collection_id], []);
      // turn them to sets for easier traversing
      const contentDetails: Set<number> = new Set(existingContentIds);
      const selectedContent: Set<number> = new Set(selectedContentIds);
      // remove ones in contentDetails, but not in selected array
      const toRemove = [...contentDetails].filter((content) => !selectedContent.has(content));
      const cleanToRemove = toRemove.reduce((acc, curr) => {
        const target = mappedContentIds.find((entry: PortfolioCollectionContent) => entry.collection_id === curr);
        return [...acc, target?.portfolio_content_id];
      }, []);
      // add ones in selected, but not in contentDetails
      const toAdd = [...selectedContent].filter((content) => !contentDetails?.has(content));
      setAddContentIds(toAdd);
      setRemoveContentIds(cleanToRemove);
    },
    // eslint-disable-next-line
    [selected],
  );

  async function addContent() {
    if (addContentIds.length) {
      try {
        // @ts-expect-error
        const res = await addPortfolioContent();
        if (get(res, 'data.addPortfolioContent', false)) {
          setAddContentIds([]);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
  }
  async function remove() {
    if (removeContentIds.length) {
      try {
        // @ts-expect-error
        const res = await removePortfolioContent();
        if (get(res, 'data.removePortfolioContent', false)) {
          setRemoveContentIds([]);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
  }
  async function handleSubmit() {
    try {
      await Promise.allSettled([remove(), addContent()]).finally(async () => {
        await refetchPortfolio({
          dateTo,
          dateFrom,
          withBudget: true,
          withOptimization: false,
        });
        track(EVENT.CONTENT_EDIT, {
          addContentIds,
          removeContentIds,
        });
        toggleSidePanel();
      });
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  }

  function closeSidepanel() {
    toggleSidePanel();
    reset();
    setQueryParams({
      searchPg: null,
      offset: null,
    });
  }
  React.useEffect(() => {
    meta.handleChange({
      target: {
        name: 'goal',
        value: goalKey,
      },
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalKey]);
  return (
    <>
      <Button
        variant="contained"
        color="tertiary"
        id="editContent"
        onClick={() => {
          toggleSidePanel();
          track(EVENT.CONTENT_EDIT_DIALOG);
        }}
      >
        Manage manual contents (legacy)
      </Button>
      <SidePanel
        isOpen={isOpen}
        onClose={closeSidepanel}
        paperProps={{
          style: {
            width: '70%',
            paddingBottom: '78px',
          },
        }}
      >
        <DialogTitle>
          <Text component="h3">Select content to add</Text>
        </DialogTitle>
        <ContentSelection />
        <SidePanelActions>
          <ButtonAsync
            id="updateContentBtn"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{
              marginLeft: 'auto',
            }}
            disabled={addContentLoading || removeContentLoading}
            loading={addContentLoading || removeContentLoading}
          >
            Update content
          </ButtonAsync>
        </SidePanelActions>
        {addContentError ? <ErrorMessage error={addContentError} /> : null}
        {removeContentError ? <ErrorMessage error={removeContentError} /> : null}
      </SidePanel>
    </>
  );
}

export default ContentEdit;
