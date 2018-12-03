const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAssignmentSubmissionInput(data) {
  let errors = {};

  data.assignment_name = !isEmpty(data.assignment_name) ? data.assignment_name : '';
  data.code = !isEmpty(data.code) ? data.code : '';
  data.doc_name = !isEmpty(data.doc_name) ? data.doc_name : '';
  data.doc_contents = !isEmpty(data.doc_contents) ? data.doc_contents : '';

  if (Validator.isEmpty(data.assignment_name)) {
    errors.assignment_name = 'assignment_name field is required';
  }

  if (Validator.isEmpty(data.code)) {
    errors.code = 'Course code field is required';
  }

  if (Validator.isEmpty(data.doc_name)) {
    errors.doc_name = 'doc_name field is required';
  }

  if (Validator.isEmpty(data.doc_contents)) {
    errors.doc_contents = 'doc_contents field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
