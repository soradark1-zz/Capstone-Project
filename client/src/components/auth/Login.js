import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';

import compose from 'recompose/compose';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from '../../styles/formstyle'




class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
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
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }

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

    this.props.loginUser(userData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const { classes, theme } = this.props;

    return (
      <div id="login" className={classes.form}>

              <div className={classes.formTitle}>Log In</div>
              <p className={classes.lead}>
                Sign in to your Agora account
              </p>
              <form onSubmit={this.onSubmit} noValidate className={classes.formFields} >

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

                <Button
                  type="submit"
                  className={classNames(classes.submit)}
                  variant="contained"
                  size="large">
                    Login
                </Button>

              </form>

      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});


export default compose(
    withStyles(styles, { withTheme: true }),
    connect(mapStateToProps, { loginUser })
  )(Login);
