import { PaginationTypes } from 'types';

type State = {
  page: number;
  offset: number;
};
type Action = {
  type: PaginationTypes | 'reset';
  offset?: number;
  payload?: State;
};

export function init({ page, offset }) {
  return {
    page,
    offset,
  };
}

export function paginationReducer(state: State, action: Action) {
  switch (action.type) {
    case PaginationTypes.INCREMENT:
      return {
        ...state,
        page: state.page + 1,
      };

    case PaginationTypes.DECREMENT:
      return {
        ...state,
        page: state.page - 1,
      };

    case PaginationTypes.NUMERATION:
      return {
        ...state,
        offset: action.offset,
      };
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}
