import isEmpty from "../validation/is-empty";

import { CREATE_CLASS } from "../actions/types";

const initialState = {
  classes: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_CLASS:
      return {
        ...state,
        classes: action.payload
      };
    default:
      return state;
  }
}
