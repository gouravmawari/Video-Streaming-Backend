const { uploadMovieService } = require('./movies.service');

const uploadMovie = async (req, res) => {
  try {
    const { filename, path: filePath, size } = req.file;
    const { Name, Discription } = req.body;
    console.log(Name);
    console.log(filename);
    const response = await uploadMovieService(Name, filename, filePath, size, Discription);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error in uploadMovie:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadMovie };
