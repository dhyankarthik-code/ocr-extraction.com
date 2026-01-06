
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function testDatabaseConnection() {
    console.log('🔄 Testing database connection...');
    console.log('Environment:', {
        DATABASE_URL: process.env.DATABASE_URL ? 'Defined (Hidden)' : 'Undefined',
        NODE_ENV: process.env.NODE_ENV
    });

    try {
        // 1. Try to read
        const count = await prisma.visitLog.count();
        console.log(`✅ Read success: Found ${count} existing logs.`);

        // 2. Try to write
        const testLog = await prisma.visitLog.create({
            data: {
                ipAddress: '127.0.0.1',
                path: '/test-db-connection',
                country: 'TestLand',
                userAgent: 'DatabaseTester/1.0'
            }
        });
        console.log(`✅ Write success: Created test log with ID: ${testLog.id}`);

        // 3. Clean up
        await prisma.visitLog.delete({
            where: { id: testLog.id }
        });
        console.log('✅ Cleanup success: Deleted test log.');

    } catch (error) {
        console.error('❌ Database Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabaseConnection();
