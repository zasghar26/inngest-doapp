export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { serve } from "inngest/next";
import { inngest } from "../../../src/inngest/client.js";
import { userCreated } from "../../../src/inngest/functions/userCreated.js";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [userCreated],
});
