const express = require('express');
const router = express.Router();
const { registerSchool } = require('../controllers/schools');

router.route('/').post(registerSchool);

module.exports = router;
