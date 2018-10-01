import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import compose from 'recompose/compose';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
  footer: {
    top: 'auto',
    bottom: 0,
    position: 'absolute',
    height: '4rem',
    textAlign: 'center',
    justifyContent: 'center',
  }


});


class Footer extends  Component{




  render() {
    const { classes, theme } = this.props;

    const footer = (
      <AppBar className={classes.footer}>
          <Typography
            variant="title"
            color="inherit"
            noWrap
            className={classNames(classes.navbarBrand)}>
            Copyright &copy; {new Date().getFullYear()} Agora
          </Typography>
      </AppBar>
    );
    const no_footer = ("");


    return (
      <div>

        {!this.props.auth.isAuthenticated ? footer : no_footer}
      </div>
    );
  };
};


Footer.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect( mapStateToProps)
)(Footer);
