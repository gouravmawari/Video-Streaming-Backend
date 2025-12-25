let mongoose = require("mongoose");
let watchProgress = new mongoose.Schema({
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Netflic_User_data"
    },
    subUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubUser_schema"
    },
    videoId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"videoModel"
    }
    ,
    videoModel:{
        type:String,
        required:true,
        enum:['Video',"SeriesVideo"]
    },
    resumeTime:{
        type:Number,
        default:0
    },
    lastWatched:{
        type:Date
    }
})
module.exports = mongoose.model("watchProgress_schema",watchProgress);