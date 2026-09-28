const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
};

const errorResponse = (
  res,
  message,
  statusCode = 500,
  details = null
) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      message,
      details,
    },
  });
};

module.exports = {
  successResponse,
  errorResponse,
};