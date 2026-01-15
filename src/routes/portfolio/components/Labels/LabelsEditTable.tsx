import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import styled from 'styled-components';
import { Table } from '../../../../components/Table';
import TextField from '../../../../components/TextField';
import Typography from '../../../../components/Typography';
import SvgPlusRegular from '../../../../components/icons/PlusRegular';
import { LabelsTableTDM } from './LabelsTableTDM';
import { NexoyaPortfolioLabel } from '../../../../types';
import ButtonAsync from '../../../../components/ButtonAsync';
import { v4 as uuidv4 } from 'uuid';

const TableWrapper = styled.div`
  height: fit-content;
`;

export interface ExtendedLabel extends NexoyaPortfolioLabel {
  isEditing: boolean;
  toDelete?: boolean;
  flagged?: boolean;
}

interface Props {
  labels: Partial<ExtendedLabel>[];
  setLabels: React.Dispatch<React.SetStateAction<ExtendedLabel[]>>;
  handleEdit: (label: ExtendedLabel) => void;
  handleDelete: (labelId: number) => void;
  portfolioId: number;
  loadingUpdate: boolean;
  loadingDelete: boolean;
}

export const LabelsEditTable = ({
  labels,
  setLabels,
  handleEdit,
  handleDelete,
  loadingUpdate,
  loadingDelete,
}: Props) => {
  const [newLabel, setNewLabel] = useState('');

  const data = [
    ...labels.map((label: ExtendedLabel) => ({
      highlight: false,
      editRow: (
        <LabelsTableTDM
          loading={loadingDelete}
          label={label}
          handleEdit={(argLabel) => {
            setLabels((prevState: ExtendedLabel[]) => {
              return prevState.map((label) => {
                if (label.labelId === argLabel?.labelId) {
                  return { ...label, isEditing: true };
                }
                return label;
              });
            });
          }}
          handleDelete={handleDelete}
        />
      ),
      label: label.isEditing ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField
            fullWidth
            autoComplete="off"
            id={`label-edit-${label?.labelId}`}
            name={`label-edit-${label?.labelId}`}
            placeholder="Edit Label"
            value={labels.find((editableLabel) => editableLabel.labelId === label?.labelId)?.name}
            onChange={(ev) => {
              const value = ev?.target?.value;
              setLabels((prevState: ExtendedLabel[]) => {
                return prevState.map((igState) => {
                  if (igState.labelId === label?.labelId) {
                    return { ...igState, name: value };
                  }
                  return igState;
                });
              });
            }}
          />
          <ButtonAsync
            loading={loadingUpdate}
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => {
              if (label.name === '' || label.name.length < 1) {
                toast.error('Label name must be at least 1 characters long');
              }
              handleEdit(label);
            }}
          >
            Save
          </ButtonAsync>
        </div>
      ) : (
        <Typography style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'flex-start' }}>
          {label.name}
        </Typography>
      ),
    })),
    {
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 8 }}>
          <TextField
            fullWidth
            autoComplete="off"
            id="new-impact-group"
            name="new-impact-group"
            placeholder="New Label"
            value={newLabel}
            onChange={(ev) => setNewLabel(ev?.target?.value)}
          />
          <ButtonAsync
            loading={loadingUpdate}
            color="secondary"
            variant="contained"
            disabled={newLabel === ''}
            onClick={() => {
              if (newLabel === '' || newLabel.length < 1) {
                toast.error('Label name must be at least 1 characters long');
                return;
              }

              setNewLabel('');

              handleEdit({
                name: newLabel,
                labelId: uuidv4() as never,
                isEditing: false,
              });
            }}
          >
            <SvgPlusRegular />
          </ButtonAsync>
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
        Header: 'Labels',
        accessor: 'label',
        enableColumnResize: true,
        disableSortBy: true,
        width: 400,
      },
    ],
    [],
  );

  return (
    <TableWrapper>
      <Table data={data} columns={columns} tableId="label-crud-table" disableManager={true} />
    </TableWrapper>
  );
};
