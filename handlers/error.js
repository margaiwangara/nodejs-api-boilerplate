const ErrorResponse = require("../utils/ErrorResponse");

function errorHandler(error, request, response, next) {
  let err = error;

  // not found error
  if(err.name === 'CastError'){
    const message = "Resource Not Found";
    err = new ErrorResponse(message, 404);
  }

  // validation error
  if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map(val => val.message);
    err = new ErrorResponse(message, 400);
  }

  // Duplicate input error
  if (err.code === 11000) {
    const message = "Duplicate Field Value Entered";
    err = new ErrorResponse(message, 400);
  }

  return response.status(err.status || 500).json({
    error: {
      message: err.message || "Oops! Something went wrong"
    }
  });
}

module.exports = errorHandler;
