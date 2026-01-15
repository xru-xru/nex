import FocusTrap from 'focus-trap-react';
import { Transition } from 'react-transition-group';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { useGlobalDate } from '../../../context/DateProvider';

import { formatShortDate } from '../../../utils/formater';

import Button from '../../../components/Button';
import ButtonBase from '../../../components/ButtonBase';
import Text from '../../../components/Text';
import { ArrowIcon, CancelIcon } from '../../../components/icons';

import { InnerWrapStyled, OverlayWrapStyled } from './styles';

type Props = {
  showPredictionsDateChange: boolean;
  deactivatePredictionsDateChangeOverlay: () => void;
};
const CloseButtonStyled = styled(ButtonBase)`
  position: absolute;
  top: -6px;
  right: 5px;
  padding: 10px;
`;
const DateButtonStyled = styled(Button)`
  padding: 9px 25px;

  span {
    display: flex;
    align-items: center;
  }

  svg {
    transform: rotate(90deg);
    margin: 0 15px;
  }
`;

const OverlayPredictionDateChange = ({ showPredictionsDateChange, deactivatePredictionsDateChangeOverlay }: Props) => {
  const { from, setDateRangeChange } = useGlobalDate();
  if (!showPredictionsDateChange) return null;
  const dateTo = dayjs().subtract(1, 'day').startOf('day').toDate();
  return (
    <Transition in={showPredictionsDateChange} timeout={300} appear>
      {(state) => (
        <FocusTrap>
          <OverlayWrapStyled
            transitionState={state}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <CloseButtonStyled onClick={deactivatePredictionsDateChangeOverlay}>
              <CancelIcon />
            </CloseButtonStyled>
            <InnerWrapStyled transitionState={state}>
              <Text component="h3" id="alert-dialog-title" withEllipsis={false}>
                Can not show predictions.
              </Text>
              <Text component="p" id="alert-dialog-description" withEllipsis={false}>
                To visualize predictions the date range must end yesterday.
                <br />
                Change to the range below:
              </Text>
              <DateButtonStyled
                onClick={() => {
                  setDateRangeChange({
                    from,
                    to: dateTo,
                  });
                }}
                variant="contained"
              >
                {formatShortDate(from)} <ArrowIcon /> {formatShortDate(dateTo)}
              </DateButtonStyled>
            </InnerWrapStyled>
          </OverlayWrapStyled>
        </FocusTrap>
      )}
    </Transition>
  );
};

export default OverlayPredictionDateChange;
