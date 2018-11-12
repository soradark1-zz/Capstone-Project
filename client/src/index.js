import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

import { Provider } from "react-redux";
import store from "./store";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/login";
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4f78b6",
      main: "#144d86",
      dark: "#002659",
      contrastText: "#ffffff"
    },
    secondary: {
      light: "#2ba0f4",
      main: "#73d1ff",
      dark: "#0072c1",
      contrastText: "#000000"
    },
    type: "dark"
  },
  overrides: {
    MuiButton: {
      textPrimary: {
        color: "white"
      }
    }
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
registerServiceWorker();
