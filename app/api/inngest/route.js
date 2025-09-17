import { serve } from "inngest/next";
import { inngest } from "../../../src/inngest/client.js";
import { welcomeEmail } from "../../../src/inngest/functions/welcomeEmail.js";
import { nightlyReport } from "../../../src/inngest/functions/nightlyReport.js";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [welcomeEmail, nightlyReport],
});
