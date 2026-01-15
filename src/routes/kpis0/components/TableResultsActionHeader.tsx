import React from 'react';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { ArrayParam, BooleanParam, DateParam, useQueryParams } from 'use-query-params';

import { encodeKpisQuery } from '../../../utils/kpi';

import MenuList from '../../../components/ArrayMenuList';
import ButtonIcon from '../../../components/ButtonIcon';
import Checkbox from '../../../components/Checkbox';
import MenuItem from '../../../components/MenuItem';
import Panel from '../../../components/Panel';
import Tooltip from '../../../components/Tooltip';
import SvgCaretDown from '../../../components/icons/CaretDown';
import SvgCompare from '../../../components/icons/CompareTwo';
import SvgPlusCircle from '../../../components/icons/PlusCircle';

import { colorByKey } from '../../../theme/utils';

import ReportNewDialog from '../ReportNewDialog';

const ActionHeaderStyled = styled.div`
  display: flex;
  align-items: center;
  background: #f7f8fc;
  flex: 1;
  min-height: 48px;

  div:first-child {
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* TODO: This button should be included in the button variants */
  .NEXYButtonBase {
    padding: 8px;
    font-size: 18px;
    color: ${colorByKey('cloudyBlue')};

    &:hover {
      color: ${colorByKey('battleshipGrey')};
    }
  }
`;
const ButtonIconWrapper = styled.div<{
  readonly isPanelOpen: boolean;
}>`
  .NEXYButtonBase {
    border-radius: 17px;
    background: ${({ isPanelOpen }) => (isPanelOpen ? colorByKey('paleLilac50') : '')};

    &:hover {
      background: ${colorByKey('paleLilac50')};
    }
  }
`;
const SelectionCountStyled = styled.span`
  margin-left: auto;
  padding-right: 24px;
  letter-spacing: 0.6px;
  color: ${colorByKey('blueyGrey')};
`;
type Props = {
  enableHeaderActions?: boolean;
  selected: any;
  allCheckbox: any;
};

const TableResultsActionHeader = ({ allCheckbox, selected, enableHeaderActions }: Props) => {
  const anchorEl = React.useRef(null);
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = React.useState<boolean>(false);
  // Query params date stuff
  const [, setQueryParams] = useQueryParams({
    kpi: ArrayParam,
    isCompareDatesOpen: BooleanParam,
    isCompareMetricsOpen: BooleanParam,
    dateFromCompare: DateParam,
    dateToCompare: DateParam,
  });
  return (
    <>
      <ReportNewDialog
        isOpen={isReportDialogOpen}
        toggleDialog={() => setIsReportDialogOpen(!isReportDialogOpen)}
        selectedKpis={selected}
      />
      <ActionHeaderStyled>
        <div>
          <Checkbox
            onClick={allCheckbox.onClick}
            checked={allCheckbox.checked}
            indeterminate={allCheckbox.indeterminate}
            disabled={allCheckbox.disabled}
          />
        </div>
        {enableHeaderActions ? (
          <>
            <ButtonIconWrapper isPanelOpen={isPanelOpen}>
              <ButtonIcon ref={anchorEl} onClick={() => setIsPanelOpen(!isPanelOpen)}>
                <SvgPlusCircle />
                <SvgCaretDown
                  style={{
                    fontSize: '12px',
                    marginLeft: '12px',
                    transform: `rotate(${isPanelOpen ? '180' : '0'}deg)`,
                  }}
                />
              </ButtonIcon>
            </ButtonIconWrapper>
            <Tooltip content="Compare" variant="dark">
              <ButtonIcon
                onClick={() => {
                  setQueryParams({
                    kpi: encodeKpisQuery(selected),
                    isCompareMetricsOpen: true,
                  });
                }}
              >
                <SvgCompare />
              </ButtonIcon>
            </Tooltip>
          </>
        ) : null}
        <SelectionCountStyled data-cy={`selectedMetric-${selected.length}`}>
          {selected.length} metric{selected.length > 1 ? 's' : ''} selected
        </SelectionCountStyled>
      </ActionHeaderStyled>
      <Panel
        color="dark"
        open={isPanelOpen}
        anchorEl={anchorEl.current}
        onClose={() => setIsPanelOpen(false)}
        style={{
          maxHeight: 300,
          width: 200,
          overflowY: 'auto',
        }}
        placement="bottom"
        popperProps={{
          enableScheduleUpdate: true,
          style: {
            zIndex: 1305,
          },
        }}
      >
        <MenuList color="dark">
          <MenuItem
            key="create-report"
            onClick={() => {
              setIsReportDialogOpen(true);
              setIsPanelOpen(false);
            }}
          >
            Create report
          </MenuItem>
        </MenuList>
      </Panel>
    </>
  );
};

export default withRouter(TableResultsActionHeader);
