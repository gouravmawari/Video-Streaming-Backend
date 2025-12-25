const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    _id:String,
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    Discription:{type:String},
    series:{type:mongoose.Schema.Types.ObjectId,
        ref:'Series'
    },
    CustomId:{
            type:String,
            default:()=> "series_" + new mongoose.Types.ObjectId(),
            unique:true
        }
});
const series_videos = mongoose.model("Video_series", videoSchema);
module.exports = series_videos;
