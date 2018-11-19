import axios from "axios";
import isEmpty from "../validation/is-empty.js";

import { SET_CLASS, GET_ERRORS, CLEAR_ERRORS } from "./types";

import { getCurrentUser } from "./authActions";

// Add Class
export const createClass = classData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/classes/create", classData)
    .then(res => {
      console.log(res.data);
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

// Get a Class' info
export const getClass = classData => dispatch => {
  //dispatch(clearErrors());

  if (isEmpty(classData)) {
    dispatch({
      type: SET_CLASS,
      payload: {}
    });
  } else {
    axios
      .post("/api/classes/info", classData)
      .then(response => {
        dispatch({
          type: SET_CLASS,
          payload: response.data
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      });
  }
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

// Delete a Class
export const deleteClass = classData => dispatch => {
  dispatch(clearErrors());

  axios
    .post("/api/classes/delete", classData)
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
