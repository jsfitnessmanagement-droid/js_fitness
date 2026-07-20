// Centralized error handlers
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode);
  const payload = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
    },
  };
  if (err.details) payload.error.details = err.details;
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.error.stack = err.stack;
  res.json(payload);
};

module.exports = { notFound, errorHandler };
