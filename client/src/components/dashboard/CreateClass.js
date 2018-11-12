import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import compose from "recompose/compose";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import { MuiPickersUtilsProvider } from "material-ui-pickers";
import { DateTimePicker } from "material-ui-pickers";
import MomentUtils from "material-ui-pickers/utils/moment-utils";

import styles from "../../styles/formstyle";

class CreateClass extends Component {
  constructor() {
    super();
    this.state = {
      className: "",
      instructor: this.state.name,
      description: "",
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
  
  handleStartDateChange = date => {
    this.setState({ startDate: date });
  };

  render() {
    const { errors } = this.state;
    const { classes, userEnrolledClasses } = this.props;

    return (
      <div id="create_class" className={classes.form}>
        <div className={classes.formTitle}>Create Class</div>
        <form
          onSubmit={this.onSubmit}
          noValidate
        >
          <TextField
            error={errors.name ? true : false}
            label="Class Name"
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
            label="Class Description"
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
                label="Class Start Date"
                name="startDate"
                value={this.state.startDate}
                onChange={this.handleStartDateChange}
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

CreateClass.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(CreateClass);
