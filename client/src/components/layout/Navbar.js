import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

import compose from 'recompose/compose';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';



const styles = theme => ({

  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
  },
  navbarBrand: {
    paddingBottom: '0.7rem',
    fontSize: '2rem',
    textDecoration:'none',
    marginRight: '1rem',
    fontFamily: 'Pacifico',
  },
  navbarBtn: {
    fontSize: 'inherit',
    textTransform: 'inherit',

  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    /*display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },*/
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

});





class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }





  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { classes, theme } = this.props;

    const authLinksLeft = (
      <div>
        <Button
          component={Link}to="/dashboard"
          className={classNames(classes.navbarBtn)}>
            Dashboard
        </Button>
      </div>
    );
    const guestLinksLeft = (
      <div>
        <Button
          component={Link}to="/about"
          className={classNames(classes.navbarBtn)}>
            About
        </Button>
      </div>
    );




    const authLinksRight = (
      <div>

      <Button
        component={Link}to="/profile"
        className={classNames(classes.navbarBtn)}>
          {user.name}
      </Button>
      <Button
        component='a'
        onClick={this.onLogoutClick.bind(this)}
        className={classNames(classes.navbarBtn)}>
          Logout
      </Button>
    </div>
    );

    const guestLinksRight = (
      <div>
        <div className={classes.sectionDesktop}>
          <Button component={Link}to="/register" className={classNames(classes.navbarBtn)}>
              Sign Up
          </Button>
          <Button component={Link}to="/login" className={classNames(classes.navbarBtn)}>
              Login
          </Button>

        </div>
      </div>
    );

    return (
      <div>


        <AppBar
          className={classNames(classes.appBar)}
        >
          <Toolbar>
            <Typography component={Link}to="/" variant="title" color="inherit" noWrap className={classNames(classes.navbarBrand)}>
              Agora
            </Typography>
            {isAuthenticated ? authLinksLeft : guestLinksLeft}



            <div className={classes.grow} />

            {isAuthenticated ? authLinksRight : guestLinksRight}


          </Toolbar>



        </AppBar>






      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect( mapStateToProps, { logoutUser, clearCurrentProfile })
)(Navbar);
