const Course = require('../models/courses');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    Get All Courses
 * @route   GET /api/courses
 * @access  Private
 */

exports.getCourses = async (req, res, next) => {
  try {
    return res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single Courses
 * @route   GET /api/courses/:id
 * @access  Private
 */

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return next(new ErrorResponse('Course not found', 404));

    return res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Courses
 * @route   POST /api/courses
 * @access  Private
 */

exports.createCourse = async (req, res, next) => {
  try {
    const newCourse = await Course.create(req.body);

    return res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Course
 * @route   PUT /api/courses/:id
 * @access  Private
 */

exports.updateCourse = async (req, res, next) => {
  try {
    // update users
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: false,
      },
    );

    return res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};
