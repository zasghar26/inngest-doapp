export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { serve } from "inngest/next";
import { inngest } from "../../../src/inngest/client.js";
import { userCreated } from "../../../src/inngest/functions/userCreated.js";

// Log presence (not values) once per cold start
console.log("[/api/inngest] env presence:", {
  appId: !!process.env.INNGEST_APP_ID,
  eventKey: !!process.env.INNGEST_EVENT_KEY,
  signingKey: !!process.env.INNGEST_SIGNING_KEY,
});

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [userCreated],
});
