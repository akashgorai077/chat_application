export const errorMiddlware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  console.error("API Error:", {
    method: req?.method,
    url: req?.originalUrl,
    statusCode: err.statusCode,
    message: err.message,
  });

  res.status(err.statusCode).json({
    success: false,
    errmessage: err.message,
  });
};
