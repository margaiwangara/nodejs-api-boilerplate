const db = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc    GET all data
 * @route   /api/foo
 */
exports.getFoos = async (req, res, next) => {
  try {
    return res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    GET single data
 * @route   /api/foo/:id
 */
exports.getFoo = async (req, res, next) => {
  try {
    const foo = await db.Foo.findById(req.params.id);
    if (!foo) {
      return next(new ErrorResponse(`Resource Not Found`, 404));
    }
    return res.status(200).json(foo);
  } catch (error) {
    next(error);
  }
};

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
exports.updateFoo = async (req, res, next) => {
  try {
    const updatedFoo = await db.Foo.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json(updatedFoo);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    DELETE document from collection
 * @route   /api/foo/:id
 */
exports.deleteFoo = async (req, res, next) => {
  try {
    await db.Foo.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};
