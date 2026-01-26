
import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

async function testConnection() {
    console.log('🔍 Checking Redis Connection...');

    try {
        let envContent = '';

        // Check .env
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            envContent += fs.readFileSync(envPath, 'utf-8') + '\n';
        }

        // Check .env.local
        const envLocalPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envLocalPath)) {
            envContent += fs.readFileSync(envLocalPath, 'utf-8');
        }

        if (!envContent.trim()) {
            console.error('❌ No .env or .env.local file found (or empty)!');
            return;
        }

        const urlMatch = envContent.match(/UPSTASH_REDIS_REST_URL=(.+)/);
        const tokenMatch = envContent.match(/UPSTASH_REDIS_REST_TOKEN=(.+)/);

        if (!urlMatch || !tokenMatch) {
            console.error('❌ Upstash credentials not found in .env or .env.local');
            console.log('Please add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
            return;
        }

        const url = urlMatch[1].trim();
        const token = tokenMatch[1].trim();

        console.log(`Checking URL: ${url.substring(0, 20)}...`);

        const redis = new Redis({ url, token });

        const start = Date.now();
        await redis.set('test-connection', 'ok');
        const result = await redis.get('test-connection');
        const latency = Date.now() - start;

        if (result === 'ok') {
            console.log(`✅ Connection Successful! (Latency: ${latency}ms)`);
            console.log('Redis is configured correctly for local dev.');
        } else {
            console.error('❌ Connection succeeded but value mismatch:', result);
        }

    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
    }
}

testConnection();
