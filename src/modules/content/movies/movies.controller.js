const { uploadMovieService } = require('./movies.service');
let AppError = require("../../../common/utils/error")
let catchAsync = require("../../../common/utils/catchAsync")

const uploadMovie =catchAsync( async (req, res) => {
    const { filename, path: filePath, size } = req.file;
    const { Name, Discription } = req.body;
    const response = await uploadMovieService(Name, filename, filePath, size, Discription);
    return res.status(response.status).json(response.data);
});

module.exports = { uploadMovie };
