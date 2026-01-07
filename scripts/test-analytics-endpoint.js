/**
 * Test script to verify analytics tracking endpoint
 * Run with: node scripts/test-analytics-endpoint.js
 */

const testAnalyticsEndpoint = async () => {
    const baseUrl = process.env.TEST_URL || 'http://localhost:3000';
    const endpoint = `${baseUrl}/api/analytics/track/`;

    console.log('🧪 Testing Analytics Endpoint');
    console.log('━'.repeat(50));
    console.log(`📍 Target: ${endpoint}\n`);

    const testCases = [
        {
            name: 'Homepage Visit',
            payload: {
                path: '/',
                referrer: ''
            }
        },
        {
            name: 'Tool Page Visit',
            payload: {
                path: '/tools/pdf-to-word/',
                referrer: 'https://www.google.com'
            }
        },
        {
            name: 'Blog Page Visit',
            payload: {
                path: '/blog/how-to-use-ocr/',
                referrer: 'https://www.ocr-extraction.com/'
            }
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n🔍 Test: ${testCase.name}`);
        console.log(`   Payload: ${JSON.stringify(testCase.payload)}`);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                body: JSON.stringify(testCase.payload)
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`   ✅ Success: ${response.status}`);
                console.log(`   Response:`, data);
            } else {
                console.log(`   ❌ Failed: ${response.status}`);
                console.log(`   Error:`, data);
            }
        } catch (error) {
            console.log(`   ❌ Request failed:`, error.message);
        }
    }

    console.log('\n' + '━'.repeat(50));
    console.log('✅ Test completed');
};

testAnalyticsEndpoint().catch(console.error);
