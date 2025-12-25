const{create_series_val} = require("./create_series_vali");
const{login} = require("./login_validators");
const{uploadMovieValidator} = require("./movie_validators");
const{upload_ser_Validator} = require("./upload_ser_vali");
const{register} = require("./register_validators");
const{subUserRegister}=require("./subUser_validators");
module.exports = {create_series_val,login,uploadMovieValidator,upload_ser_Validator,register,subUserRegister};