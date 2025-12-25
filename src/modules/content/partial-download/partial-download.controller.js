const { getVideoInfoService, downloadChunkService } = require("./partial-download.service");

const getVideoInfo = async (req, res) => {
    const { filename, videoID } = req.body;

    if (!filename || !videoID) {
        return res.status(400).json({ message: "filename and videoID are required" });
    }

    try {
        const info = await getVideoInfoService(filename, videoID);
        res.status(200).json({
            success: true,
            data: info
        });
    } catch (err) {
        console.error("Get video info error:", err.message);
        res.status(404).json({ message: err.message });
    }
};

const downloadChunk = async (req, res) => {
    const { filename, videoID, chunkNumber, totalChunks } = req.body;

    if (!filename || !videoID || !chunkNumber || !totalChunks) {
        return res.status(400).json({
            message: "filename, videoID, chunkNumber, and totalChunks are required"
        });
    }

    const chunkNum = parseInt(chunkNumber);
    const totalChunk = parseInt(totalChunks);

    if (isNaN(chunkNum) || isNaN(totalChunk)) {
        return res.status(400).json({
            message: "chunkNumber and totalChunks must be valid numbers"
        });
    }

    try {
        const { fileStream, start, end, chunkSize, totalSize, filename: videoFilename, chunkNumber: chunk, totalChunks: total } =
            await downloadChunkService(filename, videoID, chunkNum, totalChunk);

        fileStream.on("error", (err) => {
            console.error("File stream error:", err);
            return res.status(500).json({ message: "Error reading file" });
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
    } catch (err) {
        console.error("Download chunk error:", err.message);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getVideoInfo,
    downloadChunk
};
