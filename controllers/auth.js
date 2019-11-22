const path = require("path");
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

/**
 * @desc    Get Currently Logged In User
 * @route   POST /api/auth/account
 * @access  Private
 */
exports.getCurrentlyLoggedInUser = async (req, res, next) => {
  try {
    // get user from req object
    const user = await db.User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit User Details
 * @route   PUT /api/auth/account/edit
 * @access  Private
 */
exports.editLoggedInUserDetails = async (req, res, next) => {
  try {
    // get fields to be updated
    const updatedFields = {
      name: req.body.name || req.user.name,
      email: req.body.email || req.user.email,
      surname: req.body.surname || req.user.surname
    };

    // find user by id
    const user = await db.User.findById(req.user._id);

    if (user == null) {
      console.log("user not found");
      return next(new ErrorResponse("User not found", 404));
    }

    // update user
    const updatedUser = await db.User.findByIdAndUpdate(
      req.user._id,
      updatedFields,
      {
        new: true,
        runValidators: false
      }
    );

    return res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    update User Profile Image
 * @route   PUT /api/auth/account/edit/profile
 * @access  Private
 */
exports.updateLoggedInUserProfileImage = async (req, res, next) => {
  try {
    const user = await db.User.findById(req.user._id);

    // if user exists
    if (!user) {
      return next(new ErrorResponse("User not found!", 404));
    }

    // if file exists
    console.log(req.files);
    if (!req.files) {
      return next(new ErrorResponse("Please upload a file", 400));
    }

    // get file
    const file = req.files.file;

    // check if file is an image
    if (!file.mimetype.startsWith("image")) {
      return next("Please upload an image file", 400);
    }

    // check maximum size
    if (file.size > process.env.FILE_MAX_SIZE) {
      return next(
        new ErrorResponse(
          `Maximum file size exceeded[${Math.floor(
            process.env.FILE_MAX_SIZE / 1000000
          )}MB]`,
          400
        )
      );
    }

    // move file
    file.name = `profile_${user._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        return next(new ErrorResponse("File upload failed", 500));
      }

      try {
        // Update db
        await db.User.findByIdAndUpdate(user._id, {
          profileImage: file.name
        });
      } catch (error) {
        return next(error);
      }
    });

    return res.status(200).json({
      success: true,
      message: `File ${file.name} upload was successful`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    // get email from req
    const { email } = req.body;

    if (!email) {
      return next(new ErrorResponse("Please input your email address", 400));
    }

    // check user with email
    const user = await db.User.findOne({ email });

    if (!user) {
      return next(
        new ErrorResponse(`User with email ${email} has not been found`, 404)
      );
    }

    // generate reset token
    const resetToken = user.generatePasswordResetToken();

    // save token in db
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ success: true, resetToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
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
