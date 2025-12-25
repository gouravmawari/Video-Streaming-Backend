const fs = require("fs");
const { getVideoFilePath } = require("./download.service");

const downloadVideo = async (req, res) => {
    const { filename, videoID } = req.body;

    try {
        const filePath = await getVideoFilePath(filename, videoID);
        const fileStream = fs.createReadStream(filePath);
        fileStream.on("error", (err) => {
            console.error("File stream error:", err);
            return res.status(500).json({ message: "Error reading file" });
        });
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/octet-stream");
        fileStream.pipe(res);
    } catch (err) {
        console.error("Download error:", err.message);
        res.status(404).json({ message: err.message });
    }
};

module.exports = { downloadVideo };
