import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'

export async function GET() {
    const results: any = {
        envCheck: null,
        rawPgTest: null,
        tableCheck: null,
        prismaTest: null,
    }

    try {
        // 1. Check Environment Variable
        const dbUrl = process.env.DATABASE_URL || ''
        results.envCheck = {
            status: dbUrl ? 'SET' : 'MISSING',
            length: dbUrl.length,
            hasPort6543: dbUrl.includes(':6543'),
            hasPort5432: dbUrl.includes(':5432'),
            hasPgbouncer: dbUrl.includes('pgbouncer=true'),
        }

        if (!dbUrl) {
            return NextResponse.json({ status: 'ERROR', message: 'DATABASE_URL not set', results }, { status: 500 })
        }

        // 2. Test Raw pg Pool Connection (bypassing Prisma)
        let connectionString = dbUrl
        if (!connectionString.includes('pgbouncer=true')) {
            const separator = connectionString.includes('?') ? '&' : '?'
            connectionString = `${connectionString}${separator}pgbouncer=true`
        }

        const pool = new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000,
        })

        try {
            const client = await pool.connect()
            const rawResult = await client.query('SELECT 1 as test')
            client.release()
            results.rawPgTest = { status: 'SUCCESS', value: rawResult.rows[0]?.test }
        } catch (pgError: any) {
            results.rawPgTest = { status: 'ERROR', message: pgError.message, code: pgError.code }
            await pool.end()
            return NextResponse.json({ status: 'ERROR', message: 'Raw pg connection failed', results }, { status: 500 })
        }

        // 3. Check if User table exists and has correct columns
        try {
            const client = await pool.connect()
            const tableCheck = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'User' AND table_schema = 'public'
                ORDER BY ordinal_position
            `)
            client.release()
            results.tableCheck = {
                status: tableCheck.rows.length > 0 ? 'TABLE_EXISTS' : 'TABLE_NOT_FOUND',
                columns: tableCheck.rows
            }
        } catch (tableError: any) {
            results.tableCheck = { status: 'ERROR', message: tableError.message }
        }

        await pool.end()

        // 4. Test Prisma
        try {
            const { default: prisma } = await import("@/lib/db")
            const count = await prisma.user.count()
            results.prismaTest = { status: 'SUCCESS', userCount: count }
        } catch (prismaError: any) {
            results.prismaTest = {
                status: 'ERROR',
                name: prismaError.name,
                message: prismaError.message,
                code: prismaError.code,
                meta: prismaError.meta
            }
            return NextResponse.json({ status: 'ERROR', message: 'Prisma query failed', results }, { status: 500 })
        }

        return NextResponse.json({ status: 'SUCCESS', message: 'All tests passed', results })

    } catch (error: any) {
        return NextResponse.json({
            status: 'ERROR',
            errorName: error.name,
            errorMessage: error.message,
            results
        }, { status: 500 })
    }
}
