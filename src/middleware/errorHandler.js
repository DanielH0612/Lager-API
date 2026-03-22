const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(500).json({
    message: err.message || "Something went wrong on the server."
  });
};

module.exports = errorHandler;
