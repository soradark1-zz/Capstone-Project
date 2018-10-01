import React, { Component } from 'react'
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import '../../styles/sidebar.css'


import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Collapse from '@material-ui/core/Collapse';




const options = [
  'Show some love to Material-UI',
  'Show all notification content',
  'Hide sensitive notification content',
  'Hide all notification content',
];


const drawerWidth = 240;

const styles = theme => ({

  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    height: '100vh',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  fas: {
    width: '21px',
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class MiniDrawer extends React.Component {
  state = {
    drawer_open: true,
    class_open: false,
  };

  //Drawer handles

  handleDrawerOpen = () => {
    this.setState({ drawer_open: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawer_open: false });
  };

  handleDrawerToggle = () => {
    this.setState({ drawer_open: !this.state.drawer_open });
  };

  // Class handles
  handleClick = () => {
    this.setState(state => ({ class_open: !state.class_open }));
  };


  render() {
    const { classes, theme } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.drawer_open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerToggle}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <ListItem button onClick={this.handleDrawerToggle}>
            <ListItemIcon>
              {this.state.drawer_open ?  <ChevronLeftIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
            <ListItemText primary="Collapse" />
          </ListItem>

          <Divider/>

            <ListItem button onClick={this.handleClick}>
              <ListItemIcon>
                <Icon className='fas fa-book' />
              </ListItemIcon>
              <ListItemText inset primary="Classes" />
              {this.state.class_open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.class_open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>

                  <ListItemText inset primary="CSCE 482" />
                </ListItem>
                <ListItem button className={classes.nested}>

                  <ListItemText inset primary="CSCE 465" />
                </ListItem>
                <ListItem button className={classes.nested}>

                  <ListItemText inset primary="CSCE 420" />
                </ListItem>
              </List>
            </Collapse>

          <ListItem button>
            <ListItemIcon>
              <Icon className='fas fa-calendar-alt' />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Icon className='fas fa-pencil-alt' />
            </ListItemIcon>
            <ListItemText primary="Assignments" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Icon className='fas fa-paper-plane' />
            </ListItemIcon>
            <ListItemText primary="Submissions" />
          </ListItem>

          <Divider/>

          <ListItem button component={Link} to='/create-assignment'>
            <ListItemIcon>
              <Icon className='fas fa-edit' />
            </ListItemIcon>
            <ListItemText primary="Create Assignment" />
          </ListItem>

          <Divider/>

          <ListItem button>
            <ListItemIcon>
              <Icon className={classes.icon, 'fas fa-cog'} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>





        </Drawer>



      </div>

    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);
