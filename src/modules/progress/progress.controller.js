const {
    saveProgressService,
    getProgressService,
    syncProgressToDBService,
    getContinueWatchingService
} = require('./progress.service');
const catchAsync = require("../../common/utils/catchAsync");
const AppError = require("../../common/utils/error")

const saveProgress = catchAsync(async (req, res) => {
  const { userId, subUserId, videoId, currentTime, videoModel } = req.body;
  if (!userId || !subUserId || !videoId || currentTime === undefined) {
    throw new AppError(
      "Missing required fields: userId, subUserId, videoId, currentTime",
      400
    );
  }
  if (typeof currentTime !== 'number' || currentTime < 0) {
    throw new AppError(
      "currentTime must be a positive number (seconds)",
      400
    );
  }
  const result = await saveProgressService(
    userId,
    subUserId,
    videoId,
    currentTime,
    videoModel
  );
  return res.status(200).json({
    success: true,
    message: 'Progress saved',
    data: result
  });
});

const getProgress = catchAsync(async (req, res) => {
        const { videoId } = req.params;
        const { userId, subUserId } = req.query;
        if (!userId || !subUserId || !videoId) {
            throw new AppError(
            "Missing required parameters: userId, subUserId, videoId",
            400
            );
        }
        const result = await getProgressService(userId, subUserId, videoId);
        return res.status(200).json({
            success: true,
            data: result
        });
});

const syncProgress = catchAsync(async (req, res) => {
        const { userId, subUserId, videoId } = req.body;

        if (!userId || !subUserId || !videoId) {
            throw new AppError(
            'Missing required fields: userId, subUserId, videoId',
            400
            );
        }

        const result = await syncProgressToDBService(userId, subUserId, videoId);

        return res.status(200).json({
            success: true,
            message: 'Progress synced to database',
            data: result
        });

});

const getContinueWatching = catchAsync(async (req, res) => {
        const { userId, subUserId } = req.query;
        if (!userId || !subUserId) {
            throw new AppError(
            'Missing required parameters: userId, subUserId',
            400
            );
        }
        const result = await getContinueWatchingService(userId, subUserId);
        return res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });
})

module.exports = {
    saveProgress,
    getProgress,
    syncProgress,
    getContinueWatching
};
