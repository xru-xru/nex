import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const CURRENCY_EXCHANGE_TIMEFRAMES_QUERY = gql`
  query CurrencyExchangeTimeframes($teamId: Int!) {
    currencyExchangeTimeframes(teamId: $teamId) {
      currencyExchangeTimeframeId
      teamId
      start
      end
      rates {
        currencyExchangeRateId
        currencyExchangeTimeframeId
        fromCurrency
        toCurrency
        value
      }
    }
  }
`;

function useCurrencyExchangeTimeframesQuery(onCompleted?: (data: any) => void) {
  const { teamId } = useTeam();

  return useQuery(CURRENCY_EXCHANGE_TIMEFRAMES_QUERY, {
    variables: {
      teamId,
    },
    skip: !teamId,
    onCompleted,
  });
}

export { useCurrencyExchangeTimeframesQuery, CURRENCY_EXCHANGE_TIMEFRAMES_QUERY };
