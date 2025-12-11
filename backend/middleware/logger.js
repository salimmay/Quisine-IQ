const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // "finish" event triggers when the response is sent back
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    // Colorize status code
    let color = colors.green;
    if (status >= 400) color = colors.yellow;
    if (status >= 500) color = colors.red;

    console.log(
      `${colors.cyan}[${req.method}]${colors.reset} ${req.originalUrl} ${color}${status}${colors.reset} - ${duration}ms`
    );
  });

  next();
};

module.exports = requestLogger;