const fs = require("fs");
const path = require("path");
const redis = require("../../common/utils/redisClient");
const Video = require("../../database/models/Video");
const SeriesVideo = require("../../database/models/SeriesVideo");
const SubUser = require("../../database/models/SubUser");
const { syncProgressToDBService } = require("../progress/progress.service");
const verifyStreamToken = require("../../common/utils/streamToken");
const catchAsync = require("../../common/utils/catchAsync");
const AppError = require("../../common/utils/error");
let SECRET = "lund_lele";
const crypto = require('crypto');

const streamVideoService = catchAsync( async (req, res) => {
  
        const { signature } = req.params;
        let payload = verifyStreamToken(signature);
        let videoID =payload.videoID;
        let subUserId = payload.subUserId;
        let userId = payload.userId;

        const isSeries = videoID.includes("series_");
        const video = isSeries
            ? await SeriesVideo.findOne({ CustomId: videoID })
            : await Video.findOne({ CustomId: videoID });

        if (!video || !video.filename){
          throw new AppError("Video not found",404);
        }

        const streamKey = `streaming:${userId}:${subUserId}`;
        const activeKeys = await redis.keys(`streaming:${userId}:*`);

        const otherActive = activeKeys.find(key => key !== streamKey);
        if (otherActive) {
            // return res.status(429).json({
            //     message: "Only one sub-user can stream at a time for this account.",
            //     activeStream: otherActive
            // });
            throw new AppError("Only one sub-user can stream at a time for this account.",429);
        }

        const result = await redis.set(streamKey, "active", "EX", 60, "NX");
        if (result === null) {
            console.log("Stream key already exists for this user");
        } else {
            console.log(`Redis SET result: ${result} - Stream started for ${streamKey}`);
        }

        const updateField = isSeries ? "Watched_Series" : "Watched_Movies";
        await SubUser.findByIdAndUpdate(subUserId, { $addToSet: { [updateField]: video._id } });

        const videoPath = path.join(__dirname, "../../movies", video.filename);
        const stats = fs.statSync(videoPath);
        const videoSize = stats.size;

        const range = req.headers.range;
        if (!range) return res.status(416).send("Range header required");

        const CHUNK_SIZE = 10 ** 7;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);

        const stream = fs.createReadStream(videoPath, { start, end });
        stream.pipe(res);

        const cleanup = async () => {
            console.log(`Cleaning up Redis key: ${streamKey}`);
            await redis.del(streamKey);
        };

        if (end === videoSize - 1) {
            stream.on("end", cleanup);
        }

        stream.on("error", async (err) => {
            console.error("Stream error:", err);
            await cleanup();
            res.end();
        });
});

const heartBeatService = async (userId, subUserId) => {
  const streamKey = `streaming:${userId}:${subUserId}`;
  const exists = await redis.exists(streamKey);
  if (exists) {
    await redis.expire(streamKey, 60);
    return { status: 200, data: { message: "TTL refreshed" } };
  }
  return { status: 404, data: { message: "Stream not found" } };
};

const endStreamService = async (userId, subUserId, videoId) => {
  const streamKey = `streaming:${userId}:${subUserId}`;
  await redis.del(streamKey);

  if (videoId) {
    try {
      await syncProgressToDBService(userId, subUserId, videoId);
      console.log(`Watch progress synced to MongoDB for ${userId}:${subUserId}:${videoId}`);
    } catch (error) {
      console.error('Error syncing progress to MongoDB:', error.message);
    }
  }

  return { status: 200, data: { message: "Stream ended" } };
};



const presignUrlService = async (videoId, subUserId, userId) => {
  const payload = {
    videoId: videoId,
    subUserId: subUserId,
    userId: userId,
    exp: Date.now() + 30 * 60 * 1000, // 30 minutes
    startTime: Date.now()
  };

  const data = Buffer
    .from(JSON.stringify(payload))
    .toString('base64');

  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest('hex');

  return `${data}.${signature}`;
};

module.exports = presignUrlService;


module.exports = { streamVideoService, heartBeatService, endStreamService };
