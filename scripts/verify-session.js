const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/session/',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log('HEADERS:');
    console.log(JSON.stringify(res.headers, null, 2));

    if (res.statusCode === 429) {
        console.log('!!! 429 Too Many Requests detected !!!');
    } else if (res.headers['x-ratelimit-limit']) {
        console.log('✅ Rate Limit headers present');
    } else {
        console.log('❌ Rate Limit headers MISSING');
    }
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
