const { body } = require("express-validator");

exports.upload_ser_Validator = [
  body("Discription")
    .notEmpty()
    .withMessage("Discription is required")
    .isString()
    .withMessage("Discription must be a string"),

  body("series_name")
    .notEmpty()
    .withMessage("SeriesName is required")
    .isString()
    .withMessage("SeriesName must be a string"),
];