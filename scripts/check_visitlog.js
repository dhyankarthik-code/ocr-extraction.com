const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking if VisitLog table exists...");
        const count = await prisma.visitLog.count();
        console.log(`Success! Table exists. Row count: ${count}`);
    } catch (e) {
        console.error("Error accessing VisitLog table:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
