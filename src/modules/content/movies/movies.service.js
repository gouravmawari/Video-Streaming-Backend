const Video = require('../../../database/models/Video');

const uploadMovieService = async (Name, filename, filePath, size, Discription) => {
  const movie = new Video({ Name, filename, path: filePath, size, Discription });
  await movie.save();
  return {
    status: 201,
    data: { message: 'Movie uploaded successfully', movie },
  };
};  

module.exports = { uploadMovieService };
