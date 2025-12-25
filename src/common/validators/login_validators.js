const { body } = require("express-validator");
exports.login=[
    body("Email").notEmpty().withMessage("Enter Valid Email"),
    body("Password").notEmpty().withMessage("Enter Password")
]