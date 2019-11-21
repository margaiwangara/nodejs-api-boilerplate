const express = require("express");

const router = express.Router({ mergeParams: true });

// controller methods
const { registerUser } = require("../controllers/auth");

// routes
router.post("/register", registerUser);

module.exports = router;
