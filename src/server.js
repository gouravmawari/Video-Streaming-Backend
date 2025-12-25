require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const redis = require('./common/utils/redisClient');
const routes = require('./routes');

const app = express();
const PORT = prccess.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const gracefulShutdown = async () => {
  console.log('\nShutting down gracefully...');

  try {
    server.close(() => {
      console.log('HTTP server closed');
    });

    await redis.quit();
    console.log('Redis connection closed');

    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
