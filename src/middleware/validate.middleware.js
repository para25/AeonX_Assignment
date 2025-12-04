// src/middleware/validate.middleware.js

module.exports = function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: error.details.map((d) => d.message),
        },
      });
    }
    next();
  };
};
