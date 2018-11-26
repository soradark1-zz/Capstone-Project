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
      name: String,
      code: String
    }],
    teaching_classes: [{
      name: String,
      code: String
    }],
    uploaded_document_ids: [{
      id: String,
      doc_name: String,
      class_name: String,
      class_id: String
    }],
    commented_document_ids: [{
      doc_id: String,
      class_code: String,
      assign_name: String,
      submitted: {
        type: Boolean,
        default: false
      }
    }]
  }
});

module.exports = User = mongoose.model('users', UserSchema);
