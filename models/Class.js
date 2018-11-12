const mongoose = require('mongoose');
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
    id: String,
    doc_name: String,
    class_name: String,
    class_id: String
  }]
});

module.exports = Class = mongoose.model('classes', ClassSchema);
