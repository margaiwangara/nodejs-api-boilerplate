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

const Foo = require("../models/foo");
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(advancedResults(Foo), getFoos)
  .post(createFoo);

router
  .route("/:id")
  .get(getFoo)
  .put(updateFoo)
  .delete(deleteFoo);

module.exports = router;
