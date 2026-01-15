import React, { useEffect, useMemo, useState } from 'react';

import { useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';
import styled from 'styled-components';

import { NexoyaFunnelStepV2, NexoyaImpactGroup } from '../../../../types';

import { usePortfolio } from '../../../../context/PortfolioProvider';
import { useTeam } from '../../../../context/TeamProvider';

import Button from '../../../../components/Button';
import Checkbox from '../../../../components/Checkbox';
import { Table } from '../../../../components/Table';
import TextField from '../../../../components/TextField';
import Tooltip from '../../../../components/Tooltip';
import Typography from '../../../../components/Typography';
import SvgPlusRegular from '../../../../components/icons/PlusRegular';
import SvgWarning from '../../../../components/icons/Warning';

import { nexyColors } from '../../../../theme';
import { ImpactGroupsTableTDM } from './ImpactGroupsTableTDM';
import { FUNNEL_STEPS_V2_QUERY } from '../../../../graphql/funnelSteps/queryFunnelSteps';
import { Button as ShadcnButton } from '../../../../components-ui/Button';
import { Check, Pencil } from 'lucide-react';

const TableWrapper = styled.div`
  height: fit-content;
`;

export interface ExtendedImpactGroup extends NexoyaImpactGroup {
  isEditing?: boolean;
}

interface Props {
  impactGroups: Partial<ExtendedImpactGroup>[];
  setImpactGroups: React.Dispatch<React.SetStateAction<ExtendedImpactGroup[]>>;
  handleEdit: (impactGroup: ExtendedImpactGroup) => void;
  handleEditImpactGroupFunnelSteps: (impactGroup: ExtendedImpactGroup, funnelStepId: number) => void;
  handleDelete: (impactGroupId: number) => void;
  portfolioId: number;
}

export const ImpactGroupsEditTable = ({
  impactGroups,
  setImpactGroups,
  handleEdit,
  handleEditImpactGroupFunnelSteps,
  handleDelete,
  portfolioId,
}: Props) => {
  const { teamId } = useTeam();
  const [newImpactGroup, setNewImpactGroup] = useState('');
  const [lastNewId, setLastNewId] = useState(-1); // State to keep track of the last assigned id
  const [funnelSteps, setFunnelSteps] = useState<NexoyaFunnelStepV2[]>([]);

  const {
    portfolioV2Info: {
      funnelSteps: { data: portfolioFunnelStepsData },
    },
  } = usePortfolio();

  const [loadSimpleFunnelSteps, { loading }] = useLazyQuery(FUNNEL_STEPS_V2_QUERY, {
    variables: {
      teamId,
      portfolioId,
    },
  });

  useEffect(() => {
    if (portfolioFunnelStepsData) {
      setFunnelSteps(portfolioFunnelStepsData?.map((fsp) => fsp.funnelStep));
    } else {
      loadSimpleFunnelSteps().then((res) => {
        setFunnelSteps(res?.data?.portfolioV2?.funnelSteps);
      });
    }
  }, [portfolioFunnelStepsData]);

  const getMappedFunnelSteps = (impactGroup: ExtendedImpactGroup) =>
    funnelSteps?.reduce((acc, item) => {
      acc[item.funnelStepId] = (
        <Checkbox
          key={impactGroup.impactGroupId + item.funnelStepId}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
          }}
          checked={!!impactGroup?.funnelSteps?.find((fs) => fs.funnel_step_id === item.funnelStepId)}
          onChange={() => handleEditImpactGroupFunnelSteps(impactGroup, item.funnelStepId)}
        />
      );
      return acc;
    }, {});

  const data = [
    ...impactGroups.map((impactGroup: ExtendedImpactGroup) => ({
      highlight: false,
      editRow: (
        <ImpactGroupsTableTDM
          loading={loading}
          impactGroupsLength={impactGroups.length}
          impactGroup={impactGroup}
          handleDelete={handleDelete}
        />
      ),
      impactGroup: impactGroup.isEditing ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <StyledTextField
            fullWidth
            autoComplete="off"
            id={`impact-group-edit-${impactGroup?.impactGroupId}`}
            name={`impact-group-edit-${impactGroup?.impactGroupId}`}
            placeholder="Edit Impact Group"
            value={
              impactGroups.find(
                (editableImpactGroup) => editableImpactGroup.impactGroupId === impactGroup?.impactGroupId,
              )?.name
            }
            onChange={(ev) => {
              const value = ev?.target?.value;
              setImpactGroups((prevState: ExtendedImpactGroup[]) => {
                return prevState.map((igState) => {
                  if (igState.impactGroupId === impactGroup?.impactGroupId) {
                    return { ...igState, name: value };
                  }
                  return igState;
                });
              });
            }}
          />
          <div className="flex gap-1">
            <Tooltip content="Save changes" variant="dark" size="small">
              <ShadcnButton
                className="rounded-full"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (impactGroup.name === '' || impactGroup.name.length < 3) {
                    toast.error('Impact group name must be at least 3 characters long');
                  }
                  handleEdit(impactGroup);
                }}
              >
                <Check className="h-4 w-4" />
              </ShadcnButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Typography style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'flex-start' }}>
            {impactGroup.name}
            {impactGroup.impactGroupId < 0 ? (
              <Tooltip
                variant="dark"
                placement="right"
                content="The impact group will be saved only once you assign a funnel step to it"
                popperProps={{
                  style: {
                    zIndex: 3300,
                  },
                }}
              >
                <div>
                  <SvgWarning style={{ marginLeft: 12, color: nexyColors.pumpkinOrange }} />
                </div>
              </Tooltip>
            ) : null}
          </Typography>
          <ShadcnButton className="rounded-full" variant="ghost" size="sm" onClick={() => handleEdit(impactGroup)}>
            <Pencil className="h-4 w-4" />
          </ShadcnButton>
        </div>
      ),
      ...getMappedFunnelSteps(impactGroup),
    })),
    {
      impactGroup: (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 8 }}>
          <TextField
            fullWidth
            autoComplete="off"
            id="new-impact-group"
            name="new-impact-group"
            placeholder="New Impact Group"
            value={newImpactGroup}
            onChange={(ev) => setNewImpactGroup(ev?.target?.value)}
          />
          <Button
            color="secondary"
            variant="contained"
            disabled={newImpactGroup === ''}
            onClick={() => {
              if (newImpactGroup === '' || newImpactGroup.length < 3) {
                toast.error('Impact group name must be at least 3 characters long');
                return;
              }

              setNewImpactGroup('');
              setLastNewId((prevLastId) => prevLastId - 1); // Decrement the lastNewId
              // @ts-ignore
              setImpactGroups((prevState) => [
                ...prevState,
                {
                  portfolioId: null,
                  impactGroupId: lastNewId,
                  name: newImpactGroup,
                  isEditing: false,
                  funnelSteps: [],
                },
              ]);
            }}
          >
            <SvgPlusRegular />
          </Button>
        </div>
      ),
    },
  ];

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'editRow',
        width: '40',
        isHiddenInManager: true,
        disableSortBy: true,
      },
      {
        Header: 'Impact Groups',
        accessor: 'impactGroup',
        enableColumnResize: true,
        disableSortBy: true,
        width: 300,
      },
      ...(funnelSteps || [])
        .filter((fs) => fs.title !== 'COST')
        .map((funnelStep) => ({
          Header: funnelStep?.title,
          accessor: funnelStep?.funnelStepId?.toString(),
          enableColumnResize: true,
          disableSortBy: true,
        })),
    ],
    [funnelSteps],
  );

  return (
    <TableWrapper>
      <Table data={data} columns={columns} tableId="impact-group-crud-table" disableManager={true} />
    </TableWrapper>
  );
};

const StyledTextField = styled(TextField)`
  .NEXYFormControl {
    flex-direction: column;
  }
  .NEXYInputWrap {
    padding: 4px 16px;
  }
`;
