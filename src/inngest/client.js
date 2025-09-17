import { Inngest } from "inngest";

export const inngest = new Inngest({
  // REQUIRED — give it a stable fallback so builds never fail
  id: process.env.INNGEST_APP_ID ?? "nextjs-inngest-doapp",
  // Optional metadata
  name: process.env.INNGEST_APP_NAME,
  env: process.env.INNGEST_ENV ?? "prod",
  // Only set baseUrl if you self-host Inngest; omit for Inngest Cloud
  ...(process.env.INNGEST_BASE_URL ? { baseUrl: process.env.INNGEST_BASE_URL } : {}),
  // Needed only if you call inngest.send() from your server (we do in /api/signup)
  ...(process.env.INNGEST_EVENT_KEY ? { eventKey: process.env.INNGEST_EVENT_KEY } : {}),
});
