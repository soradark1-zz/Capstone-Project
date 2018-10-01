import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import compose from "recompose/compose";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";


const styles = theme => ({
  footer: {
    top: "auto",
    bottom: 0,
    position: "absolute",

    textAlign: "center",
    justifyContent: "center"
  },
  footerText: {
    padding: '1rem',
    fontSize: '1rem',
  }
});

class Footer extends Component {
  render() {
    const { classes, theme } = this.props;



    return (
      <AppBar className={classes.footer}>
        <Typography
          variant="title"
          color="inherit"
          noWrap
          className={classNames(classes.footerText)}
        >
          Copyright &copy; {new Date().getFullYear()} Agora
        </Typography>
      </AppBar>
    );
  }
}

Footer.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(Footer);
