const { body } = require("express-validator");

exports.create_series_val = [
  body("name")
    .notEmpty()
    .withMessage("Movie name (Name) is required")
    .isString()
    .withMessage("Name must be a string"),

  body("Discription")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

    body("season")
    .notEmpty()
    .withMessage("Season is required")
    .isString()
    .withMessage("Season must be a string")
];
