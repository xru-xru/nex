import Spinner from 'components/Spinner';
import SvgEllipsisV from 'components/icons/EllipsisV';

import { ExtendedImpactGroup } from './ImpactGroupsEditTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components-ui/DropdownMenu';
import { Button } from '../../../../components-ui/Button';
import React from 'react';

interface Props {
  loading: boolean;
  impactGroupsLength: number;
  impactGroup: ExtendedImpactGroup;
  handleDelete: (impactGroupId: number) => void;
}

export function ImpactGroupsTableTDM({ impactGroup, impactGroupsLength, loading, handleDelete }: Props) {
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
        <DropdownMenuItem disabled={impactGroupsLength === 1} onSelect={() => handleDelete(impactGroup.impactGroupId)}>
          <span className="text-red-400">Delete impact group</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
