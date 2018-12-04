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
import Typography from "@material-ui/core/Typography";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

import { toggleSidebar } from "../../actions/layoutActions";

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
  },

  sectionTitle: {
    textAlign: "center",
    marginTop: "0.3rem"
  }
});

class Sidebar extends Component {
  state = {
    enrolled_class_open: false,
    teaching_class_open: false
  };

  componentWillReceiveProps() {
    if (this.props.layout.open) {
      this.setState({
        enrolled_class_open: false,
        teaching_class_open: false
      });
    }
  }

  // Class handles
  handleClickEnrolled = () => {
    this.setState({ enrolled_class_open: !this.state.enrolled_class_open });
  };

  handleClickTeaching = () => {
    this.setState({ teaching_class_open: !this.state.teaching_class_open });
  };

  render() {
    const { open } = this.props.layout;
    const { enrolled_classes, teaching_classes } = this.props.user;
    const { classes } = this.props;

    //console.log(this.props);

    const drawerContent = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        {enrolled_classes.length !== 0 && (
          <div>
            <Typography className={classNames(classes.sectionTitle)}>
              Student
            </Typography>
            <ListItem
              button
              onClick={this.handleClickEnrolled}
              name="class_open"
            >
              <ListItemIcon>
                <Icon className="fas fa-book" />
              </ListItemIcon>
              <ListItemText inset primary="Classes" />
              {this.state.enrolled_class_open ? (
                <ListItemIcon>
                  <ExpandLess />
                </ListItemIcon>
              ) : (
                <ListItemIcon>
                  <ExpandMore />
                </ListItemIcon>
              )}
            </ListItem>
            <Collapse
              in={this.state.enrolled_class_open}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {enrolled_classes.map((userClass, i) => (
                  <ListItem
                    key={i}
                    button
                    component={Link}
                    to={{
                      pathname: `/student/${userClass.code}`,
                      testvalue: "hello"
                    }}
                    className={classes.nested}
                  >
                    <ListItemText inset primary={userClass.name} />
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
            <ListItem button component={Link} to="/student-submissions">
              <ListItemIcon>
                <Icon className="fas fa-paper-plane" />
              </ListItemIcon>
              <ListItemText primary="Submissions" />
            </ListItem>

            <Divider />
          </div>
        )}

        {teaching_classes.length !== 0 && (
          <div>
            <Typography className={classNames(classes.sectionTitle)}>
              Teacher
            </Typography>
            <ListItem button onClick={this.handleClickTeaching}>
              <ListItemIcon>
                <Icon className="fas fa-book" />
              </ListItemIcon>
              <ListItemText inset primary="Classes" />
              {this.state.teaching_class_open ? (
                <ListItemIcon>
                  <ExpandLess />
                </ListItemIcon>
              ) : (
                <ListItemIcon>
                  <ExpandMore />
                </ListItemIcon>
              )}
            </ListItem>
            <Collapse
              in={this.state.teaching_class_open}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {teaching_classes.map((userClass, i) => (
                  <ListItem
                    key={i}
                    button
                    component={Link}
                    to={{
                      pathname: `/teacher/${userClass.code}`,
                      testvalue: "hello"
                    }}
                    className={classes.nested}
                  >
                    <ListItemText inset primary={userClass.name} />
                  </ListItem>
                ))}
              </List>
            </Collapse>

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
          </div>
        )}

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
  user: state.auth.user
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    { toggleSidebar }
  )
)(Sidebar);
