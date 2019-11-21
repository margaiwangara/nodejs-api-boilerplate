const db = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

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
