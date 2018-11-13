import axios from "axios";

import { CREATE_CLASS, GET_ERRORS, CLEAR_ERRORS } from "./types";

// Add Class
export const createClass = classData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/classes/create", classData)
    .then(res => {
      console.log(res.data);
      dispatch({
        type: CREATE_CLASS,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
