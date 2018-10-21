import isEmpty from "../validation/is-empty";

import { SET_CURRENT_USER, GET_USER_CLASSES } from "../actions/types";

import classes from "./classes.json";

const initialState = {
  isAuthenticated: false,
  user: {},
  classes
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case GET_USER_CLASSES:
      return {
        ...state,
        classes: state.classes
      };
    default:
      return state;
  }
}
