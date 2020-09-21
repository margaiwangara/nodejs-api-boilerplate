const Message = require('../models/messages');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    Get Messages
 * @route   GET /api/messages
 * @access  Private (User)
 */
exports.getMessages = async (req, res, next) => {
  try {
    return res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Message
 * @route   GET /api/messages/:id
 * @access  Private (User)
 */
exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      return next(new ErrorResponse('Message not found', 404));
    }

    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Message
 * @route   POST /api/messages
 * @access  Private (User)
 */
exports.createMessage = async (req, res, next) => {
  try {
    const newMessage = await Message.create(req.body);

    return res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Message
 * @route   PUT /api/messages/:id
 * @access  Private (User)
 */
exports.updateMessage = async (req, res, next) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: false,
      },
    );

    return res.status(200).json(updatedMessage);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Message
 * @route   DELETE /api/messages/:id
 * @access  Private (User)
 */
exports.deleteMessage = async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
