import React from 'react';

import { PageHeader, PageHeaderTitle } from '../PageHeader';
import Typography from '../Typography';

export const PortfolioHeaderTitle = ({ title }: { title: string }) => {
  return (
    <PageHeader>
      <div>
        <PageHeaderTitle>
          <Typography variant="h1" component="h2">
            {title}
          </Typography>
        </PageHeaderTitle>
      </div>
    </PageHeader>
  );
};
