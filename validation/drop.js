const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateDropInput(data) {
  let errors = {};

  data.code = !isEmpty(data.code) ? data.code : '';

  if (Validator.isEmpty(data.code)) {
    errors.email = 'Course code is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};