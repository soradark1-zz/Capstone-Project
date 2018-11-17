import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import layoutReducer from "./layoutReducer";
import classesReducer from "./classesReducer";

export default combineReducers({
  auth: authReducer,
  layout: layoutReducer,
  errors: errorReducer,
  classes: classesReducer
});
