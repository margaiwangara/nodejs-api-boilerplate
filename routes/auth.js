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
  updateLoggedInUserProfileImage,
  forgotPassword,
  resetPassword,
  updatePassword,
  confirmEmail,
  logoutUser
} = require("../controllers/auth");

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.get("/confirmemail", confirmEmail);
router.get("/account", userAuthorized, getCurrentlyLoggedInUser);
router.put("/account/edit/password", userAuthorized, updatePassword);
router.put("/account/edit", userAuthorized, editLoggedInUserDetails);
router.put(
  "/account/edit/profile",
  userAuthorized,
  updateLoggedInUserProfileImage
);

module.exports = router;
