"use client";
import { useState } from "react";

export default function Home() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <main style={{ padding: 32, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1>Next.js + Inngest on DigitalOcean App Platform</h1>
      <p>Use the form to simulate a signup and fire an Inngest event.</p>

      <form
        action="/api/signup"
        method="post"
        style={{ marginTop: 16 }}
        onSubmit={() => setSubmitting(true)}
      >
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          style={{ padding: 8, minWidth: 260 }}
        />
        <button type="submit" disabled={submitting} style={{ padding: 8, marginLeft: 8 }}>
          {submitting ? "Creating…" : "Create User"}
        </button>
      </form>

      <p style={{ marginTop: 24 }}>
        Background jobs run via Inngest. Check your Inngest dashboard for function runs.
      </p>
    </main>
  );
}
