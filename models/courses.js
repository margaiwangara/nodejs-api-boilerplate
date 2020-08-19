const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
  },
  duration: String,
  credit: {
    type: Number,
    required: [true, 'Course credit is required'],
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  ],
});

const Course = mongoose.model('Course', courseSchema, 'courses');

module.exports = Course;
