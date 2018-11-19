import isEmpty from "../validation/is-empty";

import {
  SET_CURRENT_USER,
  GET_USER_CLASSES,
  UPDATE_USER
} from "../actions/types";

import classes from "./classes.json";

const initialState = {
  isAuthenticated: false,
  user: {
    isLoaded: false,
    name: "",
    id: "",
    enrolled_classes: [],
    teaching_classes: []
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      if (isEmpty(action.payload)) {
        return {
          ...state,
          isAuthenticated: false,
          user: {
            isLoaded: false,
            name: "",
            id: "",
            enrolled_classes: [],
            teaching_classes: []
          }
        };
      }
      return {
        ...state,
        isAuthenticated: true,
        user: { ...state.user, ...action.payload }
      };
    case UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
          isLoaded: true
        }
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
