exports.errorHandler = (err, req, res, next) => {
  console.error("❌", err);
  res.status(500).json({
    message: err.message || "Server Error",
  });
};
