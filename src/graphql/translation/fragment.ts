import { gql } from '@apollo/client';

const TRANSLATION_KEY_VALUE_FRAGMENT = gql`
  fragment translationKeyValue on Translation {
    key
    text
  }
`;
export { TRANSLATION_KEY_VALUE_FRAGMENT };
