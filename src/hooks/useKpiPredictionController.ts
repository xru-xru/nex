import React from 'react';

import { isYesterday } from '../utils/dates';

type Options = {
  to: Date;
};

function useKpiPredictionController({ to }: Options) {
  const [showPredictions, setShowPredictions] = React.useState(false);
  const [showPredictionsDateChange, setShowPredictionsDateChange] = React.useState(false);
  const [predictionPeriod, setPredictionPeriod] = React.useState(6);
  React.useEffect(() => {
    if (showPredictions && !isYesterday(to)) {
      setShowPredictions(false);
    }
  }, [showPredictions, to]);
  React.useEffect(() => {
    if (showPredictionsDateChange && isYesterday(to)) {
      setShowPredictionsDateChange(false);
      setShowPredictions(true);
    }
  }, [showPredictionsDateChange, to]);

  function tryPredictionActivation(period: number) {
    if (isYesterday(to)) {
      setShowPredictions(true);
      setPredictionPeriod(period);
    } else {
      setPredictionPeriod(period);
      setShowPredictionsDateChange(true);
    }
  }

  function cancelShowPredictionsDateChange() {
    setShowPredictionsDateChange(false);
  }

  return {
    showPredictions,
    predictionPeriod,
    tryPredictionActivation,
    showPredictionsDateChange,
    cancelShowPredictionsDateChange,
  };
}

export default useKpiPredictionController;
