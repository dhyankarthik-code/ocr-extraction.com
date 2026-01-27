import redis from './redis'

/**
 * Analytics Utility using HyperLogLog (HLL)
 * 
 * Why HLL?
 * - Uses constant memory (~12kb) regardless of scale
 * - Perfect for unique daily visitor counts
 * - Supported natively by Upstash Redis
 */

type AnalyticsMetric = 'visitors' | 'documents'

/**
 * Tracks a unique event for a specific day using HyperLogLog
 * Fire and forget wrapper - never fails the request
 */
export async function trackUniqueEvent(metric: AnalyticsMetric, uniqueId: string) {
    if (!redis) return

    const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const key = `analytics:${metric}:${date}`

    try {
        // PFADD returns 1 if new element, 0 if already exists
        // We don't await this in the critical path usually, but for Server Actions we might
        await redis.pfadd(key, uniqueId)
    } catch (err) {
        console.error('Analytics Tracking Error:', err)
        // Swallow error to prevent impacting user experience
    }
}

/**
 * Gets unique count for a date range
 * Returns map of date -> count
 */
export async function getUniqueCounts(metric: AnalyticsMetric, days: number = 7) {
    if (!redis) return {}

    const stats: Record<string, number> = {}
    const dates = []

    for (let i = 0; i < days; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        dates.push(dateStr)
    }

    // Pipeline requests for performance
    const pipeline = redis.pipeline()
    dates.forEach(date => {
        pipeline.pfcount(`analytics:${metric}:${date}`)
    })

    try {
        const results = await pipeline.exec()

        dates.forEach((date, index) => {
            stats[date] = results[index] as number
        })
    } catch (err) {
        console.error('Analytics Fetch Error:', err)
    }

    return stats
}

/**
 * Total lifetime unique count (Merging all days would require a different strategy,
 * simple approach is to just keep a separate 'all-time' key if needed,
 * or use PFCOUNT on multiple keys if supported by driver, but simplified here)
 */
export async function getTotalUnique(metric: AnalyticsMetric) {
    // For now, let's keep it simple. 
    // If you need all-time unique, we should track a separate keys `analytics:${metric}:all`
    if (!redis) return 0
    return redis.pfcount(`analytics:${metric}:all`)
}
