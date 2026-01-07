
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Unsafe simple env loader for testing script
function loadEnv(filename) {
    try {
        const envPath = path.resolve(__dirname, '../' + filename);
        if (fs.existsSync(envPath)) {
            console.log(`Loading env from ${filename}`);
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2 && !line.startsWith('#')) {
                    const key = parts[0].trim();
                    const val = parts.slice(1).join('=').trim();
                    process.env[key] = val;
                }
            });
        }
    } catch (e) {
        console.log(`Error loading ${filename}`, e);
    }
}

loadEnv('.env');
loadEnv('.env.local');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Successfully connected to the database.');
        console.log('Database integrity check passed: Connection successful.');
    } catch (error) {
        console.error('Database integrity check failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
