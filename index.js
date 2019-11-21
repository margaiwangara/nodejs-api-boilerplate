const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");

// load env vars
dotenv.config({ path: "./config/config.env" });

// invoke express
const app = express();

// invoke middlewares
app.use(cors());
app.use(express.json());

// api routes
const fooRoutes = require("./routes/foo");
const authRoutes = require("./routes/auth");
app.use("/api/foo", fooRoutes);
app.use("/api/auth", authRoutes);

// Error Handler
app.use(function(req, res, next) {
  let error = new Error("Not Found");
  error.status = 404;
  next(error);
});
const errorHandler = require("./handlers/error");
app.use(errorHandler);

// set PORT and run app
const PORT = process.env.PORT || 5002;
app.listen(
  PORT,
  console.log(
    `App running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  )
);
