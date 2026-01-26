const Redis = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false
});

// const redis = new Redis({
//   host: process.env.REDIS_HOST || "redis", // service name
//   port: process.env.REDIS_PORT || 6379,
//     retryStrategy(times) {
//         const delay = Math.min(times * 50, 2000);
//         return delay;
//     },
//     maxRetriesPerRequest: 3,
//     enableReadyCheck: true,
//     lazyConnect: false
// });



redis.on('connect', () => {
    console.log('✅ Redis client connected successfully');
});

redis.on('ready', () => {
    console.log('✅ Redis client ready to accept commands');
});

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

redis.on('close', () => {
    console.log('🔌 Redis connection closed');
});

redis.on('reconnecting', () => {
    console.log('🔄 Reconnecting to Redis...');
});

module.exports = redis;