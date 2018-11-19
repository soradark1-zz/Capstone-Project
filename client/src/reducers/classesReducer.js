import { SET_CLASS } from "../actions/types";
import isEmpty from "../validation/is-empty.js";

const initialState = {
  isLoaded: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CLASS:
      return {
        isLoaded: !isEmpty(action.payload),
        ...action.payload
      };
    default:
      return state;
  }
}
