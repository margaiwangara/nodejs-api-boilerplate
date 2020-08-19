const express = require('express');
const router = express.Router();
const { createTeacher } = require('../controllers/teachers');
const { userAuthorized } = require('../middleware/auth');

router.use(userAuthorized);

router.route('/').post(createTeacher);

module.exports = router;
