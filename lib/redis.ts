import { Redis } from '@upstash/redis'

/**
 * Upstash Redis client for distributed caching and rate limiting
 * 
 * Free tier: 500K commands/month
 * Latency: ~1-5ms from edge locations
 * 
 * Setup:
 * 1. Create account at https://upstash.com
 * 2. Create Redis database
 * 3. Copy REST URL and Token to .env
 */

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

const redis = (redisUrl && redisToken && redisUrl.startsWith('https://'))
    ? new Redis({
        url: redisUrl,
        token: redisToken,
    })
    : null

export default redis
