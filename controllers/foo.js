const db = require('../models');
const { ErrorResponse, asyncWrapper } = require('../utils');

/**
 * @desc    GET all data
 * @route   /api/foo
 */
exports.getFoos = asyncWrapper(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

/**
 * @desc    GET single data
 * @route   /api/foo/:id
 */
exports.getFoo = asyncWrapper(async (req, res, next) => {
  const foo = await db.Foo.findById(req.params.id);
  if (!foo) {
    return next(new ErrorResponse(`Resource Not Found`, 404));
  }
  return res.status(200).json(foo);
});

/**
 * @desc    CREATE and add documents to collection
 * @route   /api/foo
 */
exports.createFoo = async (req, res, next) => {
  try {
    const newFoo = await db.Foo.create(req.body);
    return res.status(201).json(newFoo);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    UPDATE document in collection
 * @route   /api/foo/:id
 */
exports.updateFoo = asyncWrapper(async (req, res, next) => {
  const updatedFoo = await db.Foo.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(200).json(updatedFoo);
});

/**
 * @desc    DELETE document from collection
 * @route   /api/foo/:id
 */
exports.deleteFoo = asyncWrapper(async (req, res, next) => {
  await db.Foo.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    success: true,
  });
});
