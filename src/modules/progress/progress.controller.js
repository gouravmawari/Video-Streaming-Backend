const {
    saveProgressService,
    getProgressService,
    syncProgressToDBService,
    getContinueWatchingService
} = require('./progress.service');

const saveProgress = async (req, res) => {
    try {
        const { userId, subUserId, videoId, currentTime, videoModel } = req.body;

        if (!userId || !subUserId || !videoId || currentTime === undefined) {
            return res.status(400).json({
                error: 'Missing required fields: userId, subUserId, videoId, currentTime'
            });
        }

        if (typeof currentTime !== 'number' || currentTime < 0) {
            return res.status(400).json({
                error: 'currentTime must be a positive number (seconds)'
            });
        }

        const result = await saveProgressService(userId, subUserId, videoId, currentTime, videoModel);

        res.status(200).json({
            success: true,
            message: 'Progress saved',
            data: result
        });

    } catch (error) {
        console.error('Error in saveProgress controller:', error);
        res.status(500).json({
            error: 'Failed to save progress',
            message: error.message
        });
    }
};

const getProgress = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { userId, subUserId } = req.query;

        if (!userId || !subUserId || !videoId) {
            return res.status(400).json({
                error: 'Missing required parameters: userId, subUserId, videoId'
            });
        }

        const result = await getProgressService(userId, subUserId, videoId);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error in getProgress controller:', error);
        res.status(500).json({
            error: 'Failed to get progress',
            message: error.message
        });
    }
};

const syncProgress = async (req, res) => {
    try {
        const { userId, subUserId, videoId } = req.body;

        if (!userId || !subUserId || !videoId) {
            return res.status(400).json({
                error: 'Missing required fields: userId, subUserId, videoId'
            });
        }

        const result = await syncProgressToDBService(userId, subUserId, videoId);

        res.status(200).json({
            success: true,
            message: 'Progress synced to database',
            data: result
        });

    } catch (error) {
        console.error('Error in syncProgress controller:', error);
        res.status(500).json({
            error: 'Failed to sync progress',
            message: error.message
        });
    }
};

const getContinueWatching = async (req, res) => {
    try {
        const { userId, subUserId } = req.query;

        if (!userId || !subUserId) {
            return res.status(400).json({
                error: 'Missing required parameters: userId, subUserId'
            });
        }

        const result = await getContinueWatchingService(userId, subUserId);

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });

    } catch (error) {
        console.error('Error in getContinueWatching controller:', error);
        res.status(500).json({
            error: 'Failed to get continue watching list',
            message: error.message
        });
    }
};

module.exports = {
    saveProgress,
    getProgress,
    syncProgress,
    getContinueWatching
};
