import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";

import {
  createClass,
  enrollClass,
  dropClass
} from "../../actions/classesActions";

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
      className: "",
      classCode: ""
    };

    this.createNewClass = this.createNewClass.bind(this);
    this.enrollInClass = this.enrollInClass.bind(this);
    this.dropAClass = this.dropAClass.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  createNewClass() {
    const newClassData = {
      name: this.state.className
    };

    this.props.createClass(newClassData);
  }

  enrollInClass() {
    const newClassData = {
      code: this.state.classCode
    };

    this.props.enrollClass(newClassData);
  }

  dropAClass() {
    const newClassData = {
      code: this.state.classCode
    };

    this.props.dropClass(newClassData);
  }

  handleInput(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  render() {
    return (
      <div>
        <div>
          <input
            placeholder="Class Name"
            value={this.state.className}
            onChange={this.handleInput}
            name="className"
          />
          <button onClick={this.createNewClass}>Add Class</button>
        </div>
        <div>
          <input
            placeholder="Class Code"
            value={this.state.classCode}
            onChange={this.handleInput}
            name="classCode"
          />
          <button onClick={this.enrollInClass}>Enroll Class</button>
          <button onClick={this.dropAClass}>Drop Class</button>
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
    { createClass, enrollClass, dropClass }
  )
)(Dashboard);
