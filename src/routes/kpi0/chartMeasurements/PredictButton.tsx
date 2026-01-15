import { track } from '../../../constants/datadog';

import Button from '../../../components/Button';
import ButtonAdornment from '../../../components/ButtonAdornment';
import Menu, { useDropdownMenu } from '../../../components/DropdownMenu';
import { LogoIcon } from '../../../components/Logo';
import MenuItem from '../../../components/MenuItem';
import SvgCaretDown from '../../../components/icons/CaretDown';

type Props = {
  showPredictions: boolean;
  tryPredictionActivation: (period: number) => void;
  loading: boolean;
  isThereDataForChart: boolean;
  predictionPeriod: number;
};
const numberOfDaysConfig = [
  {
    numberOfDays: 7,
  },
  {
    numberOfDays: 30,
  },
  {
    numberOfDays: 60,
  },
];

function PredictButton({
  showPredictions,
  tryPredictionActivation,
  loading,
  predictionPeriod,
  isThereDataForChart,
}: Props) {
  const { anchorEl, open, toggleMenu, closeMenu } = useDropdownMenu();
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={toggleMenu}
        active={open}
        disabled={loading || !isThereDataForChart}
        data-cy="kpiPredictBtn"
        startAdornment={
          <ButtonAdornment position="start">
            <LogoIcon
              infinite={loading}
              style={{
                marginRight: 8,
                marginLeft: 6,
                width: 8,
                height: 8,
                position: 'relative',
                transform: 'scale(3)',
                top: '-1px',
              }}
            />
          </ButtonAdornment>
        }
        endAdornment={
          <ButtonAdornment position="end">
            <SvgCaretDown />
          </ButtonAdornment>
        }
        ref={anchorEl}
      >
        {!showPredictions ? 'Predict' : `Next ${predictionPeriod} days`}
      </Button>
      <Menu anchorEl={anchorEl.current} open={open} onClose={closeMenu} placement="bottom-end" color="dark">
        {numberOfDaysConfig.map((numberOfDaysConfigItem) => (
          <MenuItem
            key={`numberOfDays-${numberOfDaysConfigItem.numberOfDays}`}
            data-cy={`numberOfDays-${numberOfDaysConfigItem.numberOfDays}`}
            style={{
              minWidth: 125,
            }}
            onClick={() => {
              track('activate kpi prediction');
              tryPredictionActivation(numberOfDaysConfigItem.numberOfDays);
              closeMenu();
            }}
          >
            {`Next ${numberOfDaysConfigItem.numberOfDays} days`}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default PredictButton;
