import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import About from "./components/info/About";
import PageNotFound from "./components/info/PageNotFound";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import CreateAssignment from "./components/dashboard/CreateAssignment";
import GradeAssignment from "./components/dashboard/GradeAssignment";

import compose from "recompose/compose";
import "./styles/App.css";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  main: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    textAlign: "center"
    //paddingTop: "5rem"
  },
  container: {
    paddingTop: "5rem"
  }
});

class App extends Component {
  render() {
    const { classes, theme } = this.props;
    const { isAuthenticated, user } = this.props.auth;
    console.log(theme);

    return (
      <Router>
        <div className="App">
          <Navbar />
          {isAuthenticated ? <Sidebar /> : ""}
          <div className={classes.main}>
            <div className={classes.container}>
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/about" component={About} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/create-assignment"
                  component={CreateAssignment}
                />
                <PrivateRoute
                  exact
                  path="/grade-assignment"
                  component={GradeAssignment}
                />
                <Route component={PageNotFound} />
              </Switch>
            </div>
          </div>
          {!isAuthenticated ? <Footer /> : ""}
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(App);
