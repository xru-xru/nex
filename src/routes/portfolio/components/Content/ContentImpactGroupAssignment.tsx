import React, { Dispatch, SetStateAction } from 'react';
import { toNumber } from 'lodash';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components-ui/Select';
import { NexoyaImpactGroup } from '../../../../types';

interface Props {
  impactGroups: NexoyaImpactGroup[];
  selectedContentIds: number[] | null;
  selectedImpactGroupId: number | null;
  setSelectedImpactGroupId: Dispatch<SetStateAction<number | null>>;
}

export const ContentImpactGroupAssignment = ({
  impactGroups,
  selectedImpactGroupId,
  setSelectedImpactGroupId,
  selectedContentIds,
}: Props) => {
  return (
    <div className="ml-6 flex gap-10">
      <div className="flex flex-col gap-6">
        <div>
          <div className="mt-6 text-lg text-neutral-700">
            Select impact group for <span className="font-semibold">{selectedContentIds?.length} contents</span>
          </div>
          <div className="mt-2 text-sm font-light text-neutral-500">
            Quickly assign an impact group to all the contents found by the previously set filters.
          </div>
        </div>
        <div>
          <Select
            value={selectedImpactGroupId?.toString()}
            onValueChange={(impactGroupId) => setSelectedImpactGroupId(toNumber(impactGroupId))}
          >
            <SelectTrigger className="w-52 border-neutral-100 bg-white p-2 shadow-sm">
              <SelectValue placeholder="Select impact group" />
            </SelectTrigger>
            <SelectContent>
              {impactGroups?.map((impactGroup) => (
                <SelectItem key={impactGroup.impactGroupId} value={impactGroup.impactGroupId?.toString()}>
                  <span>{impactGroup.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
