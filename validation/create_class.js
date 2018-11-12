const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCreateClassInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.email = 'Course name is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};