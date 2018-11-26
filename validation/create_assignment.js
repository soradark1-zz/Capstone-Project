const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCreateAssignmentInput(data) {
  let errors = {};

  data.assignment_name = !isEmpty(data.assignment_name) ? data.assignment_name : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.max_grade = !isEmpty(data.max_grade) ? data.max_grade : '';
  data.date_assigned = !isEmpty(data.date_assigned) ? data.date_assigned : '';
  data.date_due = !isEmpty(data.date_due) ? data.date_due : '';
  data.class_code = !isEmpty(data.class_code) ? data.class_code : '';

  if (Validator.isEmpty(data.assignment_name)) {
    errors.assignment_name = 'assignment_name field is required';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'description field is required';
  }

  if (Validator.isEmpty(data.max_grade)) {
    errors.max_grade = 'max_grade field is required';
  }

  if (Validator.isEmpty(data.date_assigned)) {
    errors.date_assigned = 'date_assigned field is required';
  }

  if (Validator.isEmpty(data.date_due)) {
    errors.date_due = 'date_due field is required';
  }

  if (Validator.isEmpty(data.class_code)) {
    errors.class_code = 'class_code field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
