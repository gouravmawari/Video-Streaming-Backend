const { body } = require("express-validator");

exports.uploadMovieValidator = [
  body("Name")
    .notEmpty()
    .withMessage("Movie name (Name) is required")
    .isString()
    .withMessage("Name must be a string"),

  body("Discription")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
];
