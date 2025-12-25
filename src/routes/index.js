const express = require('express');
const { authMiddleware } = require('../common/middleware/authMiddleware');
const apiLimiter = require('../common/middleware/ratelimit')
const { upload } = require('../common/middleware/multerMiddleware');
const {create_series_val,login,uploadMovieValidator,upload_ser_Validator,register,subUserRegister} = require("../common/validators/index");
const {validate} = require("../common/middleware/validate");
const authController = require('../modules/auth/auth.controller');
const contentSeriesController = require('../modules/content/series/series.controller');
const contentMoviesController = require('../modules/content/movies/movies.controller');
const streamingController = require('../modules/streaming/streaming.controller');
const progressController = require('../modules/progress/progress.controller');
const partialDownloadController = require('../modules/content/partial-download/partial-download.controller');

const router = express.Router();

router.post('/auth/register',register,validate,authController.register);
router.post('/auth/login', apiLimiter,login,validate,authController.login);
router.post('/auth/subuser',subUserRegister,validate,authController.subUser);

router.post('/content/upload',validate,upload.single('video'),uploadMovieValidator, contentMoviesController.uploadMovie);
router.post('/content/series', authMiddleware,validate,contentSeriesController.createSeries);

router.get('/stream/:videoID/:subUserId/:userId',validate,streamingController.streamVideo);
router.post('/stream/heartbeat', streamingController.heartBeat);
router.post('/stream/end', streamingController.endStream);

router.post('/video/progress', progressController.saveProgress);
router.get('/video/progress/:videoId', progressController.getProgress);
router.post('/video/progress/sync', progressController.syncProgress);
router.get('/video/continue-watching', progressController.getContinueWatching);

router.post('/download/info', partialDownloadController.getVideoInfo);
router.post('/download/chunk', partialDownloadController.downloadChunk);

module.exports = router;
