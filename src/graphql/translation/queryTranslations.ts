import { gql, useQuery } from '@apollo/client';
import { TRANSLATION_KEY_VALUE_FRAGMENT } from './fragment';
import useTranslationStore from '../../store/translations';

const TRANSLATIONS_QUERY = gql`
  query Translations($lang: String!) {
    translations(lang: $lang) {
      ...translationKeyValue
    }
  }
  ${TRANSLATION_KEY_VALUE_FRAGMENT}
`;

type Options = {
  lang?: string;
};

function useTranslationsQuery({ lang = 'en_us' }: Options = {}) {
  const { setTranslations, setError } = useTranslationStore();

  const query = useQuery(TRANSLATIONS_QUERY, {
    variables: { lang },
    onCompleted: ({ translations }) => setTranslations(translations),
    onError: (error) => setError(error.message),
  });

  return query;
}

export { TRANSLATIONS_QUERY, useTranslationsQuery };
