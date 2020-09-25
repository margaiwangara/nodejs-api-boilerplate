const express = require("express");

const router = express.Router({ mergeParams: true });

// controller methods
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

// middleware
const advancedResults = require("../middleware/advancedResults");
const { userAuthorized, roleAuthorized } = require("../middleware/auth");

// middleware model
const User = require("../models/users");

// Authorization
router.use(userAuthorized);
router.use(roleAuthorized("admin"));

// Routes
router
  .route("/")
  .get(advancedResults(User, "posts"), getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
