import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";
import { toggleSidebar } from "../../actions/layoutActions";

import compose from "recompose/compose";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";

const styles = theme => ({
  appBar: {
    position: "fixed",
    zIndex: theme.zIndex.drawer + 1
  },
  navbarBrand: {
    paddingBottom: "0.7rem",
    fontSize: "2rem",
    textDecoration: "none",
    marginRight: "1rem",
    marginLeft: "1rem",
    fontFamily: "Pacifico"
  },
  navbarBtn: {
    fontSize: "inherit",
    textTransform: "inherit"
  },
  grow: {
    flexGrow: 1
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  }
});

class Navbar extends Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null
  };

  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
    this.props.history.push("/");
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { classes, theme } = this.props;
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const authLinksLeft = (
      <div>
        <Button
          component={Link}
          to="/dashboard"
          className={classNames(classes.navbarBtn)}
        >
          Dashboard
        </Button>
      </div>
    );
    const guestLinksLeft = (
      <div>
        <Button
          component={Link}
          to="/about"
          className={classNames(classes.navbarBtn)}
        >
          About
        </Button>
      </div>
    );

    const authLinksRight = (
      <div className={classes.sectionDesktop}>
        <Button
          component={Link}
          to="/profile"
          className={classNames(classes.navbarBtn)}
        >
          {user.name}
        </Button>
        <Button
          component="a"
          onClick={this.onLogoutClick.bind(this)}
          className={classNames(classes.navbarBtn)}
        >
          Logout
        </Button>
      </div>
    );

    const guestLinksRight = (
      <div className={classes.sectionDesktop}>
        <Button
          component={Link}
          to="/register"
          className={classNames(classes.navbarBtn)}
        >
          Sign Up
        </Button>
        <Button
          component={Link}
          to="/login"
          className={classNames(classes.navbarBtn)}
        >
          Login
        </Button>
      </div>
    );

    const authMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem button component={Link} to="/profile">
          <p>{user.name}</p>
        </MenuItem>
        <MenuItem component="a" onClick={this.onLogoutClick.bind(this)}>
          <p>Logout</p>
        </MenuItem>
      </Menu>
    );

    const guestMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem button component={Link} to="/login">
          <p>Login</p>
        </MenuItem>
        <MenuItem button component={Link} to="/register">
          <p>Sign Up</p>
        </MenuItem>
      </Menu>
    );

    const menuButton = (
      <IconButton
        color="inherit"
        aria-label="Open drawer"
        onClick={this.props.toggleSidebar}
        className={classes.navIconHide}
      >
        <MenuIcon />
      </IconButton>
    );

    return (
      <div>
        <AppBar className={classNames(classes.appBar)}>
          <Toolbar>
            {isAuthenticated ? menuButton : ""}
            <Typography
              component={Link}
              to="/"
              variant="title"
              color="inherit"
              noWrap
              className={classNames(classes.navbarBrand)}
            >
              Agora
            </Typography>
            {isAuthenticated ? authLinksLeft : guestLinksLeft}

            <div className={classes.grow} />

            {isAuthenticated ? authLinksRight : guestLinksRight}
            <div className={classes.sectionMobile}>
              <IconButton
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
            {isAuthenticated ? authMobileMenu : guestMobileMenu}
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
  connect(
    mapStateToProps,
    { logoutUser, clearCurrentProfile, toggleSidebar }
  )
)(withRouter(Navbar));
