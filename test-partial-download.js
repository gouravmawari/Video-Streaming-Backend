const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

const testPartialDownload = async () => {
    console.log('========== Testing Partial Download API ==========\n');

    const testData = {
        filename: 'your-video-name.mp4',
        videoID: 'your-video-id'
    };

    console.log('Test 1: Get Video Info');
    try {
        const infoResponse = await axios.post(`${BASE_URL}/download/info`, testData);
        console.log('✅ Video Info Response:');
        console.log(JSON.stringify(infoResponse.data, null, 2));
        console.log('\n');

        const { recommendedChunks, totalSizeMB } = infoResponse.data.data;
        console.log(`Video Size: ${totalSizeMB} MB`);
        console.log(`Recommended Chunks: ${recommendedChunks}\n`);

        console.log('Test 2: Download Chunk 1 of 4');
        const chunk1Response = await axios.post(`${BASE_URL}/download/chunk`, {
            ...testData,
            chunkNumber: 1,
            totalChunks: 4
        }, {
            responseType: 'stream'
        });

        console.log('✅ Chunk 1 Headers:');
        console.log(`Content-Range: ${chunk1Response.headers['content-range']}`);
        console.log(`Content-Length: ${chunk1Response.headers['content-length']} bytes`);
        console.log(`X-Chunk-Number: ${chunk1Response.headers['x-chunk-number']}`);
        console.log(`X-Total-Chunks: ${chunk1Response.headers['x-total-chunks']}`);

        const outputPath = path.join(__dirname, 'downloaded_part1.mp4');
        const writer = fs.createWriteStream(outputPath);
        chunk1Response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log(`✅ Chunk 1 saved to: ${outputPath}\n`);

        console.log('Test 3: Download Chunk 2 of 4');
        const chunk2Response = await axios.post(`${BASE_URL}/download/chunk`, {
            ...testData,
            chunkNumber: 2,
            totalChunks: 4
        }, {
            responseType: 'stream'
        });

        console.log('✅ Chunk 2 Headers:');
        console.log(`Content-Range: ${chunk2Response.headers['content-range']}`);
        console.log(`Content-Length: ${chunk2Response.headers['content-length']} bytes\n`);

        console.log('Test 4: Try Invalid Chunk Number (should fail)');
        try {
            await axios.post(`${BASE_URL}/download/chunk`, {
                ...testData,
                chunkNumber: 5,
                totalChunks: 4
            });
        } catch (error) {
            console.log('✅ Expected error:', error.response.data.message);
        }

        console.log('\n========== All Tests Passed! ==========');
        console.log('\nHow to use in Postman:');
        console.log('1. Get Video Info:');
        console.log('   POST http://localhost:3000/download/info');
        console.log('   Body: { "filename": "movie.mp4", "videoID": "123" }');
        console.log('\n2. Download Part 1:');
        console.log('   POST http://localhost:3000/download/chunk');
        console.log('   Body: { "filename": "movie.mp4", "videoID": "123", "chunkNumber": 1, "totalChunks": 4 }');
        console.log('\n3. Download Part 2:');
        console.log('   Change chunkNumber to 2, 3, or 4');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
};

testPartialDownload();
