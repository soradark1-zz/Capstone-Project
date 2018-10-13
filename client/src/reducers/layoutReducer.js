import { TOGGLE_SIDEBAR } from "../actions/types";

const initialState = {
  open: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        open: !state.open
      };
    default:
      return state;
  }
}
