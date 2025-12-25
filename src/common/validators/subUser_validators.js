    const {body} = require("express-validator");
    exports.subUserRegister = [
        body("parentUserId").notEmpty().withMessage("enter parentUserId"),
        body("subUserName").notEmpty().withMessage("enter subUserName")
    ]