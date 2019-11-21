const express = require("express");

const router = express.Router({ mergeParams: true });

// controller methods
const { registerUser, loginUser } = require("../controllers/auth");

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
