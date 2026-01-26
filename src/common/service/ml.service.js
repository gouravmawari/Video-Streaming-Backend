const axios = require("axios");
const catchAsync = require("../../common/utils/catchAsync");
const AppError = require("../../common/utils/error");
const ML_API_BASE_URL = process.env.ML_API_BASE_URL;

if (!ML_API_BASE_URL) {
  throw new Error("ML_API_BASE_URL is not defined in environment variables");
}
const mlCall = catchAsync(async (req, res) => {
  const { userID, movies } = req.query;

  if (!userID || !movies) {
    throw new AppError("userID and movies not given", 400);
  }

   const result = await axios.get(
    `${ML_API_BASE_URL}/recommend/${userID}?n=${movies}`,
    { timeout: 5000 } 
  );

  if (!result || !result.data) {
    throw new AppError("ML service did not return data", 502);
  }

  return res.status(200).json({
    success: true,
    data: result.data
  });
});

module.exports = mlCall;
