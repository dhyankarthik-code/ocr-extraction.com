import Prisma from "@/lib/db";
import { redirect } from "next/navigation";

// Prevent caching to see real-time logs
export const dynamic = 'force-dynamic';

export default async function AdminLogsPage({
    searchParams,
}: {
    searchParams: { key?: string; page?: string };
}) {
    // Basic security check
    const { key } = await searchParams;
    if (key !== process.env.ADMIN_KEY && key !== 'secure-logs-2024') {
        redirect("/");
    }

    const page = Number((await searchParams).page) || 1;
    const pageSize = 50;

    const logs = await Prisma.visitLog.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Visitor Logs</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date (Local)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Agent</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {/* Format: DD/MM/YYYY hh:mm A */}
                                    {new Date(log.createdAt).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    }).replace(',', '')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {log.ipAddress}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {log.path}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {[log.city, log.country].filter(Boolean).join(', ')}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={log.userAgent || ''}>
                                    {log.userAgent}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <a
                    href={`/admin/logs?key=${key}&page=${Math.max(1, page - 1)}`}
                    className={`px-4 py-2 border rounded ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'}`}
                >
                    Previous
                </a>
                <span className="text-sm text-gray-600">Page {page}</span>
                <a
                    href={`/admin/logs?key=${key}&page=${page + 1}`}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                    Next
                </a>
            </div>
        </div>
    );
}
