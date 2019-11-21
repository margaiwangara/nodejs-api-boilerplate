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

    // get JWT Token
    getTokenResponse(user, 201, res);
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

    // JSONWeb Token
    getTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// /**
//  * @desc    Get Currently Logged In User
//  * @route   POST /api/auth/account
//  * @access  Public
//  */
// const getCurrentlyLoggedInUser = (req, res, next) => {
//   try {
//     // get JWT from headers
//     let headers, token;
//     headers = req.headers.authorization;

//     if(headers && headers.startsWith('Bearer')){
//       token = headers.token.split(' ')[1];
//     }
//   } catch (error) {
//     next(error);
//   }
// }
// Store JWT in cookie
const getTokenResponse = (model, statusCode, res) => {
  // token
  const token = model.generateJSONWebToken();

  // cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // in production cookie is secure
  if (process.env.NODE_ENV == "production") {
    options.secure = true;
  }

  return res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
