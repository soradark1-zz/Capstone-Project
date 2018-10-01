import React, {Component} from "react";
import classnames from 'classnames';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const styles = theme => ({

  textField: {
  },



});


class TextFieldGroup extends Component {
  constructor(props) {
    super(props);

  }



  render() {
    const { classes, theme } = this.props;
    const {name, placeholder, value, info, error, type, onChange, disabled} = this.props;

    return (


        <TextField
          error ={error ? true : false}
          label={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={classes.textField}
          helperText={error}
          type={type}
          margin="normal"
          variant="outlined"
        />


    );
    }
};

TextFieldGroup.propTypes = {
name: PropTypes.string.isRequired,
placeholder: PropTypes.string,
value: PropTypes.string.isRequired,
info: PropTypes.string,
error: PropTypes.string,
type: PropTypes.string.isRequired,
onChange: PropTypes.func.isRequired,
disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
type: 'text'
};

export default withStyles(styles, { withTheme: true })(TextFieldGroup);
