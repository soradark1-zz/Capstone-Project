import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";

import { createClass, enrollClass } from "../../actions/classesActions";

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

    this.state = {
      classCode: ""
    };

    this.createNewClass = this.createNewClass.bind(this);
    this.enrollInClass = this.enrollInClass.bind(this);
    this.classCodeHandler = this.classCodeHandler.bind(this);
  }

  createNewClass() {
    const newClassData = {
      name: "My new Class"
    };

    this.props.createClass(newClassData);
  }

  enrollInClass() {
    const newClassData = {
      code: this.state.classCode
    };

    this.props.enrollClass(newClassData);
  }

  classCodeHandler(evt) {
    this.setState({
      classCode: evt.target.value
    });
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.createNewClass}>Add Class</button>
        </div>
        <div>
          <input
            placeholder="Class Code"
            value={this.state.classCode}
            onChange={this.classCodeHandler}
          />
          <button onClick={this.enrollInClass}>Enroll Class</button>
        </div>
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
    { createClass, enrollClass }
  )
)(Dashboard);
