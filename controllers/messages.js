const Message = require('../models/messages');
const { ErrorResponse, asyncWrapper } = require('../utils');

/**
 * @desc    Get Messages
 * @route   GET /api/messages
 * @access  Private (User)
 */
exports.getMessages = asyncWrapper(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get Message
 * @route   GET /api/messages/:id
 * @access  Private (User)
 */
exports.getMessage = asyncWrapper(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (message) {
    return next(new ErrorResponse('Message not found', 404));
  }

  return res.status(200).json(message);
});

/**
 * @desc    Create Message
 * @route   POST /api/messages
 * @access  Private (User)
 */
exports.createMessage = asyncWrapper(async (req, res, next) => {
  const newMessage = await Message.create(req.body);

  return res.status(201).json(newMessage);
});

/**
 * @desc    Update Message
 * @route   PUT /api/messages/:id
 * @access  Private (User)
 */
exports.updateMessage = asyncWrapper(async (req, res, next) => {
  const updatedMessage = await Message.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: false,
    },
  );

  return res.status(200).json(updatedMessage);
});

/**
 * @desc    Delete Message
 * @route   DELETE /api/messages/:id
 * @access  Private (User)
 */
exports.deleteMessage = asyncWrapper(async (req, res, next) => {
  await Message.findByIdAndDelete(req.params.id);

  return res.status(200).json({ success: true });
});
