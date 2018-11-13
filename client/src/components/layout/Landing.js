import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import compose from "recompose/compose";

import "../../styles/landing.css";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  brand: {
    fontFamily: "Pacifico",
    fontSize: "9rem"
  },
  button: {
    textTransform: "inherit",
    margin: "0.6rem",
    fontSize: "1.2rem",
    backgroundColor: theme.palette.secondary.main
  },
  login: {
    backgroundColor: theme.palette.secondary.main
  },
  lead: {
    fontSize: "1.3rem"
  }
});

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="landing">
        <div className={classNames(classes.brand)}>Agora</div>
        <p className={classNames(classes.lead)}>
          Enroll in classes, submit documents, and receive feedback made easy
        </p>
        <Divider />

        <Button
          component={Link}
          to="/register"
          className={classNames(classes.button)}
          variant="contained"
          size="large"
        >
          Signup
        </Button>
        <Button
          component={Link}
          to="/login"
          className={classNames(classes.button, classes.login)}
          variant="contained"
          size="large"
        >
          Login
        </Button>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(Landing);
