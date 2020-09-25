const express = require('express');

const router = express.Router({ mergeParams: true });

// middleware
const { userAuthorized } = require('../middleware/auth');

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
  logoutUser,
  send2faCode,
  confirm2faCode,
  setRecoveryEmail,
  toggle2faCode,
  googleLogin,
  facebookLogin,
} = require('../controllers/auth');

// routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.get('/confirmemail', confirmEmail);
router.get('/account', userAuthorized, getCurrentlyLoggedInUser);
router.put('/account/edit/password', userAuthorized, updatePassword);
router.put('/account/edit', userAuthorized, editLoggedInUserDetails);
router.put(
  '/account/edit/profile',
  userAuthorized,
  updateLoggedInUserProfileImage,
);
router.put('/recoveryemail', userAuthorized, setRecoveryEmail);

router
  .route('/two-factor')
  .put(userAuthorized, send2faCode)
  .post(userAuthorized, confirm2faCode);

router.put('/toggle-two-factor', userAuthorized, toggle2faCode);

module.exports = router;
