import { NexoyaContentV2 } from '../../types';
import { HoverableTooltip, HoverCard, HoverCardContent, HoverCardTrigger } from '../../components-ui/HoverCard';
import React from 'react';
import useTranslationStore from '../../store/translations';
import AvatarProvider from '../AvatarProvider';
import translate from '../../utils/translate';
import { cn } from '../../lib/utils';
import { buildContentPath } from '../../routes/paths';
import dayjs from 'dayjs';
import { StyledLink } from '../../routes/portfolio/styles/ContentTableRow';

interface Props {
  content: NexoyaContentV2;
  tooltip: React.JSX.Element;
  tooltipClassName?: string;
}
const ContentHoverCard = ({ content, tooltip, tooltipClassName }: Props) => {
  const { translations } = useTranslationStore();

  return content ? (
    <HoverCard>
      <HoverCardTrigger>
        <HoverableTooltip className={cn('w-fit', tooltipClassName)}>{tooltip}</HoverableTooltip>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="start" className="flex w-full min-w-80 flex-col items-start justify-start">
        <>
          <div className="flex gap-2">
            <AvatarProvider providerId={content?.provider?.provider_id} size={20} />
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
              <span className="text-mdlg text-neutral-900">{content?.title}</span>
            </StyledLink>
          </div>
          <div className="mb-2 text-xs text-neutral-400">
            Channel: {translate(translations, content?.provider?.name)}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-start rounded-md border border-neutral-100 px-3 py-1.5">
              <div className="text-xs text-neutral-500">
                <span className="font-medium capitalize">Content type: </span>
                <span className="font-light">{content?.contentType?.name}</span>
              </div>
            </div>
            <div className="flex flex-col items-start rounded-md border border-neutral-100 px-3 py-1.5">
              <div className="text-xs text-neutral-500">
                <span className="font-medium capitalize">Parent: </span>
                <span className="font-light">{content?.parent?.title}</span>
              </div>
            </div>
          </div>
        </>
      </HoverCardContent>
    </HoverCard>
  ) : (
    <span className="w-fit">{tooltip}</span>
  );
};
export default ContentHoverCard;
