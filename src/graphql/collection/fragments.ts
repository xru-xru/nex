import { gql } from '@apollo/client';

const COLLECTION_META_FRAGMENT = gql`
  fragment collectionMeta on Collection {
    collection_id
    parent_collection_id
    title
  }
`;
const COLLECTION_LINKS_FRAGMENT = gql`
  fragment collectionLinks on Collection {
    admin_url
    url
  }
`;
const COLLECTION_PARENT_FRAGMENT = gql`
  fragment collectionParent on Collection {
    parent_collection {
      ...collectionMeta
    }
  }
  ${COLLECTION_META_FRAGMENT}
`;
export { COLLECTION_META_FRAGMENT, COLLECTION_LINKS_FRAGMENT, COLLECTION_PARENT_FRAGMENT };
