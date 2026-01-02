require('dotenv').config();

console.log("Checking env vars...");
if (process.env.DIRECT_URL) {
    console.log("DIRECT_URL found (masked):", process.env.DIRECT_URL.substring(0, 15) + "...");
} else {
    console.log("DIRECT_URL NOT found.");
}
console.log("DATABASE_URL found:", !!process.env.DATABASE_URL);
