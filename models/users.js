const mongoose = require("mongoose");

// schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      maxlength: 255
    },
    surname: {
      type: String,
      maxlength: 255
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email field is required"],
      match: [
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        "Please enter a valid email"
      ],
      maxlength: 100
    },
    password: {
      type: String,
      minlength: 6,
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
    isEmailConfirmed: Boolean
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
