import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components-ui/Select';
import { Button } from '../../components-ui/Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import React from 'react';

export const PaginationControls = ({
  gotoPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  pageSize,
  setPageSize,
  nextPage,
  previousPage,
  showFirstPageButton = true,
  showLastPageButton = true,
}) => {
  return (
    <div className="flex w-fit items-center justify-end gap-7 py-3 font-light">
      {/* Page size selection */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">Rows per page</span>
        <Select value={pageSize} onValueChange={(value) => setPageSize(Number(value))}>
          <SelectTrigger className="h-8 w-fit space-x-2.5 border-neutral-100 bg-white px-2 py-2 shadow-sm">
            <SelectValue placeholder={`Show ${pageSize}`} />
            {pageSize}
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50, 100, 500].map((size) => (
              <SelectItem className="flex justify-between px-2 py-1.5" key={size} value={size.toString()}>
                <span>Show</span> <span>{size}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Page info */}
      <span className="text-sm">
        Page <strong>{pageIndex + 1}</strong> of {pageOptions.length}
      </span>
      <div className="flex gap-1.5">
        {/* First Page */}
        {showFirstPageButton && (
          <Button variant="outline" className="h-8 px-2 py-2" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <ChevronsLeft className="size-4 text-neutral-800" />
          </Button>
        )}

        {/* Previous Page */}
        <Button variant="outline" className="h-8 px-2 py-2" onClick={previousPage} disabled={!canPreviousPage}>
          <ChevronLeft className="size-4 text-neutral-800" />
        </Button>

        {/* Next Page */}
        <Button variant="outline" className="h-8 px-2 py-2" onClick={nextPage} disabled={!canNextPage}>
          <ChevronRight className="size-4 text-neutral-800" />
        </Button>

        {/* Last Page */}
        {showLastPageButton && (
          <Button
            variant="outline"
            className="h-8 px-2 py-2"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <ChevronsRight className="size-4 text-neutral-800" />
          </Button>
        )}
      </div>
    </div>
  );
};
