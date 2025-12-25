const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    Name:{type:String},
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    Discription:{type:String},
    Director:{type:String},
    Writer:{type:String},
    IMDB:{type:Number},
    Lead_Actor:[{type:String}],
    Category:{type:String},
    CustomId:{
        type:String,
        default:()=> "Movie_" + new mongoose.Types.ObjectId(),
        unique:true
    }
});

module.exports = mongoose.model("Video", videoSchema);
