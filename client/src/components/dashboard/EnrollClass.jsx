import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import compose from "recompose/compose";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { enrollClass } from "../../actions/classesActions";

import styles from "../../styles/formstyle";

class EnrollClass extends Component {
  constructor() {
    super();
    this.state = {
      code: "",
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

    const classData = { code: this.state.code };

    this.props.enrollClass(classData);
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
    const { classes } = this.props;
    return (
      <div id="create_assignment" className={classes.form}>
        <div className={classes.formTitle}>Enroll into a Class</div>
        <form
          onSubmit={this.onSubmit}
          noValidate
          className={classes.formFields}
        >
          <TextField
            error={errors.code ? true : false}
            label="Class Code"
            name="code"
            value={this.state.code}
            onChange={this.onChange}
            className={classes.textField}
            helperText={errors.code}
            margin="normal"
            variant="outlined"
          />

          <Button
            type="submit"
            className={classNames(classes.submit)}
            variant="contained"
            size="large"
          >
            Enroll
          </Button>
        </form>
      </div>
    );
  }
}

EnrollClass.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  errors: state.errors
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    { enrollClass }
  )
)(EnrollClass);
