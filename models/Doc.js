const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DocSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  contents: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  assignment_name: {
    type: String,
    required: true
  },
  course_code: {
    type: String,
    required: true
  },
  date_submited: {
    type: String,
    required: true
  },
  max_grade: {
    type: Number,
    required: true
  },
  comments: [],
  grades: [{
    grader: String,
    grade: Number
  }]
});

module.exports = Doc = mongoose.model('documents', DocSchema);
