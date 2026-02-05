import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { checkAndResetUsage } from '@/lib/usage-limit';

const FILE_SIZE_LIMIT_MB = 10;

/**
 * Result of a quota check
 */
export interface QuotaResult {
    allowed: boolean;
    currentUsage: number;
    remaining: number;
    limit: number;
    error?: string;
    details?: string;
    userType: 'user' | 'visitor';
    identifier: string; // userId or ipAddress
}

/**
 * Checks if the current request is within the shared quota limit.
 * Handles both logged-in users and anonymous visitors.
 * Also handles daily reset logic via checkAndResetUsage.
 */
export async function checkQuota(request: NextRequest, fileSizeBytes: number): Promise<QuotaResult> {
    const fileSizeMB = fileSizeBytes / (1024 * 1024);

    // 1. Identify User
    const sessionCookie = request.cookies.get("session")?.value;
    let userGoogleId: string | null = null;
    let userEmail: string | null = null;
    let userName: string | null = null;

    if (sessionCookie) {
        try {
            const session = JSON.parse(sessionCookie);
            userEmail = session.email;
            userGoogleId = session.id?.replace("google_", "");
            userName = session.name || "User";
        } catch (e) {
            console.error("Session parse error", e);
        }
    }

    // 2. Fallback to IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

    // 3. Logic for Logged In User
    if (userGoogleId && userEmail) {
        try {
            // Lazy Creation logic similar to existing route
            const user = await prisma.user.upsert({
                where: { googleId: userGoogleId },
                update: {},
                create: {
                    googleId: userGoogleId,
                    email: userEmail,
                    name: userName || "User",
                    usageMB: 0.0
                }
            });

            // Reset logic
            const currentUsage = await checkAndResetUsage(user as any, prisma, 'user');

            if (currentUsage + fileSizeMB > FILE_SIZE_LIMIT_MB) {
                return {
                    allowed: false,
                    currentUsage,
                    remaining: Math.max(0, FILE_SIZE_LIMIT_MB - currentUsage),
                    limit: FILE_SIZE_LIMIT_MB,
                    error: 'Daily Quota exceeded',
                    details: `You have reached the 10MB daily upload limit. Used: ${currentUsage.toFixed(2)}MB`,
                    userType: 'user',
                    identifier: user.id
                };
            }

            return {
                allowed: true,
                currentUsage,
                remaining: Math.max(0, FILE_SIZE_LIMIT_MB - currentUsage),
                limit: FILE_SIZE_LIMIT_MB,
                userType: 'user',
                identifier: user.id
            };

        } catch (error) {
            console.error("Quota Check Failed (User)", error);
            // Fail open? Or Block? Usually safer to block or return allowed: true with warning if DB fails?
            // Existing code failed open (caught error and proceeded). Let's fail open to avoid blocking users on DB glitches.
            return { allowed: true, currentUsage: 0, remaining: 10, limit: 10, userType: 'user', identifier: 'error_fallback' };
        }
    }

    // 4. Logic for Visitor (IP)
    try {
        const dbTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 5000));

        const visitorPromise = prisma.visitor.upsert({
            where: { ipAddress: ipAddress },
            update: {},
            create: {
                ipAddress: ipAddress,
                timezone: "UTC",
                usageMB: 0.0
            }
        });

        const visitor = await Promise.race([visitorPromise, dbTimeout]) as any;

        if (visitor) {
            const visitorAsUser = {
                id: visitor.id,
                usageMB: visitor.usageMB || 0.0,
                lastUsageDate: visitor.lastUsageDate,
                timezone: visitor.timezone || 'UTC'
            };

            const currentUsage = await checkAndResetUsage(visitorAsUser, prisma, 'visitor');

            if (currentUsage + fileSizeMB > FILE_SIZE_LIMIT_MB) {
                return {
                    allowed: false,
                    currentUsage,
                    remaining: Math.max(0, FILE_SIZE_LIMIT_MB - currentUsage),
                    limit: FILE_SIZE_LIMIT_MB,
                    error: 'Daily Quota exceeded',
                    details: `You have reached the 10MB daily upload limit. Used: ${currentUsage.toFixed(2)}MB`,
                    userType: 'visitor',
                    identifier: visitor.id
                };
            }
            return {
                allowed: true,
                currentUsage,
                remaining: Math.max(0, FILE_SIZE_LIMIT_MB - currentUsage),
                limit: FILE_SIZE_LIMIT_MB,
                userType: 'visitor',
                identifier: visitor.id
            };
        }
    } catch (error) {
        console.error("Quota Check Failed (Visitor)", error);
    }

    // Fail open default
    return { allowed: true, currentUsage: 0, remaining: 10, limit: 10, userType: 'visitor', identifier: ipAddress };
}

/**
 * Increments the usage for the identified user/visitor.
 * Should be called AFTER successful processing.
 */
export async function incrementUsage(userType: 'user' | 'visitor', identifier: string, fileSizeBytes: number) {
    const fileSizeMB = fileSizeBytes / (1024 * 1024);

    try {
        if (userType === 'user') {
            await prisma.user.update({
                where: { id: identifier }, // UsageLimit helper returns ID, but we used googleId for upsert. 
                // Wait, checkQuota returns 'identifier' which is user.id (UUID usually) or user.googleId?
                // prisma.user.upsert returns the User object. user.id is the primary key.
                // So passed identifier must be the PK.
                data: { usageMB: { increment: fileSizeMB } }
            });
        } else {
            // For visitor, identifier is likely the ID from the DB visitor record
            // BUT if checkQuota failed open, identifier is IP.
            // We need to be careful.
            // If checkQuota returns 'error_fallback', we skip update.
            if (identifier === 'error_fallback' || identifier === 'unknown') return;

            // Check if identifier looks like a UUID or just assume it is the ID
            // If update fails, it fails.

            // Wait, for visitor in checkQuota, we did:
            // identifier: visitor.id
            // So it is the PK.
            await prisma.visitor.update({
                where: { id: identifier },
                data: {
                    usageMB: { increment: fileSizeMB },
                    lastUsageDate: new Date()
                }
            });
        }
    } catch (error) {
        console.error("Failed to increment usage", error);
    }
}
