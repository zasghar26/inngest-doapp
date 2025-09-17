import { Inngest } from "inngest";

/**
 * Minimal, robust Inngest client.
 * - id: required and stable (prevents build crash)
 * - name/env: optional metadata
 * - eventKey: required only if you call `send()` from the server in prod
 * - baseUrl: leave undefined for Inngest Cloud
 */
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_ID ?? "nextjs-inngest-doapp",
  name: process.env.INNGEST_APP_NAME,
  env: process.env.INNGEST_ENV ?? "prod",
  ...(process.env.INNGEST_BASE_URL ? { baseUrl: process.env.INNGEST_BASE_URL } : {}),
  ...(process.env.INNGEST_EVENT_KEY ? { eventKey: process.env.INNGEST_EVENT_KEY } : {}),
});
