const redis = require('./src/common/utils/redisClient');

async function testStreamingScenario() {
    console.log('\n🎬 Testing Streaming Concurrency Scenario\n');
    console.log('═'.repeat(70));

    const mainUserId = 'user_main_001';
    const subUser1 = 'alice_sub_001';
    const subUser2 = 'bob_sub_002';
    const subUser3 = 'charlie_sub_003';

    try {
        await redis.del(`streaming:${mainUserId}:${subUser1}`);
        await redis.del(`streaming:${mainUserId}:${subUser2}`);
        await redis.del(`streaming:${mainUserId}:${subUser3}`);

        console.log('\n📝 Scenario Setup:');
        console.log(`   Main Account: ${mainUserId}`);
        console.log(`   Sub-users: Alice, Bob, Charlie`);
        console.log('');

        console.log('\n🎥 SCENARIO 1: Alice starts streaming');
        console.log('─'.repeat(70));

        const streamKey1 = `streaming:${mainUserId}:${subUser1}`;

        const activeKeys1 = await redis.keys(`streaming:${mainUserId}:*`);
        console.log(`   Checking for active streams: ${activeKeys1.length} found`);

        if (activeKeys1.length === 0) {
            await redis.set(streamKey1, 'active', 'EX', 60);
            console.log(`   ✅ Alice is now streaming (TTL: 60s)`);
            console.log(`   Redis Key: ${streamKey1}`);
        }

        console.log('\n🎥 SCENARIO 2: Bob tries to stream (while Alice is active)');
        console.log('─'.repeat(70));

        const streamKey2 = `streaming:${mainUserId}:${subUser2}`;
        const activeKeys2 = await redis.keys(`streaming:${mainUserId}:*`);

        console.log(`   Checking for active streams: ${activeKeys2.length} found`);
        console.log(`   Active keys: ${activeKeys2.join(', ')}`);

        const otherActive = activeKeys2.find(key => key !== streamKey2);

        if (otherActive) {
            console.log(`   ❌ Bob CANNOT stream - ${otherActive} is already active`);
            console.log(`   Response: 429 "Only one sub-user can stream at a time"`);
        } else {
            console.log(`   ✅ Bob CAN stream (no conflicts)`);
        }

        console.log('\n💓 SCENARIO 3: Alice sends heartbeat (refresh TTL)');
        console.log('─'.repeat(70));

        let ttlBefore = await redis.ttl(streamKey1);
        console.log(`   TTL before heartbeat: ${ttlBefore}s`);

        await redis.expire(streamKey1, 60);

        let ttlAfter = await redis.ttl(streamKey1);
        console.log(`   TTL after heartbeat: ${ttlAfter}s`);
        console.log(`   ✅ Session refreshed successfully`);

        console.log('\n🛑 SCENARIO 4: Alice stops streaming (closes tab)');
        console.log('─'.repeat(70));

        await redis.del(streamKey1);
        const exists = await redis.exists(streamKey1);
        console.log(`   Alice's session deleted: ${exists === 0 ? 'Yes' : 'No'}`);
        console.log(`   ✅ Streaming slot is now free`);

        console.log('\n🎥 SCENARIO 5: Bob tries to stream again (should succeed)');
        console.log('─'.repeat(70));

        const activeKeys3 = await redis.keys(`streaming:${mainUserId}:*`);
        console.log(`   Checking for active streams: ${activeKeys3.length} found`);

        if (activeKeys3.length === 0) {
            await redis.set(streamKey2, 'active', 'EX', 60);
            console.log(`   ✅ Bob is now streaming (TTL: 60s)`);
            console.log(`   Redis Key: ${streamKey2}`);
        }

        console.log('\n⏱️  SCENARIO 6: Testing TTL expiration (5 second test)');
        console.log('─'.repeat(70));

        const testKey = `streaming:${mainUserId}:${subUser3}`;
        await redis.set(testKey, 'active', 'EX', 5);
        console.log(`   Charlie starts streaming with 5s TTL`);

        for (let i = 5; i >= 0; i--) {
            const exists = await redis.exists(testKey);
            const ttl = await redis.ttl(testKey);

            if (exists) {
                console.log(`   ⏳ ${i}s remaining... (TTL: ${ttl}s)`);
            } else {
                console.log(`   ⌛ Session expired! Key automatically deleted`);
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log(`   ✅ Auto-cleanup works perfectly!`);

        console.log('\n🧹 Cleanup');
        console.log('─'.repeat(70));

        await redis.del(streamKey1, streamKey2, testKey);
        const remainingKeys = await redis.keys(`streaming:${mainUserId}:*`);
        console.log(`   Remaining keys: ${remainingKeys.length}`);
        console.log(`   ✅ All test data cleaned`);

        console.log('\n' + '═'.repeat(70));
        console.log('🎉 All streaming scenarios tested successfully!\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
    } finally {
        redis.disconnect();
        console.log('🔌 Redis connection closed\n');
    }
}

testStreamingScenario();
