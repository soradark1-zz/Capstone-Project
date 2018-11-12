const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateClassDeleteInput(data) {
  let errors = {};

  data.code = !isEmpty(data.code) ? data.code : '';

  if (Validator.isEmpty(data.code)) {
    errors.code = 'Course code is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};