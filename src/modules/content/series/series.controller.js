const { createSeriesService, addEpisodeToSeriesService } = require('./series.service');

const createSeries = async (req, res) => {
  try {
    const { name, Discription, season } = req.body;
    const response = await createSeriesService(name, Discription, season);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error in createSeries:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const addEpisodeToSeries = async (req, res) => {
  try {
    const { filename, path: filePath, size } = req.file;
    const { Discription, series_name } = req.body;
    const response = await addEpisodeToSeriesService(filename, filePath, size, Discription, series_name);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error in addEpisodeToSeries:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createSeries, addEpisodeToSeries };
