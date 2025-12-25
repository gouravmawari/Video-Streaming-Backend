const redis = require('./src/common/utils/redisClient');

async function monitorRedis() {
    console.log('\n📊 Redis Monitoring Dashboard\n');
    console.log('Press Ctrl+C to stop monitoring\n');
    console.log('─'.repeat(60));

    setInterval(async () => {
        try {
            // Get Redis info
            const info = await redis.info('server');
            const memory = await redis.info('memory');

            // Get all streaming keys
            const streamingKeys = await redis.keys('streaming:*');

            // Get server stats
            const dbSize = await redis.dbsize();

            console.clear();
            console.log('\n📊 Redis Monitoring Dashboard - ' + new Date().toLocaleTimeString());
            console.log('═'.repeat(60));

            console.log('\n🔌 Connection Status:');
            console.log(`   Status: ${redis.status === 'ready' ? '✅ Connected' : '❌ Disconnected'}`);
            console.log(`   Total Keys: ${dbSize}`);

            console.log('\n🎬 Active Streaming Sessions:');
            if (streamingKeys.length === 0) {
                console.log('   No active streams');
            } else {
                for (const key of streamingKeys) {
                    const ttl = await redis.ttl(key);
                    const value = await redis.get(key);
                    const [, userId, subUserId] = key.split(':');
                    console.log(`   👤 User: ${userId} | Sub: ${subUserId} | TTL: ${ttl}s | Status: ${value}`);
                }
            }

            console.log('\n📈 Memory Usage:');
            const memoryMatch = memory.match(/used_memory_human:(.+)/);
            if (memoryMatch) {
                console.log(`   Memory Used: ${memoryMatch[1].trim()}`);
            }

            console.log('\n🔍 All Keys in Database:');
            const allKeys = await redis.keys('*');
            if (allKeys.length === 0) {
                console.log('   Database is empty');
            } else {
                for (const key of allKeys) {
                    const type = await redis.type(key);
                    const ttl = await redis.ttl(key);
                    const ttlDisplay = ttl === -1 ? 'No expiry' : `${ttl}s`;
                    console.log(`   ${key} [${type}] - TTL: ${ttlDisplay}`);
                }
            }

            console.log('\n' + '─'.repeat(60));
            console.log('Refreshing every 2 seconds... (Ctrl+C to stop)');

        } catch (error) {
            console.error('❌ Monitoring error:', error.message);
        }
    }, 2000);
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping monitor...');
    redis.disconnect();
    process.exit(0);
});

monitorRedis();
