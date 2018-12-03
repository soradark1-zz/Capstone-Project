const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateGetDocumentInput(data) {
  let errors = {};

  data.doc_id = !isEmpty(data.doc_id) ? data.doc_id : '';
  
  if (Validator.isEmpty(data.doc_id)) {
    errors.doc_id = 'doc_id field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
