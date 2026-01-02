const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envPath = path.resolve(__dirname, '../.env');
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("DATABASE_URL not found.");
    process.exit(1);
}

// Check if DIRECT_URL exists in file content (to avoid double append)
const envContent = fs.readFileSync(envPath, 'utf8');
if (envContent.includes('DIRECT_URL=')) {
    console.log("DIRECT_URL already exists in .env");
    process.exit(0);
}

let directUrl = dbUrl.replace(':6543', ':5432');
if (directUrl.includes('pgbouncer=true')) {
    directUrl = directUrl.replace(/[?&]pgbouncer=true/, '');
}

fs.appendFileSync(envPath, `\nDIRECT_URL="${directUrl}"\n`);
console.log("Appended DIRECT_URL to .env");
