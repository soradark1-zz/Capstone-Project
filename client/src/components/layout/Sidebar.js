import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import compose from "recompose/compose";

import "../../styles/sidebar.css";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Hidden from "@material-ui/core/Hidden";
//import IconButton from "@material-ui/core/IconButton";
//import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
//import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

import { toggleSidebar } from "../../actions/layoutActions";
import { getUserClasses } from "../../actions/authActions";

const drawerWidth = 240;

const styles = theme => ({
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "fixed",
    whiteSpace: "nowrap",
    width: drawerWidth,
    height: "100vh",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  fas: {
    width: "21px"
  },

  expandIcon: {
    fill: "white"
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class Sidebar extends React.Component {
  state = {
    drawer_open: true,
    userEnrolledClasses: [],
    class_open: false
  };

  componentWillMount() {
    this.setState({});
  }

  // Class handles
  handleClick = () => {
    this.setState(state => ({ class_open: !state.class_open }));
  };

  render() {
    const { open } = this.props.layout;
    const { classes, userEnrolledClasses } = this.props;

    console.log(userEnrolledClasses);

    const drawerContent = (
      <div>
        <div className={classes.toolbar} />
        <Divider />

        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <Icon className="fas fa-book" />
          </ListItemIcon>
          <ListItemText inset primary="Classes" />
          {this.state.class_open ? (
            <ListItemIcon>
              <ExpandLess />
            </ListItemIcon>
          ) : (
            <ListItemIcon>
              <ExpandMore />
            </ListItemIcon>
          )}
        </ListItem>
        <Collapse in={this.state.class_open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {userEnrolledClasses.map((userClass, i) => (
              <ListItem button className={classes.nested}>
                <ListItemText inset primary={userClass} />
              </ListItem>
            ))}
          </List>
        </Collapse>

        <ListItem button>
          <ListItemIcon>
            <Icon className="fas fa-calendar-alt" />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Icon className="fas fa-pencil-alt" />
          </ListItemIcon>
          <ListItemText primary="Assignments" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Icon className="fas fa-paper-plane" />
          </ListItemIcon>
          <ListItemText primary="Submissions" />
        </ListItem>

        <Divider />

        <ListItem button component={Link} to="/grade-assignment">
          <ListItemIcon>
            <Icon className="fas fa-edit" />
          </ListItemIcon>
          <ListItemText primary="Grade Assignments" />
        </ListItem>
        <ListItem button component={Link} to="/create-assignment">
          <ListItemIcon>
            <Icon className="fas fa-file-medical" />
          </ListItemIcon>
          <ListItemText primary="Create Assignment" />
        </ListItem>

        <Divider />

        <ListItem button>
          <ListItemIcon>
            <Icon className={(classes.icon, "fas fa-cog")} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </div>
    );

    return (
      <div>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              )
            }}
            open={open}
          >
            {drawerContent}
          </Drawer>
        </Hidden>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            classes={{
              paper: classNames(classes.drawerPaper)
            }}
            open={open}
            onClose={this.props.toggleSidebar}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawerContent}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

//export default withStyles(styles, { withTheme: true })(MiniDrawer);

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  layout: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  layout: state.layout,
  userEnrolledClasses: state.auth.userEnrolledClasses
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    { toggleSidebar }
  )
)(Sidebar);
