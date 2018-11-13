import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";

import { createClass } from "../../actions/classesActions";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
});

class Dashboard extends Component {
  constructor() {
    super();

    this.createNewClass = this.createNewClass.bind(this);
  }

  createNewClass() {
    const newClassData = {
      name: "My new Class"
    };

    this.props.createClass(newClassData);
  }

  render() {
    return (
      <div>
        <button onClick={this.createNewClass}>Add Class</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    { createClass }
  )
)(Dashboard);
