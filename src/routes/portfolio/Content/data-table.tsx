import { NexoyaContentV2 } from '../../../types';
import ButtonIcon from '../../../components/ButtonIcon';
import { buildContentPath } from '../../paths';
import SvgCopyToClipboard from '../../../components/icons/CopyToClipboard';
import { toast } from 'sonner';
import { TagStyled } from '../styles/OptimizationProposal';
import FormattedCurrency from '../../../components/FormattedCurrency';
import { startCase } from 'lodash';
import Typography from '../../../components/Typography';
import dayjs from 'dayjs';
import { READABLE_FORMAT } from '../../../utils/dates';
import * as Styles from '../styles/ContentTableRow';
import Checkbox from '../../../components/Checkbox';

export const getData = ({
  content,
  portfolio,
  isContentIncluded,
  includeContentId,
  excludeContentId,
}: {
  content: NexoyaContentV2[];
  portfolio: any;
  isContentIncluded: (contentId: number) => boolean;
  includeContentId: (contentId: number) => void;
  excludeContentId: (contentId: number) => void;
}) => {
  return content?.map((contentV2: NexoyaContentV2) => {
    const row = {
      highlight: isContentIncluded(contentV2.contentId),
      select: (
        <div className="flex h-full w-full items-center justify-center">
          <Checkbox
            checked={isContentIncluded(contentV2.contentId)}
            onClick={() => {
              if (isContentIncluded(contentV2?.contentId)) {
                excludeContentId(contentV2?.contentId);
              } else {
                includeContentId(contentV2?.contentId);
              }
            }}
          />
        </div>
      ),
      content: (
        <Styles.StyledLink
          key={contentV2?.title}
          to={buildContentPath(
            contentV2?.contentId,
            {
              dateFrom: portfolio?.startDate?.substring(0, 10),
              dateTo: portfolio?.endDate?.substring(0, 10),
            },
            true,
          )}
        >
          <Styles.AvatarWrapStyled
            providerId={contentV2?.provider?.provider_id}
            size={24}
            condensed={true}
            style={{ marginRight: 12 }}
          />
          <Typography style={{ color: '#000' }} component="p" display="inline-block">
            {contentV2.title}
          </Typography>
          <ButtonIcon
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(contentV2?.title).then(() => toast.message('Content copied to clipboard'));
            }}
            className="copyContentButton"
            title="Copy content name"
          >
            <SvgCopyToClipboard />
          </ButtonIcon>
        </Styles.StyledLink>
      ),
      contentLevel: (
        <div key={contentV2?.contentType?.name} className="flex h-full w-full items-center justify-center">
          <TagStyled bgColor="#eaeaea">{contentV2?.contentType?.name}</TagStyled>
        </div>
      ),
      budget: (
        <Styles.WrapStyled className="flex flex-col items-center">
          {contentV2?.budget ? (
            <>
              <FormattedCurrency amount={contentV2?.budget?.value} />
              <Styles.BudgetLabel>{startCase(contentV2?.budget?.type?.toLowerCase())}</Styles.BudgetLabel>
            </>
          ) : null}
        </Styles.WrapStyled>
      ),
      biddingStrategy: contentV2?.biddingStrategy ? (
        <div key={contentV2?.biddingStrategy?.type} className="flex h-full w-full items-center justify-center">
          <TagStyled bgColor="#eaeaea">{contentV2?.biddingStrategy?.type}</TagStyled>
        </div>
      ) : null,
      latestMeasurementDataDate: (
        <Styles.RowCell className="text-left">
          <Typography>
            {contentV2?.latestMeasurementDataDate
              ? dayjs(contentV2?.latestMeasurementDataDate).format(READABLE_FORMAT)
              : ''}
          </Typography>
        </Styles.RowCell>
      ),
      duration:
        contentV2.startDatetime && contentV2.endDatetime ? (
          <Styles.RowCell className="text-left">
            <Typography withTooltip>
              {dayjs(contentV2.startDatetime).format(READABLE_FORMAT)} -{' '}
              {dayjs(contentV2.endDatetime).format(READABLE_FORMAT)}
            </Typography>
          </Styles.RowCell>
        ) : null,
      parent: (
        <Styles.RowCell className="text-left">
          {contentV2?.parent?.title ? (
            <Typography style={{ color: '#000' }} component="p" display="inline-block">
              {contentV2?.parent?.title}
            </Typography>
          ) : null}
        </Styles.RowCell>
      ),
    };

    return row;
  });
};
