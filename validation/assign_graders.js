const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAssignGradersInput(data) {
  let errors = {};

  data.assignment_name = !isEmpty(data.assignment_name) ? data.assignment_name : '';
  data.code = !isEmpty(data.code) ? data.code : '';

  if (Validator.isEmpty(data.assignment_name)) {
    errors.assignment_name = 'assignment_name field is required';
  }

  if (Validator.isEmpty(data.code)) {
    errors.code = 'class code field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
