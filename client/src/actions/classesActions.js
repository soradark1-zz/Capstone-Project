import axios from "axios";

import { CREATE_CLASS, GET_ERRORS, CLEAR_ERRORS } from "./types";

import { getCurrentUser } from "./authActions";

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
    .then(() => {
      dispatch(getCurrentUser());
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Enroll in a Class
export const enrollClass = classData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/classes/enroll", classData)
    .then(() => {
      dispatch(getCurrentUser());
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Drop a Class
export const dropClass = classData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/classes/drop", classData)
    .then(() => {
      dispatch(getCurrentUser());
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
