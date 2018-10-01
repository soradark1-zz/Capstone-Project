import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';

import compose from 'recompose/compose';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from '../../styles/formstyle'

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;
    const { classes, theme } = this.props;

    return (
      <div id="register" className={classes.form}>

        <div className={classes.formTitle}>Sign Up</div>
        <p className={classes.lead}>
          Create your Agora account
        </p>
        <form noValidate onSubmit={this.onSubmit} className={classes.formFields}>
          <TextField
            error ={errors.name ? true : false}
            label="Full Name"
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
            error ={errors.email ? true : false}
            label="Email Address"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            className={classes.textField}
            helperText={errors.email}
            type="email"
            margin="normal"
            variant="outlined"
          />
          <TextField
            error ={errors.email ? true : false}
            label="Password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            className={classes.textField}
            helperText={errors.password}
            type="password"
            margin="normal"
            variant="outlined"
          />
          <TextField
            error ={errors.email ? true : false}
            label="Password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            className={classes.textField}
            helperText={errors.password}
            type="password"
            margin="normal"
            variant="outlined"
          />

          <Button
            type="submit"
            className={classNames(classes.submit)}
            variant="contained"
            size="large">
              Sign Up
          </Button>
        </form>

      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default compose(
    withStyles(styles, { withTheme: true }),
    connect(mapStateToProps, { registerUser })
  )(withRouter(Register));
