const asyncWrapper = function (callback) {
  return function (req, res, next) {
    return callback(req, res, next).catch(next);
  };
};

module.exports = asyncWrapper;
