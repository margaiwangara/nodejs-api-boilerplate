const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Security Packages
const mongoSanitize = require("express-mongo-sanitize");

// load env vars
dotenv.config({ path: "./config/config.env" });

// invoke express
const app = express();

// invoke middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// security middleware
app.use(mongoSanitize());

// static files in public folder
app.use(express.static(path.join(__dirname, "public")));

// api routes
const fooRoutes = require("./routes/foo");
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
app.use("/api/foo", fooRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth/users", userRoutes);

// Error Handler
app.use(function(req, res, next) {
  let error = new Error("Not Found");
  error.status = 404;
  next(error);
});
const errorHandler = require("./handlers/error");
app.use(errorHandler);

// set PORT and run app
const PORT = process.env.PORT || 5001;
app.listen(
  PORT,
  console.log(
    `App running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  )
);
