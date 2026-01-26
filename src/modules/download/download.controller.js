const fs = require("fs");
const { getVideoFilePath } = require("./download.service");
let AppError = require("../../../common/utils/error")
let catctAsync = require("../../../common/utils/catchAsync")
const downloadVideo = catctAsync (async (req, res) => {
    const { filename, videoID } = req.body;
        const filePath = await getVideoFilePath(filename, videoID);
        const fileStream = fs.createReadStream(filePath);
        fileStream.on("error", (err) => {
            throw new AppError("Error reading file",500);
        });
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/octet-stream");
        fileStream.pipe(res);
});

module.exports = { downloadVideo };
