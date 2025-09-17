// app/api/signup/route.js
import { NextResponse } from "next/server";
import { inngest } from "../../../src/inngest/client.js";

const isEmail = (v) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req) {
  try {
    const ct = req.headers.get("content-type") || "";
    let email = "";

    // Accept JSON or form POSTs
    if (ct.includes("application/json")) {
      const json = await req.json().catch(() => ({}));
      email = String(json.email || "");
    } else {
      const form = await req.formData();
      email = String(form.get("email") || "");
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    // Send the event to Inngest
    let sent = false;
    let sendError = null;
    try {
      await inngest.send({
        name: "app/user.created",
        data: { email },
      });
      sent = true;
    } catch (err) {
      sendError = err;
      console.error("[/api/signup] inngest.send failed:", err);
    }

    // If it was a form post, redirect back to the home page with a status
    if (!ct.includes("application/json")) {
      const url = new URL("/", req.url);
      url.searchParams.set("ok", sent ? "1" : "0");
      if (sendError) url.searchParams.set("err", "send");
      return NextResponse.redirect(url.toString(), 303);
    }

    // JSON response for programmatic calls
    return NextResponse.json({ ok: sent, error: sendError ? "send_failed" : null });
  } catch (err) {
    console.error("[/api/signup] handler error:", err?.stack || err);
    // Deliberately return JSON (not a 500) so you can see it in the browser
    return NextResponse.json({ error: "Internal error" }, { status: 200 });
  }
}
