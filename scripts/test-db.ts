
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Testing Prisma connection...")
    try {
        const count = await prisma.visitor.count()
        console.log(`Connection successful. Visitor count: ${count}`)
    } catch (e) {
        console.error("Connection failed:", e)
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })
