const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Teacher's name is required"],
  },
  salutation: {
    type: String,
    required: [true, 'Teacher salutation is required'],
  },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
