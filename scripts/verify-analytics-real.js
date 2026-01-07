
const https = require('https');

async function verify() {
    console.log('🚀 Verifying Analytics Endpoint (Real User Simulation via HTTPS)...');

    const data = JSON.stringify({
        path: '/verify-real-user-fix',
        referrer: 'manual-verification-script-https'
    });

    const options = {
        hostname: 'www.ocr-extraction.com',
        port: 443,
        path: '/api/analytics/track/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            console.log('Response:', body);

            if (res.statusCode === 200 && body.includes('success')) {
                console.log('✅ SUCCESS: Visit logged successfully (Status 200).');
                console.log('   Action: Check Supabase "VisitLog" table for path "/verify-real-user-fix".');
            } else {
                console.log('❌ FAILURE: API did not return success.');
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Network Error:', error);
    });

    req.write(data);
    req.end();
}

verify();
