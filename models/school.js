const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'School name is required'],
  },
});

const School = mongoose.model('School', schoolSchema, 'schools');

module.exports = School;
