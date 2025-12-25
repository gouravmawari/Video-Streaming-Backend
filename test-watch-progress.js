
const axios = require('axios');

const BASE_URL = 'http://localhost:8888/api';
const testData = {
    userId: 'parent123',
    subUserId: 'subUser1',
    videoId: 'movie123',
    videoModel: 'Video'
};

async function testWatchProgress() {
    console.log('\n🎬 Testing Watch Progress Feature\n');
    console.log('=' .repeat(60));

    try {
        console.log('\n✅ Test 1: Save watch progress (currentTime: 330 seconds)');
        const saveResponse = await axios.post(`${BASE_URL}/video/progress`, {
            userId: testData.userId,
            subUserId: testData.subUserId,
            videoId: testData.videoId,
            currentTime: 330,
            videoModel: testData.videoModel
        });
        console.log('Response:', saveResponse.data);

        console.log('\n✅ Test 2: Get watch progress');
        const getResponse = await axios.get(`${BASE_URL}/video/progress/${testData.videoId}`, {
            params: {
                userId: testData.userId,
                subUserId: testData.subUserId
            }
        });
        console.log('Response:', getResponse.data);

        // Test 3: Update Progress (simulate user watching more)
        console.log('\n✅ Test 3: Update progress (currentTime: 450 seconds)');
        const updateResponse = await axios.post(`${BASE_URL}/video/progress`, {
            userId: testData.userId,
            subUserId: testData.subUserId,
            videoId: testData.videoId,
            currentTime: 450,
            videoModel: testData.videoModel
        });
        console.log('Response:', updateResponse.data);

        // Test 4: Sync to MongoDB
        console.log('\n✅ Test 4: Sync progress to MongoDB');
        const syncResponse = await axios.post(`${BASE_URL}/video/progress/sync`, {
            userId: testData.userId,
            subUserId: testData.subUserId,
            videoId: testData.videoId
        });
        console.log('Response:', syncResponse.data);

        // Test 5: Continue Watching List
        console.log('\n✅ Test 5: Get Continue Watching list');
        const continueResponse = await axios.get(`${BASE_URL}/video/continue-watching`, {
            params: {
                userId: testData.userId,
                subUserId: testData.subUserId
            }
        });
        console.log('Response:', continueResponse.data);

        // Test 6: End Stream (should sync to MongoDB)
        console.log('\n✅ Test 6: End stream (auto-sync to MongoDB)');
        const endResponse = await axios.post(`${BASE_URL}/stream/end`, {
            userId: testData.userId,
            subUserId: testData.subUserId,
            videoId: testData.videoId
        });
        console.log('Response:', endResponse.data);

        console.log('\n' + '='.repeat(60));
        console.log('🎉 All tests passed successfully!\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
    }
}

// Run tests
testWatchProgress();
