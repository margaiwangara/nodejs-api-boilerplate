const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/users");

exports.userAuthorized = async (req, res, next) => {
  try {
    let token, headers;

    headers = req.headers.authorization;

    // check if token exists and starts with bearer
    if (headers && headers.startsWith("Bearer")) token = headers.split(" ")[1];
    // else if cookie has token stored
    // else if (req.cookie.token) token = req.cookie.token;

    // check token
    if (!token) return next(new ErrorResponse("Unauthorized Access", 401));

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user by id and store in req
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    next(error);
  }
};
