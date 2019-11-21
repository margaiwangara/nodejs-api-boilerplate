const express = require("express");

const router = express.Router({ mergeParams: true });

// middleware
const { userAuthorized } = require("../middleware/auth");

// controller methods
const {
  registerUser,
  loginUser,
  getCurrentlyLoggedInUser
} = require("../controllers/auth");

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/account", userAuthorized, getCurrentlyLoggedInUser);

module.exports = router;
