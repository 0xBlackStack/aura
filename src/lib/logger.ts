/**
 * Logs an analytics event as a JSON string to the console and appends an ISO timestamp.
 *
 * @param event - Event payload containing `type` and optional fields (`userId`, `projectId`, `provider`, `model`, `sandboxId`, `status`, `meta`, `promptLength`). A `timestamp` (ISO string) is added to the logged object.
 */
export function logEvent(event: {
    type: string;
    userId?: string;
    projectId?: string;
    provider?: string;
    model?: string;
    sandboxId?: string;
    status?: "success" | "error" | "refused";
    meta?: Record<string, any>;
    promptLength?: number;
}) {
    console.log(JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
    }));
}