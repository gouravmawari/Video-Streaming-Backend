const fs = require("fs");
const path = require("path");
const Video_schema = require("../../../src/database/models/Video");
const SeriesVideo_schema = require("../../../src/database/models/SeriesVideo");

const getVideoFilePath = async (filename, videoID) => {
    let video;
    if (videoID.includes("series_")) {
        video = await SeriesVideo_schema.findOne({ Name: filename });
    } else {
        video = await Video_schema.findOne({ Name: filename });
    }
    if (!video || !video.filename) {
        throw new Error("Video not found");
    }
    const filePath = path.join(__dirname, "../movies", video.filename);
    if (!fs.existsSync(filePath)) {
        throw new Error("File not found on disk");
    }

    return filePath;
};

module.exports = { getVideoFilePath };
