const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateUpdateCommentsInput(data) {
  let errors = {};

  data.doc_id = !isEmpty(data.doc_id) ? data.doc_id : '';
  data.grade = !isEmpty(data.grade) ? data.grade : '';
  
  if (Validator.isEmpty(data.doc_id)) {
    errors.doc_id = 'doc_id field is required';
  }

  if (data.comments === undefined) {
    errors.comments = 'comments field is required';
  }

  if (Validator.isEmpty(data.grade)) {
    errors.grade = 'grade field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
