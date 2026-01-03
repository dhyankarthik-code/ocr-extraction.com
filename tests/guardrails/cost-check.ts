
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COST_PER_MB_MISTRAL = 0.01; // $0.01 per MB (Estimated safe buffer)
const COST_PER_MB_SUPABASE = 0.00; // Free tier typically, but treating as overhead
const MAX_BUDGET_USD = 5.00;

async function checkCost() {
    try {
        console.log("🔍 Starting Cost Logic Check...");

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
            process.exit(1);
        } else {
            console.log(`\n✅ Budget Safe. Proceeding with tests.`);
            process.exit(0);
        }

    } catch (error) {
        console.error("❌ Error calculating cost:", error);
        // Fail safe: If we can't check cost, we shouldn't run expensive tests blindly? 
        // Or we should warn? 
        // Decision: Fail closed to protect wallet.
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

checkCost();
