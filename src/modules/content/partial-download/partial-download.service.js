const fs = require("fs");
const path = require("path");
const Video_schema = require("../../../database/models/Video");
const SeriesVideo_schema = require("../../../database/models/SeriesVideo");

const getVideoFilePathAndStats = async (filename, videoID) => {
    let video;
    console.log({fileName:filename});
    if (videoID.includes("series_")) {
        video = await SeriesVideo_schema.findOne({ Name: filename });
    } else {
        video = await Video_schema.findOne({ filename: filename });
    }
    if (!video || !video.filename) {
        throw new Error("Video not found");
    }
    const filePath = path.join(__dirname, "../../../movies", video.filename);
    if (!fs.existsSync(filePath)) {
        throw new Error("File not found on disk");
    }
    const stats = fs.statSync(filePath);
    return { filePath, fileSize: stats.size, filename: video.filename };
};


const calculateChunkRange = (fileSize, chunkNumber, totalChunks) => {
    if (chunkNumber < 1 || chunkNumber > totalChunks){
        throw new Error(`Chunk number must be between 1 and ${totalChunks}`);
    }
    if (totalChunks < 1 || totalChunks > 10){
        throw new Error("Total chunks must be between 1 and 10");
    }
    const chunkSize = Math.floor(fileSize / totalChunks);1
    const start = (chunkNumber - 1) * chunkSize;
    const end = chunkNumber === totalChunks ? fileSize - 1 : start + chunkSize - 1;
    return { start, end, chunkSize: end - start + 1 };
};


const getVideoInfoService = async (filename, videoID) => {
    const { fileSize, filename: videoFilename } = await getVideoFilePathAndStats(filename, videoID);

    const recommendedChunks = fileSize > 500 * 1024 * 1024 ? 4 : fileSize > 200 * 1024 * 1024 ? 2 : 1;

    return {
        filename: videoFilename,
        totalSize: fileSize,
        totalSizeMB: (fileSize / (1024 * 1024)).toFixed(2),
        recommendedChunks,
        maxChunks: 10
    };
};

const downloadChunkService = async (filename, videoID, chunkNumber, totalChunks) => {
    const { filePath, fileSize, filename: videoFilename } = await getVideoFilePathAndStats(filename, videoID);
    const { start, end, chunkSize } = calculateChunkRange(fileSize, chunkNumber, totalChunks);

    const fileStream = fs.createReadStream(filePath, { start, end });

    return {
        fileStream,
        start,
        end,
        chunkSize,
        totalSize: fileSize,
        filename: videoFilename,
        chunkNumber,
        totalChunks
    };
};

module.exports = {
    getVideoInfoService,
    downloadChunkService
};
