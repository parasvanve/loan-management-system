const successResponse = (res, message, data, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    data
  });

const errorResponse = (res, message, statusCode = 400, errors) =>
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {})
  });

module.exports = {
  successResponse,
  errorResponse
};
