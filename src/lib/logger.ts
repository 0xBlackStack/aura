// lib/logger.ts
export function logEvent(event: {
    type: string;
    userId?: string;
    projectId?: string;
    provider?: string;
    model?: string;
    sandboxId?: string;
    status?: "success" | "error" | "refused";
    meta?: Record<string, unknown>;
    promptLength?: number;
    error?: string;
}) {
    console.log(JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
    }));
}
