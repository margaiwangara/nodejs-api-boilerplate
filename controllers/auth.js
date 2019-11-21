const db = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc    Register New User
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res, next) => {
  try {
    // get user required field
    const { name, email, password } = req.body;

    // create new user
    const user = await db.User.create({
      name,
      email,
      password,
      ...req.body
    });

    // return
    return res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res, next) => {
  try {
    // get email and password
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ErrorResponse("Email and password fields are required", 400)
      );
    }

    // get user by email
    const user = await db.User.findOne({ email }).select("+password");

    if (user == null) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // confirm password input was correct
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
