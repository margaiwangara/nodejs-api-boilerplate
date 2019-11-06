const db = require("../models");

exports.getFoos = async (req, res, next) => {
  try {
    const foos = await db.Foo.find({}).sort({ createdAt: -1 });
    return res.status(200).json(foos);
  } catch (error) {
    return next(error);
  }
};

exports.getFoo = async (req, res, next) => {
  try {
    const foo = await db.Foo.findById(req.params.id);
    return res.status(200).json(foo);
  } catch (error) {
    return next({
      status: 404,
      message: "Not Found"
    });
  }
};

exports.createFoo = async (req, res, next) => {
  try {
    const newFoo = await db.Foo.create(req.body);
    return res.status(201).json(newFoo);
  } catch (error) {
    return next(error);
  }
};

exports.updateFoo = async (req, res, next) => {
  try {
    const updatedFoo = await db.Foo.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { upsert: true }
    );

    return res.status(200).json(updatedFoo);
  } catch (error) {
    return next(error);
  }
};

exports.deleteFoo = async (req, res, next) => {
  try {
    await db.Foo.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Item deleted successfully"
    });
  } catch (error) {
    return next({
      status: 500,
      message: "Oops! Something went wrong"
    });
  }
};
