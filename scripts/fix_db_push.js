const { execSync } = require('child_process');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("DATABASE_URL not found in environment.");
    process.exit(1);
}

// Derive DIRECT_URL if not set
let directUrl = process.env.DIRECT_URL;

if (!directUrl) {
    console.log("No DIRECT_URL found. Attempting to derive from DATABASE_URL...");
    // 1. Change port 6543 (PgBouncer) -> 5432 (Session/Direct)
    directUrl = dbUrl.replace(':6543', ':5432');

    // 2. Remove pgbouncer param
    if (directUrl.includes('pgbouncer=true')) {
        directUrl = directUrl.replace(/[?&]pgbouncer=true/, '');
        // Clean up trailing ? or & if basic replace left mess, but URL params are tricky.
        // Simple replace is usually safe for basic Supabase strings.
    }
    console.log("Derived DIRECT_URL (masked):", directUrl.replace(/:[^:]*@/, ':****@'));
}

try {
    console.log("Running: npx prisma db push");
    // Pass the new env var to the child process
    execSync('npx prisma db push', {
        stdio: 'inherit',
        env: { ...process.env, DIRECT_URL: directUrl }
    });
    console.log("✅ DB Push Successful!");
} catch (error) {
    console.error("❌ DB Push Failed:", error.message);
    process.exit(1);
}
