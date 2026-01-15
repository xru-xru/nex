import React from 'react';
import { ColumnInstance } from 'react-table';

import styled from 'styled-components';
import { NumericArrayParam, useQueryParam } from 'use-query-params';

import { NexoyaSimulationScenario } from '../../types';

import { MultipleSwitchStyled } from '../../routes/portfolio/components/Simulations/ScenarioMetricsPanel';
import Checkbox from 'components/Checkbox';
import CloseButton from 'components/CloseButton/CloseButton';
import Text from 'components/Text';

import { nexyColors } from '../../theme';
import Button from '../Button';
import ButtonIcon from '../ButtonIcon';
import Dialog, { useDialogState } from '../Dialog';
import Tooltip from '../Tooltip';
import SvgTableManager from '../icons/TableManager';
import { Row } from './Row';
import { ManageableColumn, SelectAll, goToUpperDepthLevel } from './TableManager';
import { IColumnProps } from './tableTypes';

export const SECTIONS = [
  {
    id: 'rows',
    text: 'Scenarios',
  },
  {
    id: 'metrics',
    text: 'Metrics',
  },
];

type Props = {
  columns: readonly ColumnInstance<IColumnProps>[];
  rows: NexoyaSimulationScenario[];
  getToggleHideAllColumnsProps: () => any;
  toggleHideAllColumns: () => void;
  setStickyColumns: React.Dispatch<React.SetStateAction<string[]>>;
  stickyColumns: string[];
  depth?: number;
};

export function TableManagerWithRows({
  columns,
  rows,
  getToggleHideAllColumnsProps,
  toggleHideAllColumns,
  setStickyColumns,
  stickyColumns,
  depth = 0,
}: Props) {
  const [comparisonIds, setComparisonIds] = useQueryParam('comparisonIds', NumericArrayParam);
  const [selectedSection, setSelectedSection] = React.useState<string>(SECTIONS[0].id);
  const { isOpen, toggleDialog, closeDialog } = useDialogState();

  const toggleSelectAllRows = () => {
    if (rows.length === comparisonIds?.length) {
      setComparisonIds([]);
    } else {
      setComparisonIds(rows.map((row) => row.scenarioId));
    }
  };

  const getRowsProps = () => {
    return {
      checked: rows.length === comparisonIds?.length,
      onChange: toggleSelectAllRows,
    };
  };

  return (
    <>
      <Tooltip
        popperProps={{
          style: {
            zIndex: 3301,
          },
        }}
        size="small"
        placement="right"
        variant="dark"
        content="Manage columns"
      >
        <ButtonIcon style={{ margin: '5px 0 5px 8px', padding: 5 }} onClick={toggleDialog}>
          <SvgTableManager style={{ color: nexyColors.coolGray, width: 24, height: 24 }} />
        </ButtonIcon>
      </Tooltip>
      <Dialog paperProps={{ style: { minWidth: 434 } }} isOpen={isOpen} onClose={closeDialog} hideCloseButton>
        <div style={{ padding: '20px', zIndex: '100' }}>
          <Row style={{ justifyContent: 'space-between', margin: '0 0 20px 0' }}>
            <Text
              style={{
                textTransform: 'initial',
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: 0.8,
                color: 'initial',
                marginBottom: '18',
              }}
            >
              Manage columns
            </Text>
            <StyledCloseButton onClose={closeDialog} />
          </Row>
          <MultipleSwitchStyled
            style={{ width: '100%', marginBottom: 12 }}
            sections={SECTIONS}
            initial={selectedSection}
            current={selectedSection}
            onToggle={(selectedOption) => setSelectedSection(selectedOption)}
          />
          <SelectAll
            getProps={selectedSection === 'rows' ? getRowsProps : getToggleHideAllColumnsProps}
            toggleOnClick={selectedSection === 'rows' ? toggleSelectAllRows : toggleHideAllColumns}
          />
          {selectedSection === 'rows'
            ? rows.map((row, idx) => {
                return <ManageableRow key={row.scenarioId} idx={idx + 1} row={row} />;
              })
            : columns
                .map((col) => goToUpperDepthLevel(col, 0))
                .filter((value, index, self) => self.findIndex((parent) => parent.id === value.id) === index)
                .map((col) => {
                  if (col['isHiddenInManager']) return null;
                  return (
                    <ManageableColumn
                      key={col.id}
                      column={col}
                      setStickyColumns={setStickyColumns}
                      stickyColumns={stickyColumns}
                      depth={depth}
                    />
                  );
                })}
        </div>
      </Dialog>
    </>
  );
}

const ManageableRow = ({ row, idx }: { row: NexoyaSimulationScenario; idx: number }) => {
  const [comparisonIds, setComparisonIds] = useQueryParam('comparisonIds', NumericArrayParam);

  const toggleHide = (id: number) => {
    if (comparisonIds?.includes(id)) {
      setComparisonIds(comparisonIds?.filter((comparisonId) => comparisonId !== id));
    } else {
      setComparisonIds(comparisonIds ? [...comparisonIds, id] : [id]);
    }
  };

  const isRowHidden = !!comparisonIds?.find((id) => id === row.scenarioId);

  return (
    <StyledItem>
      <Row>
        <Checkbox
          onClick={() => toggleHide(row.scenarioId)}
          checked={row.isBaseScenario ? true : isRowHidden}
          type="checkbox"
          disabled={row.isBaseScenario}
        />
        <Button
          disabled={row.isBaseScenario}
          style={{ width: '100%', color: row.isBaseScenario ? nexyColors.lilac : nexyColors.neutral900 }}
          onClick={() => toggleHide(row.scenarioId)}
        >
          Scenario {idx} {row.isBaseScenario ? '(Base scenario)' : ''} (Budget:{' '}
          {new Intl.NumberFormat('en-EN', { maximumSignificantDigits: 2 }).format(
            row?.budget?.totals?.currentScenarioTotal
          )}
          )
        </Button>
      </Row>
    </StyledItem>
  );
};

const StyledItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid #e3e4e8bf;
  margin: 7px;
  border-radius: 5px;
  min-width: 380px;
`;

const StyledCloseButton = styled(CloseButton)`
  border-radius: 6px;
`;
