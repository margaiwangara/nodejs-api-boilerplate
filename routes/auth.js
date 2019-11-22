const express = require("express");

const router = express.Router({ mergeParams: true });

// middleware
const { userAuthorized } = require("../middleware/auth");

// controller methods
const {
  registerUser,
  loginUser,
  getCurrentlyLoggedInUser,
  editLoggedInUserDetails,
  updateLoggedInUserProfileImage
} = require("../controllers/auth");

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/account", userAuthorized, getCurrentlyLoggedInUser);
router.put("/account/edit", userAuthorized, editLoggedInUserDetails);
router.put(
  "/account/edit/profile",
  userAuthorized,
  updateLoggedInUserProfileImage
);

module.exports = router;
