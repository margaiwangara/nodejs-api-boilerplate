const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const randomize = require('randomatic');

// schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name field is required'],
      maxlength: [255, 'You have exceeded the maximum name length[255]'],
    },
    surname: {
      type: String,
      maxlength: [255, 'You have exceeded the maximum surname length[255]'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email field is required'],
      match: [
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        'Please enter a valid email',
      ],
      maxlength: [100, 'You have exceeded the maximum email length[100]'],
    },
    password: {
      type: String,
      minlength: [6, 'Password length should be at least 6 characters'],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
        'Please enter a valid password, at least one lowercase and uppercase letter and one number',
      ],
      select: false,
      required: [true, 'Password field is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'student', 'teacher'],
      default: 'user',
      required: [true, 'Role field is required'],
    },
    profileImage: {
      type: String,
      default: 'no-image.jpg',
      maxlength: [255, 'You have exceeded the image name length[255]'],
    },
    resetPasswordToken: String,
    passwordTokenExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    twoFactorCode: String,
    twoFactorCodeExpire: Date,
    twoFactorEnable: {
      type: Boolean,
      default: false,
    },
    recoveryEmail: String,
    strategy: {
      type: {
        type: String,
        default: 'local',
        enum: ['local', 'social'],
        required: true
      },
      provider: String
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

// Password Encryption
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  try {
    // generate salt
    const salt = await bcrypt.genSalt(10);

    // set password to hashed password
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

// virtuals for populate
userSchema.virtual('posts', {
  ref: 'Posts',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// Confirm Password Match
userSchema.methods.comparePassword = async function (candidatePassword, next) {
  try {
    // confirm password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    return isMatch;
  } catch (error) {
    next(error);
  }
};

// Password Reset Token
userSchema.methods.generatePasswordResetToken = function (next) {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expire

  const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
  const confirmTokenCombined = `${resetToken}.${confirmTokenExtend}`;

  return confirmTokenCombined;
};

// 2faCode
userSchema.methods.generate2faCode = function (next) {
  const code = randomize('0', 6);

  this.twoFactorCode = code;
  this.twoFactorCodeExpire = Date.now() + 10 * 60 * 1000;

  return code;
};

// Generate email confirm token
userSchema.methods.generateEmailConfirmToken = function (next) {
  // email confirmation token
  const confirmationToken = crypto.randomBytes(20).toString('hex');

  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmationToken)
    .digest('hex');

  const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
  const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
  return confirmTokenCombined;
};

// Get JSON Web Token
userSchema.methods.generateJSONWebToken = function (next) {
  try {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return token;
  } catch (error) {
    next(error);
  }
};

const User = mongoose.model('Users', userSchema);

module.exports = User;
