const mongoose = require("mongoose");
const SubUser_schema = new mongoose.Schema({
    Name:{type:String,required: true},
    Online:{type:Boolean},
    Saved: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: "SavedType",
    }],
    SavedType: {
        type: String,
        enum: ["Seriestime", "Movietime"]
    },
    ParentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Netflic_User_data"
    },
    Fav_Category:[{type:String}],
})
const subUser = mongoose.model("SubUser_schema",SubUser_schema);
module.exports = subUser;