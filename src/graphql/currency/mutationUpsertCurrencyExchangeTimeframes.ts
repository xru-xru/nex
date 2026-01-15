import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';
import { CURRENCY_EXCHANGE_TIMEFRAMES_QUERY } from './queryCurrencyExchangeTimeframes';

const REPLACE_CURRENCY_EXCHANGE_TIMEFRAMES_MUTATION = gql`
  mutation ReplaceCurrencyExchangeTimeframes($teamId: Int!, $timeframes: [CurrencyExchangeTimeframeInput!]!) {
    replaceCurrencyExchangeTimeframes(teamId: $teamId, timeframes: $timeframes) {
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

function useReplaceCurrencyExchangeTimeframesMutation() {
  const { teamId } = useTeam();

  const [replaceCurrencyExchangeTimeframes, { data, loading, error }] = useMutation(
    REPLACE_CURRENCY_EXCHANGE_TIMEFRAMES_MUTATION,
    {
      variables: {
        teamId,
      },
      refetchQueries: [
        {
          fetchPolicy: 'network-only',
          query: CURRENCY_EXCHANGE_TIMEFRAMES_QUERY,
          variables: {
            teamId,
          },
        },
      ],
    },
  );

  return { replaceCurrencyExchangeTimeframes, data, loading, error };
}

export { useReplaceCurrencyExchangeTimeframesMutation };
