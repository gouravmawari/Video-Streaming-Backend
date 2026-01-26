const { streamVideoService, heartBeatService, endStreamService } = require('./streaming.service');

const streamVideo = async (req, res) => {
  await streamVideoService(req, res);
};

const heartBeat = async (req, res) => {
  const { userId, subUserId } = req.body;
  const result = await heartBeatService(userId, subUserId);
  res.status(result.status).json(result.data);
};

const presignURL = async(req,res)=>{
  const {videoID, subUserId, userId} = req.body;
  const response = await presignUrlService(videoId,subuserId);
  res.status()
}

const endStream = async (req, res) => {
  const { userId, subUserId, videoId } = req.body;
  const result = await endStreamService(userId, subUserId, videoId);
  res.status(result.status).json(result.data);
};

module.exports = { streamVideo, heartBeat, endStream };
