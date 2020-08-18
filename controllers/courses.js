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
