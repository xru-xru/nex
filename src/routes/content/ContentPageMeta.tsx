import React from 'react';

import { BrickDataFormatted } from 'types/types.custom';

import { PageHeaderDescription } from 'components/PageHeader';
import TypographyTranslation from 'components/TypographyTranslation';

import { ContentPageMetaBricks } from './ContentPageMetaBricks';

type Props = {
  data: Map<string, BrickDataFormatted>;
  title: string;
  contentTypeId: number;
  hasBricks: (e: boolean) => void;
};

// Campaign, Ad set, Ad
const metaTypeIds = [7, 8, 9, 19, 20];

function ContentPageMeta({ data, title, contentTypeId, hasBricks }: Props) {
  const printMeta = metaTypeIds.includes(contentTypeId) && !!data.size;
  React.useEffect(() => hasBricks(!printMeta), [hasBricks, printMeta]);
  return printMeta ? (
    <ContentPageMetaBricks data={data} />
  ) : (
    <PageHeaderDescription addTitleIconSpace>
      <TypographyTranslation variant="h3" text={title} />
    </PageHeaderDescription>
  );
}

export default ContentPageMeta;
