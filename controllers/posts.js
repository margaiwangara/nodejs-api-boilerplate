const db = require('../models');
const { ErrorResponse, asyncWrapper } = require('../utils');

/**
 * @desc    Get All Posts/Belonging to certain user
 * @route   GET /api/posts
 *          GET /api/users/:id/posts
 * @access  Public
 */
exports.getPosts = asyncWrapper(async (req, res, next) => {
  let posts;
  // check if user_id exists
  if (req.params.id) {
    // get data belonging to user
    posts = await db.Post.find({ user: req.params.id });
  }

  // else get all posts
  posts = await db.Post.find();

  return res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get Single Post
 * @route   GET /api/posts/:id
 * @access  Public
 */
exports.getPost = asyncWrapper(async (req, res, next) => {
  // get single posts by id, destructure id from req
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse('Invalid data input', 400));
  }

  // get post
  const post = await db.Post.findById(id).populate('user');

  // check if post exists
  if (!post) {
    return next(new ErrorResponse('Resource not found', 404));
  }

  return res.status(200).json(post);
});

/**
 * @desc    Create Post
 * @route   POST /api/posts
 *          UserId will be acquired from req object
 * @access  Private
 */
exports.createPost = asyncWrapper(async (req, res, next) => {
  // grab userid from req object
  const user = req.user;

  // check if user exists
  if (!user) {
    return next(new ErrorResponse('Unauthorized Access', 401));
  }

  // create new post
  const newPost = await db.Post.create({ ...req.body, user: user._id });

  return res.status(201).json(newPost);
});

/**
 * @desc    Update Post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
exports.updatePost = asyncWrapper(async (req, res, next) => {
  // get posts id
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse('Invalid data input', 400));
  }

  // check if user has ownership of post
  const user = await db.User.findById(req.user._id);

  // find post
  const post = await db.Post.findById(id);

  // 404 Post not found
  if (!post) {
    return next(new ErrorResponse('Resource not found', 404));
  }

  // 404 User not found
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // check if user id and post user id match
  if (post.user.toString() !== user._id.toString() && user.role !== 'admin') {
    console.log(`Role: ${user.role}`);

    return next(
      new ErrorResponse('You are not authorized to edit this post', 403),
    );
  }

  // update post
  const updatePost = await db.Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: false,
  });

  return res.status(200).json(updatePost);
});

/**
 * @desc    Delete Post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
exports.deletePost = asyncWrapper(async (req, res, next) => {
  // get id
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse('Invalid data input', 400));
  }

  // check if user has ownership of post
  const user = await db.User.findById(req.user._id);

  // find post
  const post = await db.Post.findById(id);

  // 404 Post not found
  if (!post) {
    return next(new ErrorResponse('Resource not found', 404));
  }

  // 404 User not found
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // check if user id and post user id match and role=admin
  if (post.user.toString() !== user._id.toString() && user.role !== 'admin') {
    return next(
      new ErrorResponse('You are not authorized to delete this post', 403),
    );
  }

  // delete
  post.remove();

  return res.status(200).json({ success: true });
});
