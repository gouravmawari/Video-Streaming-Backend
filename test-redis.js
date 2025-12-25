const redis = require('./src/common/utils/redisClient');

async function testRedis() {
    console.log('\n🔍 Testing Redis Connection and Operations...\n');

    try {
        console.log('Test 1: Ping Redis');
        const pingResult = await redis.ping();
        console.log(`✅ Ping result: ${pingResult}\n`);

        console.log('Test 2: SET operation');
        await redis.set('test:key', 'Hello Redis!');
        console.log('✅ Key set successfully\n');

        console.log('Test 3: GET operation');
        const value = await redis.get('test:key');
        console.log(`✅ Retrieved value: ${value}\n`);

        console.log('Test 4: SET with TTL (expires in 10 seconds)');
        await redis.set('test:expiring', 'I will expire', 'EX', 10);
        const ttl = await redis.ttl('test:expiring');
        console.log(`✅ Key set with TTL: ${ttl} seconds remaining\n`);

        console.log('Test 5: KEYS pattern matching');
        await redis.set('streaming:user1:sub1', 'active', 'EX', 60);
        await redis.set('streaming:user1:sub2', 'active', 'EX', 60);
        await redis.set('streaming:user2:sub1', 'active', 'EX', 60);

        const streamKeys = await redis.keys('streaming:user1:*');
        console.log(`✅ Found keys for user1: ${streamKeys.join(', ')}\n`);

        console.log('Test 6: EXISTS check');
        const exists = await redis.exists('streaming:user1:sub1');
        console.log(`✅ Key exists: ${exists === 1 ? 'Yes' : 'No'}\n`);

        console.log('Test 7: DEL operation');
        const deleted = await redis.del('streaming:user1:sub1');
        console.log(`✅ Keys deleted: ${deleted}\n`);

        console.log('Test 8: Verify deletion');
        const remainingKeys = await redis.keys('streaming:user1:*');
        console.log(`✅ Remaining keys for user1: ${remainingKeys.join(', ')}\n`);

        console.log('Test 9: Simulate concurrent stream check');
        const userId = 'main123';
        const subUserId1 = 'sub456';
        const subUserId2 = 'sub789';

        const streamKey1 = `streaming:${userId}:${subUserId1}`;
        await redis.set(streamKey1, 'active', 'EX', 60);
        console.log(`✅ Sub-user 1 started streaming: ${streamKey1}`);

        const activeKeys = await redis.keys(`streaming:${userId}:*`);
        const streamKey2 = `streaming:${userId}:${subUserId2}`;
        const otherActive = activeKeys.find(key => key !== streamKey2);

        if (otherActive) {
            console.log(`❌ Sub-user 2 CANNOT stream - ${otherActive} is active`);
        } else {
            console.log(`✅ Sub-user 2 CAN stream - no conflicts`);
        }
        console.log('');

        console.log('Test 10: Cleanup');
        await redis.del('test:key', 'test:expiring', 'streaming:user1:sub2', 'streaming:user2:sub1', streamKey1);
        console.log('✅ Test keys cleaned up\n');

        console.log('🎉 All Redis tests passed successfully!\n');

    } catch (error) {
        console.error('❌ Redis test failed:', error);
    } finally {
        redis.disconnect();
        console.log('🔌 Redis connection closed');
    }
}

testRedis();
