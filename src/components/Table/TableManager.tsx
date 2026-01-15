import React from 'react';
import { ColumnInstance } from 'react-table';

import styled from 'styled-components';

import { IDS_NOT_ALLOWED_TO_HIDE } from '../../routes/portfolio/components/OptimizationProposal/columns';
import Checkbox from 'components/Checkbox';
import CloseButton from 'components/CloseButton/CloseButton';
import Text from 'components/Text';
import { SvgPin } from 'components/icons/Pin';

import { nexyColors } from '../../theme';
import Button from '../Button';
import ButtonIcon from '../ButtonIcon';
import Dialog, { useDialogState } from '../Dialog';
import Tooltip from '../Tooltip';
import SvgTableManager from '../icons/TableManager';
import { Row } from './Row';
import { IColumnProps } from './tableTypes';

type Props = {
  columns: readonly ColumnInstance<IColumnProps>[];
  getToggleHideAllColumnsProps: () => any;
  toggleHideAllColumns: () => void;
  setStickyColumns: React.Dispatch<React.SetStateAction<string[]>>;
  stickyColumns: string[];
  depth?: number;
  idsNotAllowedToHide?: string[];
};

export function TableManager({
  columns,
  getToggleHideAllColumnsProps,
  toggleHideAllColumns,
  setStickyColumns,
  stickyColumns,
  depth = 0,
  idsNotAllowedToHide = IDS_NOT_ALLOWED_TO_HIDE,
}: Props) {
  const { isOpen, toggleDialog, closeDialog } = useDialogState();
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
      <Dialog isOpen={isOpen} onClose={closeDialog} hideCloseButton>
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
          <SelectAll getProps={getToggleHideAllColumnsProps} toggleOnClick={toggleHideAllColumns} />
          {columns
            .map((col) => goToUpperDepthLevel(col, 0))
            .filter((value, index, self) => self.findIndex((parent) => parent?.id === value?.id) === index)
            .map((col) => {
              if (col?.['isHiddenInManager']) return null;
              return (
                <ManageableColumn
                  key={col.id}
                  column={col}
                  setStickyColumns={setStickyColumns}
                  stickyColumns={stickyColumns}
                  depth={depth}
                  idsNotAllowedToHide={idsNotAllowedToHide}
                />
              );
            })}
        </div>
      </Dialog>
    </>
  );
}

export const ManageableColumn = ({
  column,
  setStickyColumns,
  stickyColumns,
  depth,
  idsNotAllowedToHide = IDS_NOT_ALLOWED_TO_HIDE,
}: {
  column: ColumnInstance<IColumnProps>;
  setStickyColumns: React.Dispatch<React.SetStateAction<string[]>>;
  stickyColumns: string[];
  idsNotAllowedToHide?: string[];
  // The depth of the column in the tree. We have the requirement of hiding three levels of columns at a time, maybe comes in handy for single level as well.
  depth?: number;
}) => {
  const [isHover, setIsHover] = React.useState(false);
  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  const columns = goToDepthLevel([column], depth);

  const isSticky = stickyColumns.some((id) => columns.some((col) => col.id === id));
  const svgStyle = { visibility: isSticky || isHover ? 'visible' : 'hidden' };
  const svgColor = isSticky ? null : '#bbb';

  const toggleHideColumns = () => {
    if (idsNotAllowedToHide.includes(column.id)) return;
    columns.forEach((col) => col.toggleHidden());
  };

  const areColumnsHidden = columns.every((col) => col.getToggleHiddenProps().checked);

  const toggleSticky = (columnArg: ColumnInstance<IColumnProps>) => {
    setStickyColumns((prev: string[]) => {
      const columnIndex = prev.indexOf(columnArg.id);
      if (columnIndex === -1) {
        return [...prev, columnArg.id]; // Add if not present
      } else {
        return prev.filter((id) => id !== columnArg.id); // Remove if already present
      }
    });
  };

  return (
    <StyledItem onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Row>
        <Checkbox
          disabled={idsNotAllowedToHide.includes(column.id)}
          onClick={toggleHideColumns}
          checked={areColumnsHidden}
          type="checkbox"
        />
        <Button style={{ width: '100%', color: nexyColors.neutral900 }} onClick={toggleHideColumns}>
          {
            // @ts-ignore
            column.tableManagerHeader || column.Header
          }
        </Button>
      </Row>
      {/*// @ts-ignore*/}
      {column.disableSticky ? null : (
        <Button
          onClick={() => {
            for (let i = 0; i <= depth; i++) {
              const columnsToApplySticky = goToDepthLevel(depth === 0 ? [column] : column.columns, i);
              columnsToApplySticky.map(toggleSticky);
            }
          }}
        >
          <SvgPin style={svgStyle} fill={svgColor} />
        </Button>
      )}
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
  min-width: 300px;
`;

export const SelectAll = ({ toggleOnClick, getProps }) => (
  <StyledItemBorderless>
    <IndeterminateCheckbox {...getProps()} onChange={() => toggleOnClick()} />
    <Button onClick={() => toggleOnClick()}>Select all</Button>
  </StyledItemBorderless>
);

const StyledItemBorderless = styled.div`
  display: flex;
  align-items: center;
  margin: 8px;
  border-radius: 5px;
  min-width: 300px;

  .NEXYButtonIcon {
    margin: 0;
    padding: 0 8px;
  }
`;

const StyledCloseButton = styled(CloseButton)`
  border-radius: 6px;
`;

const IndeterminateCheckbox = React.forwardRef<any, any>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    // @ts-ignore
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <Checkbox ref={resolvedRef} {...rest} />;
});

const goToDepthLevel = (
  columns: ColumnInstance<IColumnProps>[],
  targetDepth: number,
): ColumnInstance<IColumnProps>[] => {
  return columns.reduce((acc: ColumnInstance<IColumnProps>[], col) => {
    if (col.depth === targetDepth) {
      acc.push(col);
    } else if (col.columns && col.columns.length > 0) {
      acc.push(...goToDepthLevel(col.columns, targetDepth));
    }
    return acc;
  }, []);
};

export function goToUpperDepthLevel(
  column: ColumnInstance<IColumnProps>,
  targetDepth: number,
): ColumnInstance<IColumnProps> | null {
  if (column.depth === targetDepth) {
    return column;
  } else if (column.parent) {
    return goToUpperDepthLevel(column.parent, targetDepth);
  } else {
    // This means we've reached the top of the tree without finding the target depth
    return null;
  }
}
