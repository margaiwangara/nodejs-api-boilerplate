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

router
  .route("/")
  .get(getFoos)
  .post(createFoo);

router
  .route("/:id")
  .get(getFoo)
  .put(updateFoo)
  .delete(deleteFoo);

module.exports = router;
