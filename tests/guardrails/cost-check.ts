import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const COST_PER_MB_MISTRAL = 0.01; // $0.01 per MB (Estimated safe buffer)
const MAX_BUDGET_USD = 5.00;

async function checkCost() {
    // Get the base connection string
    let connectionString = process.env.DATABASE_URL || '';

    if (!connectionString) {
        console.error('❌ DATABASE_URL environment variable is not set');
        console.error('   This is required to connect to Supabase and check usage.');
        process.exit(1);
    }

    // Ensure pgbouncer=true is set for Supabase Supavisor compatibility
    if (!connectionString.includes('pgbouncer=true')) {
        const separator = connectionString.includes('?') ? '&' : '?';
        connectionString = `${connectionString}${separator}pgbouncer=true`;
    }

    // Supabase requires SSL with rejectUnauthorized: false
    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🔍 Starting Cost Sentinel Check...");

        // Aggregation: Sum usageMB from all Users
        const userAgg = await prisma.user.aggregate({
            _sum: {
                usageMB: true
            }
        });

        // Aggregation: Sum usageMB from all Visitors
        const visitorAgg = await prisma.visitor.aggregate({
            _sum: {
                usageMB: true
            }
        });

        const totalUserMB = userAgg._sum.usageMB || 0;
        const totalVisitorMB = visitorAgg._sum.usageMB || 0;
        const totalMB = totalUserMB + totalVisitorMB;

        const estimatedCost = totalMB * COST_PER_MB_MISTRAL;

        console.log(`📊 Usage Report:`);
        console.log(`   - Users: ${totalUserMB.toFixed(2)} MB`);
        console.log(`   - Visitors: ${totalVisitorMB.toFixed(2)} MB`);
        console.log(`   - Total: ${totalMB.toFixed(2)} MB`);
        console.log(`💰 Estimated Cost: $${estimatedCost.toFixed(4)} / $${MAX_BUDGET_USD.toFixed(2)}`);

        if (estimatedCost > MAX_BUDGET_USD) {
            console.error(`\n🚨 CRITICAL: Budget Exceeded! Stopping pipeline to prevent charges.`);
            console.error(`   Exceeded by $${(estimatedCost - MAX_BUDGET_USD).toFixed(2)}`);
            await prisma.$disconnect();
            await pool.end();
            process.exit(1);
        } else {
            console.log(`\n✅ Budget Safe. Proceeding with tests.`);
            await prisma.$disconnect();
            await pool.end();
            process.exit(0);
        }

    } catch (error) {
        console.error("❌ Error calculating cost:", error);
        // Fail closed to protect wallet
        await prisma.$disconnect().catch(() => { });
        await pool.end().catch(() => { });
        process.exit(1);
    }
}

checkCost();
