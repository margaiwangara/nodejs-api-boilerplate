const db = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc    Get All Posts/Belonging to certain user
 * @route   GET /api/posts
 *          GET /api/users/:id/posts
 * @access  Public
 */
exports.getPosts = async (req, res, next) => {
  try {
    let posts;
    // check if user_id exists
    if (req.params.id) {
      // get data belonging to user
      posts = await db.Post.find({ user: req.params.id });
    }

    // else get all posts
    posts = await db.Post.find();

    return res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single Post
 * @route   GET /api/posts/:id
 * @access  Public
 */
exports.getPost = async (req, res, next) => {
  try {
    // get single posts by id, destructure id from req
    const { id } = req.params;

    if (!id) {
      return next(new ErrorResponse("Invalid data input", 400));
    }

    // get post
    const post = await db.Post.findById(id);

    // check if post exists
    if (!post) {
      return next(new ErrorResponse("Resource not found", 404));
    }

    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Post
 * @route   POST /api/posts
 *          UserId will be acquired from req object
 * @access  Private
 */
exports.createPost = async (req, res, next) => {
  try {
    // grab userid from req object
    const user = req.user;

    // check if user exists
    if (!user) {
      return next(new ErrorResponse("Unauthorized Access", 401));
    }

    // create new post
    const newPost = await db.Post.create({ ...req.body, user: user._id });

    return res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
exports.updatePost = async (req, res, next) => {
  try {
    // get posts id
    const { id } = req.params;

    if (!id) {
      return next(new ErrorResponse("Invalid data input", 400));
    }

    const updatePost = await db.Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: false
    });

    return res.status(200).json(updatePost);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
exports.deletePost = async (req, res, next) => {
  try {
    // get id
    const { id } = req.params;

    if (!id) {
      return next(new ErrorResponse("Invalid data input", 400));
    }

    await db.Post.findByIdAndDelete(id);

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
