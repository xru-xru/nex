import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../../components-ui/DropdownMenu';
import { useContentFilterStore } from '../../../../../store/content-filter';
import { NexoyaPortfolioParentContentsSortField, NexoyaSortOrder } from '../../../../../types';
import { X } from 'lucide-react';
import { Button } from '../../../../../components-ui/Button';
import SvgSort from '../../../../../components/icons/Sort2';
import React from 'react';
import { nexyColors } from '../../../../../theme';

export const HeaderSortCell = ({
  children,
  sortFieldKey,
}: {
  children: React.ReactNode;
  sortFieldKey: NexoyaPortfolioParentContentsSortField;
}) => {
  const { sortField, sortOrder, handleChangeSortOrder, handleChangeSortField } = useContentFilterStore();

  const handleSortChange = (order: NexoyaSortOrder) => {
    handleChangeSortField(sortFieldKey);
    handleChangeSortOrder(order);
  };

  const handleResetSort = () => {
    if (sortField === sortFieldKey && sortOrder) {
      handleChangeSortField(undefined);
      handleChangeSortOrder(undefined);
    }
  };

  const renderSortIcon = () => {
    if (sortField === sortFieldKey) {
      return sortOrder === NexoyaSortOrder?.Asc ? (
        <SvgSort style={{ marginLeft: 4, width: 12, height: 10.5, color: nexyColors.lilac }} />
      ) : sortOrder === NexoyaSortOrder?.Desc ? (
        <SvgSort
          style={{ marginLeft: 4, width: 12, height: 10.5, color: nexyColors.lilac, transform: 'rotate(-180deg)' }}
        />
      ) : null;
    }

    return <SvgSort style={{ marginLeft: 4, width: 12, height: 10.5 }} />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center justify-between px-2 py-1 text-xs font-semibold uppercase tracking-[0.44px] text-neutral-400"
        >
          {children}
          {renderSortIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full font-normal" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleSortChange(NexoyaSortOrder?.Asc)}>
            <SvgSort className="mr-2 size-3.5" />
            <span>Asc</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange(NexoyaSortOrder?.Desc)}>
            <SvgSort className="mr-2 size-3.5 rotate-180" />
            <span>Desc</span>
          </DropdownMenuItem>
          {sortField === sortFieldKey && sortOrder && (
            <DropdownMenuItem onClick={() => handleResetSort()}>
              <X className="mr-2 size-4" />
              <span>Reset</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
