const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  profile: {
    enrolled_classes: [{
      type: String
    }],
    teaching_classes: [{
      type: String
    }],
    uploaded_document_ids: [{
      type: String
    }],
    commented_document_ids: [{
      type: String
    }]
  }
});

module.exports = User = mongoose.model('users', UserSchema);
