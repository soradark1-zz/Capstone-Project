const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ClassSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  enrolled_students: [{
    name: String,
    id: String
  }],
  teachers: [{
    name: String,
    id: String
  }],
  assignments: [{
    assignment_name: String,
    description: String,
    max_grade: String,
    date_assigned: String,
    date_due: String,
    submitted_docs: [{
      doc_id: String,
      owner: String
    }],
    peer_grading_assignment: [{
      owner: String,
      doc_id: String,
      grader: String
    }]
  }]
});

module.exports = Class = mongoose.model("classes", ClassSchema);
