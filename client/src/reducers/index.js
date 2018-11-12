import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import layoutReducer from "./layoutReducer";

export default combineReducers({
  auth: authReducer,
  layout: layoutReducer,
  errors: errorReducer
});
