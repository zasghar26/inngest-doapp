import { Inngest } from "inngest";

export const inngest = new Inngest({
  name: process.env.INNGEST_APP_NAME ?? "nextjs-inngest-doapp",
  env: process.env.INNGEST_ENV ?? "prod",
  baseUrl: process.env.INNGEST_BASE_URL,
});
