import { inngest } from "../client.js";

/**
 * Fires when the signup API sends `app/user.created`.
 * Add your email, db, or queue logic inside the step.
 */
export const userCreated = inngest.createFunction(
  { id: "user-created" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    const { email } = event.data;

    // Example "work":
    await step.run("log-user", async () => {
      console.log("[Inngest] New user created:", email);
    });

    // Example: add other steps here (send email, write to DB, call API, etc.)
    return { ok: true, email };
  }
);
