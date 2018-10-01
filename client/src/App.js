import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";



import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import About from "./components/info/About"
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";

import "./styles/App.css";
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

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

const styles = theme => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    textAlign: 'center',
    paddingTop: '5rem',
  }
});

class App extends Component {
  render() {

    const { classes, theme } = this.props;
    console.log(theme);

    console.log(store.getState().auth.isAuthenticated);
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />

            <div className={classNames(classes.main)}>
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/about" component={About} />
                <Route exact path="/dashboard" component={Dashboard} />
              </Switch>

            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
