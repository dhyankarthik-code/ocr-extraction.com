import { inngest } from "./client";

export const processPdf = inngest.createFunction(
    {
        id: "process-pdf",
        name: "Process PDF via Stirling",
        concurrency: {
            limit: 20, // Limit concurrent requests to prevent overwhelming the API
        }
    },
    { event: "pdf/process" },
    async ({ event, step }) => {

        // 1. Validate Input
        const { fileUrl, operation, params } = event.data;
        if (!fileUrl || !operation) throw new Error("Missing fileUrl or operation");

        // 2. Call Stirling PDF API (Mock for now, strictly structure)
        const result = await step.run("call-stirling-api", async () => {
            // In production, this would be a fetch() to your GCP IP
            // const response = await fetch(`${process.env.STIRLING_API_URL}/api/v1/${operation}`, { ... });

            console.log(`Processing ${operation} for ${fileUrl} on Stirling PDF...`);
            // Simulate delay
            await new Promise(r => setTimeout(r, 1000));

            return {
                status: "success",
                outputUrl: "https://generated-url.com/result.pdf"
            };
        });

        // 3. Handle Completion (e.g., Update DB, Email User)
        await step.run("handle-completion", async () => {
            console.log("PDF Processing Completed:", result);
        });

        return result;
    }
);
