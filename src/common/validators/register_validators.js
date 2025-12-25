const {body} = require("express-validator");
exports.register =[
    body("Name").notEmpty().withMessage("Enter Name"),
    body("Email").notEmpty().withMessage("Enter Valid Email"),
    body("Password").notEmpty().withMessage("Password must be at least 6 characters"),
    body("PhoneNumber").notEmpty().withMessage("Enter PhoneNumber")
]
