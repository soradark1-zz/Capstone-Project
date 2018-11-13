import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import isEmpty from "../validation/is-empty.js";

import { GET_ERRORS, SET_CURRENT_USER, GET_USER_CLASSES } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(getCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const getCurrentUser = decoded => async dispatch => {
  if (!isEmpty(decoded)) {
    await axios
      .get("/api/users/current")
      .then(async res => {
        const user = {
          name: res.data.name,
          profile: res.data.profile,
          date: res.data.date,
          email: res.data.email,
          id: res.data.id,
          exp: decoded.exp,
          iat: decoded.iat
        };
        await dispatch(setCurrentUser(user));
      })
      .catch(err => console.log(err));
  } else {
    await dispatch(setCurrentUser({}));
  }

  /*return axios
    .get("/api/users/current")
    .then(res => {
      const user = {
        name: res.data.name,
        profile: res.data.profile,
        date: res.data.date,
        email: res.data.email,
        id: res.data.id
        //exp: decoded.exp,
        //iat: decoded.iat
      };
      return user;
    })
    .catch(err => console.log(err));*/
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
