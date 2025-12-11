const errorHandler = (err, req, res, next) => {
  // Log the detailed error stack for the developer
  console.error(`❌ [Server Error]`, err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Only show stack trace in development mode for security
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;