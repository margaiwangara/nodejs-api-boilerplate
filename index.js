const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// load env vars
dotenv.config({ path: "./config/config.env" });

// invoke express
const app = express();

// invoke middlewares
app.use(cors());

// Error Handler
app.use(function(req, res, next) {
  let error = new Error("Not Found");
  error.status = 404;
  next(error);
});
const errorHandler = require("./handlers/errors");
app.use(errorHandler);

// set PORT and run app
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`App running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
