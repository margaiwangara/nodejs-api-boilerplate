const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      maxlength: [255, "You have exceeded the maximum name length[255]"]
    },
    surname: {
      type: String,
      maxlength: [255, "You have exceeded the maximum surname length[255]"]
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email field is required"],
      match: [
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        "Please enter a valid email"
      ],
      maxlength: [100, "You have exceeded the maximum email length[100]"]
    },
    password: {
      type: String,
      minlength: [6, "Password length should be at least 6 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
        "Please enter a valid password, at least one lowercase and uppercase letter and one number"
      ],
      select: false,
      required: [true, "Password field is required"]
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: [true, "Role field is required"]
    },
    resetPasswordToken: String,
    passwordTokenExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Password Encryption
userSchema.pre("save", async function(next) {
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
const User = mongoose.model("Users", userSchema);

module.exports = User;
