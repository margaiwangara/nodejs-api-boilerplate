const express = require("express");
const router = express.Router({ mergeParams: true });

// get controller methods
const {
  getFoo,
  getFoos,
  updateFoo,
  deleteFoo,
  createFoo
} = require("../controllers/foo");

// Foo Model
const Foo = require("../models/foo");

// middleware
const advancedResults = require("../middleware/advancedResults");
const { userAuthorized } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(Foo), getFoos)
  .post(userAuthorized, createFoo);

router
  .route("/:id")
  .get(getFoo)
  .put(userAuthorized, updateFoo)
  .delete(userAuthorized, deleteFoo);

module.exports = router;
