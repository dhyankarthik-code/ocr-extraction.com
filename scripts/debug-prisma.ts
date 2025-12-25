
import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"
dotenv.config()

const prisma = new PrismaClient()

async function main() {
    console.log("Prisma keys:", Object.keys(prisma))
    // Also check non-enumerable properties or prototype
    console.log("Prisma prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(prisma)))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
