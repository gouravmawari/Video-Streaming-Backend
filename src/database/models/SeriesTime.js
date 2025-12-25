const mongoose = require("mongoose");
const Seriestime = new mongoose.Schema({
    SubUser_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubUser_schema"
    },
    video_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video_series"
    },
    TimeStamp:{
       type:String
    }
})
const seriestime = mongoose.model("Seriestime",Seriestime);
module.exports = seriestime