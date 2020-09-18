const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  console.log('Somthing error ========> ', err);

  let error = { ...err };

  error.message = err.message;

  // console.log(err.stack.red);

  if (err.name === 'SequelizeValidationError') {
    const message = `${err.errors[0].path
      .charAt(0)
      .toUpperCase()}${err.errors[0].path.slice(1)} is not Valid`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    // console.log('error', err);
    const message = `${err.message}` || `${err}`;
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, err: error.message || 'Server Error' });
};

module.exports = errorHandler;
