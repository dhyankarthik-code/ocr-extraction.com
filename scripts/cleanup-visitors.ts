
import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    console.log("Starting cleanup of duplicate Visitors by IP...")

    // 1. Get all visitors
    const visitors = await prisma.visitor.findMany({
        orderBy: { createdAt: 'desc' } // Newest first
    })

    console.log(`Found ${visitors.length} total visitor records.`)

    const seenIps = new Set<string>()
    const idsToDelete: string[] = []
    const uniqueCount = 0

    for (const visitor of visitors) {
        if (!visitor.ipAddress) continue

        if (seenIps.has(visitor.ipAddress)) {
            // Duplicate! Since we ordered by desc, this is an older one. Delete it.
            idsToDelete.push(visitor.id)
        } else {
            // First time seeing this IP (it's the newest one). Keep it.
            seenIps.add(visitor.ipAddress)
        }
    }

    console.log(`Found ${idsToDelete.length} duplicates to delete.`)
    console.log(`Unique IPs preserved: ${seenIps.size}`)

    if (idsToDelete.length > 0) {
        // Delete in batches if necessary, but deleteMany with 'in' is fine for thousands usually
        const result = await prisma.visitor.deleteMany({
            where: {
                id: { in: idsToDelete }
            }
        })
        console.log(`Deleted ${result.count} records.`)
    } else {
        console.log("No duplicates found.")
    }

    console.log("Cleanup complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
