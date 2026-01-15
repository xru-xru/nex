import { NexoyaPortfolioEdges, NexoyaPortfolioV2, NexoyaSortField, NexoyaSortOrder } from '../../types';
import React, { useState } from 'react';
import { PortfolioBricks } from './PortfolioBricks';
import { Button } from '../../components-ui/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePortfoliosQuery } from '../../graphql/portfolio/queryPortfolios';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../components-ui/Select';
import { buildPortfolioPathWithDates } from '../../utils/portfolio';
import { useHistory } from 'react-router';
import { diffCount, djsAnchors, isLaterDay } from '../../utils/dates';
import SvgCaretDown from '../icons/CaretDown';
import { useHeader } from '../../context/HeaderProvider';
import { cn } from '../../lib/utils';
import { Skeleton } from '../../components-ui/Skeleton';

export const PortfolioTitleWithExpandableBricks = ({ portfolio }: { portfolio: NexoyaPortfolioV2 }) => {
  const { isExpanded, setIsExpanded } = useHeader();
  const [portfolioNodes, setPortfolioNodes] = useState<NexoyaPortfolioEdges[]>([]);

  const history = useHistory();

  const { loading = true } = usePortfoliosQuery({
    sortBy: {
      field: NexoyaSortField.Title,
      order: NexoyaSortOrder.Asc,
    },
    onCompleted: (data) => {
      const portfolios: NexoyaPortfolioEdges[] =
        data?.portfolios?.edges?.filter(
          (portfolio: NexoyaPortfolioEdges) =>
            isLaterDay(portfolio.node.endDate, djsAnchors.today) ||
            diffCount(djsAnchors.today, portfolio.node.endDate, 'day') < 14,
        ) || [];
      setPortfolioNodes(portfolios || []);
    },
  });

  const targetFunnelStepTitle = portfolio?.defaultOptimizationTarget?.title || '';

  return (
    <div>
      <div className="my-auto flex cursor-default items-center gap-3 overflow-hidden overflow-ellipsis whitespace-nowrap rounded p-1 px-4 text-xl font-medium tracking-[-0.21px]">
        {loading ? (
          <Skeleton style={{ height: '39px', width: '200px' }} />
        ) : (
          <Select
            value={portfolio?.portfolioId?.toString()}
            onValueChange={(value) => {
              const portfolioNode = portfolioNodes?.find((edge) => edge.node.portfolioId?.toString() === value);
              const portfolioPath = buildPortfolioPathWithDates(portfolioNode?.node);
              history.replace(portfolioPath);
              history.push(portfolioPath);
            }}
          >
            <SelectTrigger
              showArrow={false}
              className="text-md ml-[-18px] w-fit justify-between rounded-[5px] border-none bg-white px-4 text-neutral-800 shadow-none transition-colors hover:bg-neutral-50"
            >
              <span>{portfolio?.title}</span>
              <SvgCaretDown style={{ width: 14, height: 14, marginLeft: 8 }} />
            </SelectTrigger>
            <SelectContent>
              {portfolioNodes.map((edge) => (
                <SelectItem key={edge?.node?.portfolioId} value={edge?.node?.portfolioId.toString()}>
                  <span>{edge?.node?.title}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div
        className={cn(
          'overflow-hidden transition-all',
          isExpanded ? 'mb-2 mt-4 max-h-[500px] px-4 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <PortfolioBricks portfolio={portfolio} funnelStepTitle={targetFunnelStepTitle} loading={loading} />
      </div>

      <Button
        style={{ filter: 'drop-shadow(0px 4px 8px rgba(138, 140, 158, 0.25))' }}
        className="absolute left-[880px] mt-[-1.65px] h-5 w-5 rounded-full opacity-0 transition-opacity hover:bg-neutral-50 hover:text-neutral-600 group-hover:opacity-100"
        onClick={() => setIsExpanded((prevState) => !prevState)}
        variant="outline"
        size="icon"
      >
        {isExpanded ? <ChevronUp className="h-[20px] w-[20px]" /> : <ChevronDown className="h-[20px] w-[20px]" />}
      </Button>
    </div>
  );
};
