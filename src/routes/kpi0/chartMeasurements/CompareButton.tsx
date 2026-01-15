import { withRouter } from 'react-router-dom';

import { ArrayParam, BooleanParam, DateParam, useQueryParams } from 'use-query-params';

import { NexoyaMeasurement } from '../../../types/types';

import { useGlobalDate } from '../../../context/DateProvider';

import { encodeKpisQuery } from '../../../utils/kpi';

import Button from '../../../components/Button';
import ButtonAdornment from '../../../components/ButtonAdornment';
import Menu, { useDropdownMenu } from '../../../components/DropdownMenu';
import MenuItem from '../../../components/MenuItem';
import SvgBalanceScaleRegular from '../../../components/icons/BalanceScaleRegular';
import SvgCaretDown from '../../../components/icons/CaretDown';

type Props = {
  kpi: NexoyaMeasurement;
};

function CompareButton({ kpi }: Props) {
  const { from, to } = useGlobalDate();
  const { anchorEl, open, toggleMenu, closeMenu } = useDropdownMenu();
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
      <Button
        data-cy="kpiCompareBtn"
        variant="contained"
        color="secondary"
        onClick={toggleMenu}
        active={open} //disabled={loading}
        startAdornment={
          <ButtonAdornment position="start">
            <SvgBalanceScaleRegular />
          </ButtonAdornment>
        }
        endAdornment={
          <ButtonAdornment position="end">
            <SvgCaretDown />
          </ButtonAdornment>
        }
        ref={anchorEl}
      >
        Compare
      </Button>
      <Menu anchorEl={anchorEl.current} open={open} onClose={closeMenu} placement="bottom-end" color="dark">
        <MenuItem
          key="compare-dates"
          data-cy="compare-dates"
          style={{
            minWidth: 125,
          }}
          onClick={() => {
            setQueryParams({
              kpi: encodeKpisQuery(kpi),
              dateFromCompare: from,
              dateToCompare: to,
              isCompareDatesOpen: true,
            });
            closeMenu();
          }}
        >
          Dates
        </MenuItem>
        <MenuItem
          key="compare-metrics"
          data-cy="compare-metrics"
          style={{
            minWidth: 125,
          }}
          onClick={() => {
            setQueryParams({
              kpi: encodeKpisQuery(kpi),
              dateFromCompare: from,
              dateToCompare: to,
              isCompareMetricsOpen: true,
            });
            closeMenu();
          }}
        >
          Metrics
        </MenuItem>
      </Menu>
    </>
  );
}

export default withRouter(CompareButton);
