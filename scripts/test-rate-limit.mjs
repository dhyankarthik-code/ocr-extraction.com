// import fetch from 'node-fetch'; // Using global fetch

const BASE_URL = 'http://localhost:3000/api/summary';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function runTest() {
    console.log('🚀 Starting Rate Limit Test...');
    console.log(`Target: ${BASE_URL}`);

    let successCount = 0;
    let limitedCount = 0;
    let errorCount = 0;

    // We set limit to 10 in code. Let's try 15 requests.
    const TOTAL_REQUESTS = 15;

    for (let i = 1; i <= TOTAL_REQUESTS; i++) {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Mimic same IP by default when running locally
                },
                body: JSON.stringify({ text: `Test request sequence ${i} - ${Date.now()}` })
            });

            if (response.status === 200) {
                console.log(`Request ${i}: ✅ 200 OK`);
                successCount++;
            } else if (response.status === 429) {
                console.log(`Request ${i}: 🛑 429 Too Many Requests (Expected for >10)`);
                limitedCount++;
            } else {
                console.log(`Request ${i}: ⚠️ Unexpected Status ${response.status}`);
                errorCount++;
            }

            // Short delay to ensure we don't hit other network limits, 
            // but fast enough to stay within the 1-minute sliding window.
            await sleep(100);

        } catch (err) {
            console.error(`Request ${i}: ❌ Failed`, err.message);
            errorCount++;
        }
    }

    console.log('\n--- Test Results ---');
    console.log(`Success (200): ${successCount}`);
    console.log(`Rate Limited (429): ${limitedCount}`);
    console.log(`Errors: ${errorCount}`);

    if (limitedCount > 0) {
        console.log('✅ Rate Limit Logic is ACTIVE.');
    } else {
        console.warn('⚠️ No 429s received. Rate limit might not be enforced or Redis is permissive (Fail-Open).');
    }
}

runTest();
