import React from 'react';
import styled from 'styled-components';

import { NexoyaPortfolioFeatureFlag } from '../../types';

import PortfolioHeaderMenu from '../../routes/portfolio/PortfolioHeaderMenu';

import { PageHeaderActions } from '../PageHeader';
import { Info } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioProvider';
import { cn } from '../../lib/utils';
import useUserStore from '../../store/user';
import ShadowPortfolioBanner from '../../routes/portfolio/ShadowPortfolio/ShadowPortfolioBanner';
import { toast } from 'sonner';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .NEXYPageHeaderActions {
    margin-left: 0;
    margin-top: 0;
  }

  .NEXYPageHeader {
    margin-bottom: 0;
  }
`;

const PortfolioHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const PortfolioMenu = () => {
  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta, loading },
    },
  } = usePortfolio();

  const { isSupportUser } = useUserStore();

  const portfolioFeatureFlags = portfolioMeta?.featureFlags || [];
  const onlyVisibleToSupportUsers = portfolioFeatureFlags.some(
    (flag) => flag.name === NexoyaPortfolioFeatureFlag.OptimizationsOnlyVisibleToSupportUsers && flag.status,
  );

  const isShadowPortfolio = portfolioMeta?.title?.includes('(shadow copy)');

  return !loading ? (
    <PortfolioHeaderWrapper>
      <HeaderWrapper>
        <PageHeaderActions>
          {onlyVisibleToSupportUsers && isSupportUser && !isShadowPortfolio ? (
            <div
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-md border border-[#B9E7FE] bg-aliceBlue px-6 py-3',
                'max-h-[34px]',
              )}
            >
              <Info className="h-5 w-5 fill-[#05A8FA] text-white" />
              <span className="truncate text-sm text-neutral-700">Preview optimization for support only</span>
            </div>
          ) : null}

          {isSupportUser && isShadowPortfolio && (
            <ShadowPortfolioBanner
              portfolio={portfolioMeta}
              onMergeComplete={() => toast.success('Shadow portfolio merged ')}
            />
          )}

          <PortfolioHeaderMenu portfolio={portfolioMeta} />
        </PageHeaderActions>
      </HeaderWrapper>
    </PortfolioHeaderWrapper>
  ) : null;
};

export default PortfolioMenu;
