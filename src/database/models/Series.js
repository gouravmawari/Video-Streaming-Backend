const mongoose = require("mongoose");

const series_schema = new mongoose.Schema({
    Name: { type: String, required: true },
    episodes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Video_series' 
        }
    ],
    Discription: { type: String }, 
    season: { type: Number }, 
    Director:{type:String},
    Writer:{type:String},
    Lead_Actor:[{type:String}],
    Category:{type:String}
});

const Series_schema = mongoose.model("Series", series_schema);
module.exports = Series_schema;
