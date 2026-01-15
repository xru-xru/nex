import React from 'react';
import { buildContentPath } from '../../../../paths';
import ButtonIcon from '../../../../../components/ButtonIcon';
import { toast } from 'sonner';
import SvgCopyToClipboard from '../../../../../components/icons/CopyToClipboard';
import { TagStyled } from '../../../styles/OptimizationProposal';
import * as Styles from '../../../styles/ContentTableRow';
import Typography from '../../../../../components/Typography';
import Tooltip from '../../../../../components/Tooltip';
import { NexoyaContentV2 } from '../../../../../types';
import dayjs from 'dayjs';
import { READABLE_FORMAT } from '../../../../../utils/dates';
import FormattedCurrency from '../../../../../components/FormattedCurrency';
import { startCase } from 'lodash';
import Checkbox from '../../../../../components/Checkbox';

export const getData = ({
  content,
  isContentExcluded,
  handleCheckboxAction,
}: {
  content: NexoyaContentV2[];
  handleCheckboxAction: (contentId: number) => void;
  isContentExcluded: (contentId: number) => boolean;
}) => {
  return content?.map((contentV2: NexoyaContentV2) => {
    const row = {
      excludeContent: (
        <div className="flex h-full w-full items-center justify-center">
          <Tooltip
            variant="dark"
            size="small"
            placement="left"
            content={isContentExcluded(contentV2?.contentId) ? 'Include content' : 'Exclude content'}
            popperProps={{
              style: { zIndex: 3100 },
            }}
          >
            <Checkbox
              onClick={() => handleCheckboxAction(contentV2?.contentId)}
              checked={!isContentExcluded(contentV2?.contentId)}
            />
          </Tooltip>
        </div>
      ),
      content: (
        <Styles.StyledLink
          key={contentV2?.title}
          to={buildContentPath(
            contentV2?.contentId,
            {
              dateFrom: null,
              dateTo: null,
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
      // status: contentV2?.status ? (
      //   <div key={contentV2?.status} className="flex h-full w-full items-center justify-center">
      //     <TagStyled bgColor="#eaeaea">{contentV2?.status}</TagStyled>
      //   </div>
      // ) : null,
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
      isInPortfolio: (
        <Styles.RowCell className="text-left">
          <Typography style={{ color: '#000' }} component="p" display="inline-block">
            {contentV2?.portfolioContentId ? 'Yes' : 'No'}
          </Typography>
        </Styles.RowCell>
      ),

      // budget: (
      //   <Styles.WrapStyled className="flex flex-col items-center">
      //     {contentV2?.budget?.min || contentV2?.budget?.max ? (
      //       <>
      //         <FormattedCurrency amount={contentV2?.budget?.min || contentV2?.budget?.max} />
      //         <Styles.BudgetLabel>
      //           {contentV2?.budget?.min ? 'Minimum' : contentV2?.budget?.max ? 'Maximum' : ''}
      //         </Styles.BudgetLabel>
      //       </>
      //     ) : null}
      //   </Styles.WrapStyled>
      // ),
      // attributionWindow: (
      //   <div
      //     key={contentV2?.isIncludedInOptimization?.toString()}
      //     className="flex h-full w-full items-center justify-center"
      //   >
      //     <TagStyled
      //       style={{ maxWidth: 70 }}
      //       bgColor={contentV2?.isIncludedInOptimization ? '#88E7B7' : nexyColors.frenchGray}
      //     >
      //       {contentV2?.isIncludedInOptimization ? 'Enabled' : 'Disabled'}
      //     </TagStyled>
      //   </div>
      // ),

      // materiality: (
      //   <Styles.RowCell className="text-left">
      //     <Typography>{get(contentV2, 'metadata.materiality', '')}</Typography>
      //   </Styles.RowCell>
      // ),
      // avgSpend: (
      //   <Styles.RowCell className="text-left">
      //     <Typography>{get(contentV2, 'metadata.avgSpend', '')}</Typography>
      //   </Styles.RowCell>
      // ),
    };

    return row;
  });
};
