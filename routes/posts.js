const express = require("express");

const router = express.Router({ mergeParams: true });

// controller methods
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/posts");

// middleware
const { userAuthorized } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

// middleware model
const Post = require("../models/posts");

// routes
router
  .route("/")
  .get(advancedResults(Post, "user"), getPosts)
  .post(userAuthorized, createPost);

router
  .route("/:id")
  .get(getPost)
  .put(userAuthorized, updatePost)
  .delete(userAuthorized, deletePost);
/**
 * Notes: acquisition - data acquisition by the user will happen based on the following criteria
 *  user must be logged in to view his/her posts
 *  public posts will be available to everyone however editing or deleting will be locked to user who created
 *  it or admin
 *  routes: /posts - display all posts
 */
module.exports = router;
