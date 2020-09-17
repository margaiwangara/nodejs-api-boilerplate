const User = require("../models/users");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc    Get Users
 * @route   GET /api/auth/users
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res, next) => {
  try {
    return res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get FilteredUsers
 * @route   GET /api/users
 * @access  Public
 */
exports.getFilteredUsers = async (req, res, next) => {
  try{
    let users = await User.find();

    if(users.length > 0){
      users = users.map(value => {
        return {
          name: value.name,
          email: value.email,
          surname: value.surname,
          id: value._id
        };
      })
    }

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  }catch(error){
    next(error);
  }
}

/**
 * @desc    Get Single User
 * @route   GET /api/auth/user/:id
 * @access  Private (Admin)
 */
exports.getUser = async (req, res, next) => {
  try {
    // get user
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create User
 * @route   POST /api/auth/users
 * @access  Private (Admin)
 */
exports.createUser = async (req, res, next) => {
  try {
    // create user
    const newUser = await User.create(req.body);

    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update User
 * @route   PUT /api/auth/users/:id
 * @access  Private (Admin)
 */
exports.updateUser = async (req, res, next) => {
  try {
    // update users
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: false
      }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete User
 * @route   DELETE /api/auth/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    // delete user
    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
