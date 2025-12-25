const redis = require("../../common/utils/redisClient");
const WatchProgress = require("../../database/models/WatchProgress");

const saveProgressService = async (userId, subUserId, videoId, currentTime, videoModel) => {
    try {
        const progressKey = `progress:${userId}:${subUserId}:${videoId}`;
        await redis.set(progressKey, currentTime, 'EX', 604800);
        await redis.set(`${progressKey}:model`, videoModel, 'EX', 604800);
        console.log(`Progress saved to Redis: ${progressKey} = ${currentTime}s`);
        return { success: true, currentTime };
    } catch (error) {
        console.error('Error saving progress to Redis:', error);
        throw error;
    }
};

const getProgressService = async (userId, subUserId, videoId) => {
    try {
        const progressKey = `progress:${userId}:${subUserId}:${videoId}`;
        const redisProgress = await redis.get(progressKey);

        if (redisProgress !== null) {
            console.log(`Progress found in Redis: ${progressKey} = ${redisProgress}s`);
            return { currentTime: parseInt(redisProgress), source: 'redis' };
        }

        console.log(`Progress not in Redis, checking MongoDB...`);
        const dbProgress = await WatchProgress.findOne({
            parentId: userId,
            subUserId: subUserId,
            videoId: videoId
        });

        if (dbProgress) {
            const currentTime = dbProgress.resumeTime || 0;
            await redis.set(progressKey, currentTime, 'EX', 604800);
            console.log(`Progress found in MongoDB: ${currentTime}s`);
            return { currentTime, source: 'mongodb' };
        }

        console.log(`No progress found for ${progressKey}`);
        return { currentTime: 0, source: 'none' };

    } catch (error) {
        console.error('Error getting progress:', error);
        throw error;
    }
};

const syncProgressToDBService = async (userId, subUserId, videoId) => {
    try {
        const progressKey = `progress:${userId}:${subUserId}:${videoId}`;
        const currentTime = await redis.get(progressKey);
        const videoModel = await redis.get(`${progressKey}:model`);

        if (currentTime === null) {
            console.log(`No progress to sync for ${progressKey}`);
            return { success: false, message: 'No progress found in Redis' };
        }

        const result = await WatchProgress.findOneAndUpdate(
            {
                parentId: userId,
                subUserId: subUserId,
                videoId: videoId
            },
            {
                parentId: userId,
                subUserId: subUserId,
                videoId: videoId,
                videoModel: videoModel || 'Video',
                resumeTime: parseInt(currentTime),
                lastWatched: new Date()
            },
            {
                upsert: true,
                new: true
            }
        );

        console.log(`Progress synced to MongoDB: ${progressKey} = ${currentTime}s`);
        return { success: true, data: result };

    } catch (error) {
        console.error('Error syncing progress to MongoDB:', error);
        throw error;
    }
};

const getContinueWatchingService = async (userId, subUserId) => {
    try {
        const pattern = `progress:${userId}:${subUserId}:*`;
        const keys = await redis.keys(pattern);
        const continueWatching = [];

        for (const key of keys) {
            if (key.endsWith(':model')) continue;

            const currentTime = await redis.get(key);
            const videoId = key.split(':')[3];

            if (currentTime && parseInt(currentTime) > 0) {
                continueWatching.push({
                    videoId,
                    currentTime: parseInt(currentTime)
                });
            }
        }

        console.log(`Found ${continueWatching.length} videos in progress for user ${userId}, subUser ${subUserId}`);
        return continueWatching;

    } catch (error) {
        console.error('Error getting continue watching list:', error);
        throw error;
    }
};

module.exports = {
    saveProgressService,
    getProgressService,
    syncProgressToDBService,
    getContinueWatchingService
};
