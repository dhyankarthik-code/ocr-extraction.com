
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    console.log("Starting cleanup (JS version)...")

    const visitors = await prisma.visitor.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, ipAddress: true }
    })

    console.log(`Found ${visitors.length} visitors.`)

    const seenIps = new Set()
    const idsToDelete = []

    for (const v of visitors) {
        if (!v.ipAddress) continue

        if (seenIps.has(v.ipAddress)) {
            idsToDelete.push(v.id)
        } else {
            seenIps.add(v.ipAddress)
        }
    }

    console.log(`Found ${idsToDelete.length} duplicates to delete.`)

    if (idsToDelete.length > 0) {
        // Delete in chunks of 500 to avoid huge queries
        for (let i = 0; i < idsToDelete.length; i += 500) {
            const chunk = idsToDelete.slice(i, i + 500);
            await prisma.visitor.deleteMany({
                where: { id: { in: chunk } }
            })
            console.log(`Deleted chunk ${i} - ${i + chunk.length}`)
        }
    }

    console.log("Done.")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
