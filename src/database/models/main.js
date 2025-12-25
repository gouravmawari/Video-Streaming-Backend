const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
    Name: { type: String }, 
    Email: { type: String },
    Password: { type: String },
    Payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayMent_Schema',
       
    },
    PhoneNumber: { type: Number, required: true },
    Valid:{type:Boolean},
    SubUser_Id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubUser_schema"
    }],
    startDate:{type:Date},
    endDate:{type:Date}
    
});

const Netflic_User_data = mongoose.model('Netflic_User_data', user_schema);
module.exports = Netflic_User_data;
