import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import compose from "recompose/compose";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import { DateTimePicker } from "material-ui-pickers";
import MomentUtils from "material-ui-pickers/utils/moment-utils";

import styles from "../../styles/formstyle";

class CreateAssignment extends Component {
  constructor() {
    super();
    this.state = {
      class: "",
      name: "",
      description: "",
      dateAssigned: new Date(),
      dateDue: new Date(),
      maxGrade: 100,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    //this.props.loginUser(userData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleDateAssignedChange = date => {
    this.setState({ dateAssigned: date });
  };
  handleDateDueChange = date => {
    this.setState({ dateDue: date });
  };

  render() {
    const { errors } = this.state;
    const { classes, theme } = this.props;

    return (
      <div id="login" className={classes.form}>
        <div className={classes.formTitle}>Create Assignment</div>
        <form
          onSubmit={this.onSubmit}
          noValidate
          className={classes.formFields}
        >
          <TextField
            error={errors.class ? true : false}
            label="Class"
            name="class"
            value={this.state.class}
            onChange={this.onChange}
            className={classes.textField}
            helperText={errors.class}
            type="class"
            margin="normal"
            variant="outlined"
            autoFocus
          />

          <TextField
            error={errors.name ? true : false}
            label="Assignment Name"
            name="name"
            value={this.state.name}
            onChange={this.onChange}
            className={classes.textField}
            helperText={errors.name}
            type="name"
            margin="normal"
            variant="outlined"
          />

          <TextField
            error={errors.description ? true : false}
            label="Assignment Description"
            name="description"
            value={this.state.description}
            onChange={this.onChange}
            className={classes.textField}
            helperText={errors.description}
            type="description"
            margin="normal"
            variant="outlined"
            multiline
            rows="4"
            rowsMax="4"
          />
          <div>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                className={classes.datePicker}
                label="Date to be assigned"
                name="dateAssigned"
                value={this.state.dateAssigned}
                onChange={this.handleDateAssignedChange}
                disablePast
              />
              <DateTimePicker
                className={classes.datePicker}
                label="Date due"
                name="dateDue"
                value={this.state.dateDue}
                onChange={this.handleDateDueChange}
                disablePast
              />
            </MuiPickersUtilsProvider>
          </div>

          <Button
            type="submit"
            className={classNames(classes.submit)}
            variant="contained"
            size="large"
          >
            Create
          </Button>
        </form>
      </div>
    );
  }
}

CreateAssignment.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(CreateAssignment);
