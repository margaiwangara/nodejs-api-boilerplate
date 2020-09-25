class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;

    if(typeof Error.captureStackTrace === 'fuction'){
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

module.exports = ErrorResponse;
