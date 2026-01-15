import React from 'react';
import Spinner from 'components/Spinner';
import SvgEllipsisV from 'components/icons/EllipsisV';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'components-ui/DropdownMenu';
import { Button } from 'components-ui/Button';

import { ExtendedLabel } from './LabelsEditTable';

interface Props {
  loading: boolean;
  label: ExtendedLabel;
  handleDelete: (labelId: number) => void;
  handleEdit: (label: ExtendedLabel) => void;
}

export function LabelsTableTDM({ label, loading, handleDelete, handleEdit }: Props) {
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
      <DropdownMenuContent className="w-52 font-normal" align="start">
        <DropdownMenuItem onSelect={() => handleEdit(label)}>Edit name</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleDelete(label.labelId)} className="text-red-400">
          Delete label
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
