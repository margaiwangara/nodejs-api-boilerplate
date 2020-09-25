const express = require('express');
const router = express.Router();

const {
  getMessage,
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} = require('../controllers/messages');

const advancedResults = require('../middleware/advancedResults');
const { userAuthorized } = require('../middleware/auth');

// messages model
const Message = require('../models/messages');

// router.use(userAuthorized);
router
  .route('/')
  .get(advancedResults(Message, 'user'), getMessages)
  .post(createMessage);
router.route('/:id').get(getMessage).put(updateMessage).delete(deleteMessage);

module.exports = router;
