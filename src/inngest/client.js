// inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: process.env.INNGEST_APP_ID ?? "nextjs-inngest-doapp", // <-- required
  name: process.env.INNGEST_APP_NAME,                       // optional
  env: process.env.INNGEST_ENV ?? "prod",                   // optional
  // Only set baseUrl if you’re self-hosting Inngest; otherwise omit it.
  ...(process.env.INNGEST_BASE_URL ? { baseUrl: process.env.INNGEST_BASE_URL } : {}),
  // Needed if you call `inngest.send()` from your API routes in prod:
  ...(process.env.INNGEST_EVENT_KEY ? { eventKey: process.env.INNGEST_EVENT_KEY } : {}),
});
