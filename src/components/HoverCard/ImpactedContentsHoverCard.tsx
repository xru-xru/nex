import { NexoyaContentRule, NexoyaContentV2 } from '../../types';
import { HoverableTooltip, HoverCard, HoverCardContent, HoverCardTrigger } from '../../components-ui/HoverCard';
import React from 'react';
import AvatarProvider from '../AvatarProvider';
import { calculateImpactedContentsForEvent } from '../../routes/portfolio/utils/portfolio-events';
import { buildContentPath } from '../../routes/paths';
import dayjs from 'dayjs';
import { StyledLink } from '../../routes/portfolio/styles/ContentTableRow';

interface Props {
  contents?: NexoyaContentV2[];
  contentRules?: NexoyaContentRule[];
  tooltip: React.JSX.Element;
}
const ImpactedContentsHoverCard = ({ contents, contentRules, tooltip }: Props) => (
  <HoverCard>
    <HoverCardTrigger>
      <HoverableTooltip className="w-fit">{tooltip}</HoverableTooltip>
    </HoverCardTrigger>
    <HoverCardContent side="bottom" align="end" className="flex w-full min-w-96 flex-col items-start justify-start">
      <div className="text-mdlg font-medium text-neutral-800">
        {calculateImpactedContentsForEvent({ assignedContents: contents, contentRules })} Impacted contents
      </div>
      {contentRules?.length ? (
        <>
          <div className="flex flex-col">
            <div className="mb-2 text-xs font-medium text-neutral-400">{contentRules?.length} content rules</div>
            <div className="flex flex-wrap gap-2">
              {contentRules?.map((contentRule) => (
                <div
                  key={contentRule?.contentRuleId}
                  className="rounded-md border border-neutral-100 px-3 py-1.5 font-normal text-neutral-500"
                >
                  <span className="font-medium">{contentRule.name}:</span>{' '}
                  <span>
                    {contentRule.matchingDiscoveredContentsCount}{' '}
                    {contentRule.matchingDiscoveredContentsCount === 1 ? 'content' : 'contents'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4 h-[1px] w-full text-neutral-50" />
        </>
      ) : null}
      {contents.length ? (
        <div>
          <div className="mb-2 text-xs font-medium text-neutral-400">
            {contents?.length} individually added contents
          </div>
          <div className="flex flex-col flex-wrap gap-2">
            {contents.map((content) => (
              <div
                key={content?.contentId}
                className="flex w-fit items-center justify-start gap-2 rounded-md border border-neutral-100 px-3 py-1"
              >
                <AvatarProvider providerId={content?.provider?.provider_id} size={32} className="!h-[24px]" />

                <StyledLink
                  to={buildContentPath(
                    content.contentId,
                    {
                      dateFrom: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
                      dateTo: dayjs().format('YYYY-MM-DD'),
                    },
                    true,
                  )}
                >
                  <span className="text-md font-normal text-neutral-500">{content?.title}</span>
                </StyledLink>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </HoverCardContent>
  </HoverCard>
);

export default ImpactedContentsHoverCard;
