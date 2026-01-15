import Spinner from 'components/Spinner';
import SvgEllipsisV from 'components/icons/EllipsisV';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components-ui/DropdownMenu';
import { Button } from '../../../components-ui/Button';
import React from 'react';

interface Props {
  loading?: boolean;
  portfolioEventId: number;
  handleEdit?: (portfolioEventId: number) => void;
  handleAssignContents?: (portfolioEventId: number) => void;
  handleDelete?: (portfolioEventId: number) => void;
}

export function PortfolioEventTDM({
  loading,
  portfolioEventId,
  handleEdit,
  handleAssignContents,
  handleDelete,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading} asChild>
        <Button className="rounded-full" variant="ghost" size="sm">
          {loading ? (
            <div style={{ width: '36px' }}>
              <Spinner size="20px" />
            </div>
          ) : (
            <SvgEllipsisV
              style={{
                fontSize: 18,
              }}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 font-normal" align="center" side="left">
        <DropdownMenuItem onSelect={() => handleEdit(portfolioEventId)}>Edit event details</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleAssignContents(portfolioEventId)}>Assign contents</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleDelete(portfolioEventId)} className="text-red-400">
          Delete event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
