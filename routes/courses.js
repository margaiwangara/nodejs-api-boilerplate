const express = require('express');

const router = express.Router({ mergeParams: true });

// controller methods
const {
  getCourses,
  getCourse,
  createCourse,
} = require('../controllers/courses');

// middleware
const advancedResults = require('../middleware/advancedResults');
const { userAuthorized, roleAuthorized } = require('../middleware/auth');

// middleware model
const Course = require('../models/courses');

// Authorization
router.use(userAuthorized);

// Routes
router.route('/').get(advancedResults(Course), getCourses).post(createCourse);

router.route('/:id').get(getCourse);

module.exports = router;
