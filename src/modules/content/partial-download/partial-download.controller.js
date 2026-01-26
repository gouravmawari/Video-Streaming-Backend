const { getVideoInfoService, downloadChunkService } = require("./partial-download.service");
let AppError = require("../../../common/utils/error")
let catctAsync = require("../../../common/utils/catchAsync")

const getVideoInfo = catctAsync(async (req, res) => {
    const { filename, videoID } = req.body;
    if (!filename || !videoID) {
        throw new AppError("filename and videoID are required",400);
    }
        const info = await getVideoInfoService(filename, videoID);
        return res.status(200).json({
            success: true,
            data: info
        });
});

const downloadChunk = catctAsync(async (req, res) => {
    const { filename, videoID, chunkNumber, totalChunks } = req.body;

    if (!filename || !videoID || !chunkNumber || !totalChunks) {
        throw new AppError("filename, videoID, chunkNumber, and totalChunks are required",400);
    }

    const chunkNum = parseInt(chunkNumber);
    const totalChunk = parseInt(totalChunks);

    if (isNaN(chunkNum) || isNaN(totalChunk)) {
        throw new AppError("chunkNumber and totalChunks must be valid numbers",400);
    }
        const { fileStream, start, end, chunkSize, totalSize, filename: videoFilename, chunkNumber: chunk, totalChunks: total } =
            await downloadChunkService(filename, videoID, chunkNum, totalChunk);

        fileStream.on("error", (err) => {
            console.error("File stream error:", err);
            throw new AppError("Error reading file",500);
        });

        const extension = videoFilename.split('.').pop();
        const baseFilename = videoFilename.replace(`.${extension}`, '');
        const partFilename = `${baseFilename}_part${chunk}_of_${total}.${extension}`;

        res.setHeader("Content-Disposition", `attachment; filename="${partFilename}"`);
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Length", chunkSize);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${totalSize}`);
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("X-Chunk-Number", chunk);
        res.setHeader("X-Total-Chunks", total);

        fileStream.pipe(res);
})

module.exports = {
    getVideoInfo,
    downloadChunk
};
