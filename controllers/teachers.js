const Teacher = require('../models/teachers');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc Create Teacher
 * @route POST /api/teachers
 * @access Private
 */
exports.createTeacher = async (req, res, next) => {
  try {
    const newTeacher = await Teacher.create(req.body);

    return res.status(201).json({
      success: true,
      data: newTeacher,
    });
  } catch (error) {
    next(error);
  }
};
