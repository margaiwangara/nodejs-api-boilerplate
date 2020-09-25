const User = require('../models/users');
const { asyncWrapper, ErrorResponse } = require('../utils');

/**
 * @desc    Get Users
 * @route   GET /api/auth/users
 * @access  Private (Admin)
 */
exports.getUsers = asyncWrapper(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get Filtered Users
 * @route   GET /api/users
 * @access  Public
 */
exports.getFilteredUsers = asyncWrapper(async (req, res, next) => {
  let users = await User.find();

  if (users.length > 0) {
    users = users.map((value) => {
      return {
        name: value.name,
        email: value.email,
        surname: value.surname,
        id: value._id,
      };
    });
  }

  return res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 * @desc    Get Single User
 * @route   GET /api/auth/user/:id
 * @access  Private (Admin)
 */
exports.getUser = asyncWrapper(async (req, res, next) => {
  // get user
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  return res.status(200).json(user);
});

/**
 * @desc    Create User
 * @route   POST /api/auth/users
 * @access  Private (Admin)
 */
exports.createUser = asyncWrapper(async (req, res, next) => {
  // create user
  const newUser = await User.create(req.body);

  return res.status(201).json(newUser);
});

/**
 * @desc    Update User
 * @route   PUT /api/auth/users/:id
 * @access  Private (Admin)
 */
exports.updateUser = asyncWrapper(async (req, res, next) => {
  // update users
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });

  return res.status(200).json(updatedUser);
});

/**
 * @desc    Delete User
 * @route   DELETE /api/auth/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = asyncWrapper(async (req, res, next) => {
  // delete user
  await User.findByIdAndDelete(req.params.id);

  return res.status(200).json({ success: true });
});
