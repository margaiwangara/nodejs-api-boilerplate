const path = require('path');
const User = require('../models/users');
const ErrorResponse = require('../utils/ErrorResponse');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const emailTemplate = require('../utils/emailTemplate');

// send email function
const sendEmail = require('../utils/sendEmail');
const { nextTick } = require('process');

/**
 * @desc    Register New User
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res, next) => {
  try {
    // get user required field
    const { name, email, password } = req.body;

    if (req.body.role === 'admin') {
      req.body.role = undefined;
    }

    // create new user
    const user = await User.create({
      name,
      email,
      password,
      ...req.body,
    });

    // grab token and send to email
    const confirmEmailToken = user.generateEmailConfirmToken();

    // save token
    user.save({ validateBeforeSave: false });

    // send email to user with token and stuff
    const URL = `${process.env.CLIENT_URL}/confirmemail?token=${confirmEmailToken}`;
    const options = {
      from: `${process.env.NOREPLY_EMAIL}`,
      to: user.email,
      subject: 'Email Confirmation',
      html: emailTemplate({
        name: user.name,
        situation: 'email_confirmation',
        url: URL,
      }),
    };

    // send email
    const sendResult = await sendEmail(options);

    if (!sendResult) {
      console.log('Confirmation email not sent');
    }

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
        new ErrorResponse('Email and password fields are required', 400),
      );
    }

    // get user by email
    const user = await User.findOne({ email }).select('+password');

    if (user == null) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // confirm password input was correct
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // JSONWeb Token
    getTokenResponse(user, 200, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @desc Enable 2fa
 * @route PUT /api/auth/toggle-two-factor
 * @access Private
 */
exports.toggle2faCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorResponse('Unauthorized access', 401));

    await User.findByIdAndUpdate(
      req.user._id,
      { twoFactorEnable: req.body.twoFactor },
      {
        runValidators: false,
      },
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Send 2fa Code
 * @route PUT /api/auth/two-factor
 * @access Private
 */
exports.send2faCode = async (req, res, next) => {
  try {
    // get id
    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorResponse('Unauthorized access', 401));

    const code = user.generate2faCode();
    const { email } = user;

    // send email
    const options = {
      from: `${process.env.NOREPLY_EMAIL}`,
      to: email,
      subject: '2-Factor Authentication Code',
      html: emailTemplate({
        name: user.name,
        situation: 'two_factor_code',
        code,
      }),
    };

    // send email
    const sendResult = await sendEmail(options);

    if (!sendResult) {
      console.log('2-fa email code not sent');
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      code,
      expiration: user.twoFactorCodeExpire,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @desc Confirm 2fa Code
 * @route POST /api/auth/two-factor
 * @access Private
 */
exports.confirm2faCode = async (req, res, next) => {
  // get code
  const { code } = req.body;
  try {
    // get user by token
    const user = await User.findOne({
      twoFactorCode: code,
      twoFactorCodeExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired code', 400));
    }

    user.twoFactorCode = undefined;
    user.twoFactorCodeExpire = undefined;

    // save changes
    user.save({ validateBeforeSave: false });

    // generate JWT Token
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout User/ Clear Cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logoutUser = async (req, res, next) => {
  try {
    // expire cookie after 10 seconds
    return res
      .cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), //expire in 10 seconds
        httpOnly: true,
      })
      .status(200)
      .json({ success: true, message: 'User logged out successfully' });
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
    const user = await User.findById(req.user._id).populate('course');

    return res.status(200).json({
      success: true,
      data: user,
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
      surname: req.body.surname || req.user.surname,
    };

    // find user by id
    const user = await User.findById(req.user._id);

    if (user == null) {
      console.log('user not found');
      return next(new ErrorResponse('User not found', 404));
    }

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedFields,
      {
        new: true,
        runValidators: false,
      },
    );

    return res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update User Profile Image
 * @route   PUT /api/auth/account/edit/profile
 * @access  Private
 */
exports.updateLoggedInUserProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // if user exists
    if (!user) {
      return next(new ErrorResponse('User not found!', 404));
    }

    // if file exists
    console.log(req.files);
    if (!req.files) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // get file
    const file = req.files.file;

    // check if file is an image
    if (!file.mimetype.startsWith('image')) {
      return next('Please upload an image file', 400);
    }

    // check maximum size
    if (file.size > process.env.FILE_MAX_SIZE) {
      return next(
        new ErrorResponse(
          `Maximum file size exceeded[${Math.floor(
            process.env.FILE_MAX_SIZE / 1000000,
          )}MB]`,
          400,
        ),
      );
    }

    // move file
    file.name = `profile_${user._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        return next(new ErrorResponse('File upload failed', 500));
      }

      try {
        // Update db
        await User.findByIdAndUpdate(user._id, {
          profileImage: file.name,
        });
      } catch (error) {
        return next(error);
      }
    });

    return res.status(200).json({
      success: true,
      message: `File ${file.name} upload was successful`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update User Password
 * @route   PUT /api/auth/account/edit/password
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    // password ops
    const { oldPassword, password, confirmPassword } = req.body;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    // check password input
    if (!password || !confirmPassword || !oldPassword) {
      return next(
        new ErrorResponse(
          'Password, Confirm Password and Old Password fields are required',
          400,
        ),
      );
    }

    // check password validity
    if (regex.test(password) === false) {
      return next(
        new ErrorResponse(
          'Please enter a valid password, at least one lowercase and uppercase letter and one number',
          400,
        ),
      );
    }

    // check confirm password match
    if (password !== confirmPassword) {
      return next(
        new ErrorResponse(
          'Password and Confirm Password fields must match',
          400,
        ),
      );
    }

    // check if password matches with one in db
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    // if match
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // change password
    user.password = password;

    // save
    await user.save({ validateBeforeSave: false });

    // generate JWT
    getTokenResponse(user, 200, res);
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
      return next(new ErrorResponse('Please input your email address', 400));
    }

    // check user with email
    const user = await User.findOne({ email });

    // generate reset token
    const resetToken = user.generatePasswordResetToken();

    // save token in db
    await user.save({ validateBeforeSave: false });

    // send email to user with token and stuff
    const URL = `${process.env.CLIENT_URL}/resetpassword?token=${resetToken}`;
    const options = {
      from: `${process.env.NOREPLY_EMAIL}`,
      to: email,
      subject: 'Password Reset Token',
      html: emailTemplate({
        name: user.email,
        situation: 'password_reset',
        url: URL,
      }),
    };

    // send email
    const sendResult = await sendEmail(options);

    if (!sendResult) {
      return next(
        new ErrorResponse('Email not sent. Please try again later', 500),
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Please check your email to reset your password',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @desc    Reset Password
 * @route   POST /api/auth/resetpassword
 * @access  Private
 */
exports.resetPassword = async (req, res, next) => {
  try {
    // check if token is passed
    const { token } = req.query;

    if (!token) {
      return next(new ErrorResponse('Invalid or expired token', 400));
    }

    // split token
    const splitToken = token.split('.')[0];
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(splitToken)
      .digest('hex');

    // get user by token
    const user = await User.findOne({
      resetPasswordToken,
      passwordTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired token', 400));
    }

    // set new password
    const { password } = req.body;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!password) {
      return next(new ErrorResponse('Password field is required', 400));
    }

    if (regex.test(password) === false) {
      return next(
        new ErrorResponse(
          'Please enter a valid password, at least one lowercase and uppercase letter and one number',
          400,
        ),
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.passwordTokenExpire = undefined;

    // save changes
    user.save({ validateBeforeSave: false });

    // generate JWT Token
    getTokenResponse(user, 200, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @desc    Recovery Email
 * @route   PUT /api/auth/recoveryemail
 * @access  Private
 */
exports.setRecoveryEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email)
      return next(new ErrorResponse('Please input your recover email', 400));

    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorResponse('Unauthorized Access', 403));

    // update confirm email area
    const recovery = await User.findByIdAndUpdate(
      req.user._id,
      { recoveryEmail: email },
      { new: true, runValidators: false },
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Confirm Email
 * @route   GET /api/auth/confirmemail
 * @access  Private
 */
exports.confirmEmail = async (req, res, next) => {
  try {
    // grab token from email
    const { token } = req.query;

    if (!token) {
      return next(new ErrorResponse('Invalid Token', 400));
    }

    const splitToken = token.split('.')[0];
    const confirmEmailToken = crypto
      .createHash('sha256')
      .update(splitToken)
      .digest('hex');

    // get user by token
    const user = await User.findOne({
      confirmEmailToken,
      isEmailConfirmed: false,
    });

    if (!user) {
      return next(new ErrorResponse('Invalid Token', 400));
    }

    // update confirmed to true
    user.confirmEmailToken = undefined;
    user.isEmailConfirmed = true;

    // save
    user.save({ validateBeforeSave: false });

    console.log(user);
    // return token
    getTokenResponse(user, 200, res);
  } catch (error) {
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
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  // in production cookie is secure
  if (process.env.NODE_ENV == 'production') {
    options.secure = true;
  }

  return res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
