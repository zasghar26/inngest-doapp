// app/api/signup/route.js
import { NextResponse } from "next/server";
import { inngest } from "../../../src/inngest/client.js";

const isEmail = (v) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Helpful in logs without dumping full stack in prod
const reason = (e) =>
  (e && (e.message || e.toString?.())) || "unknown_error";

// If someone opens /api/signup in the browser:
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST with { email }" },
    { status: 405 }
  );
}

export async function POST(req) {
  try {
    const ct = (req.headers.get("content-type") || "").toLowerCase();
    let email = "";

    // Accept JSON and form posts only; don't call formData() if not form
    if (ct.includes("application/json")) {
      const json = await req.json().catch(() => ({}));
      email = String(json.email || "");
    } else if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const form = await req.formData().catch(() => null);
      email = String((form && form.get("email")) || "");
    } else {
      // No/unknown content-type: try JSON first, then form, then give up
      try {
        const json = await req.json();
        email = String(json?.email || "");
      } catch {
        try {
          const form = await req.formData();
          email = String(form?.get("email") || "");
        } catch {
          // No body we can parse
        }
      }
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    // Send the event to Inngest
    let sent = false;
    let sendErr = null;
    try {
      await inngest.send({
        name: "app/user.created",
        data: { email },
      });
      sent = true;
    } catch (e) {
      sendErr = e;
      console.error("[/api/signup] inngest.send failed:", e);
    }

    // If caller posted a form, redirect back to the same site (relative URL)
    const isJson = ct.includes("application/json");
    if (!isJson) {
      const params = new URLSearchParams({
        ok: sent ? "1" : "0",
        ...(sendErr ? { err: "send" } : {}),
      });
      return NextResponse.redirect(`/?${params.toString()}`, 303);
    }

    // JSON callers get a JSON result (useful for debugging)
    return NextResponse.json({
      ok: sent,
      error: sendErr ? "send_failed" : null,
      ...(process.env.NODE_ENV !== "production" && sendErr
        ? { details: reason(sendErr) }
        : {}),
    });
  } catch (e) {
    console.error("[/api/signup] handler error:", e);
    // Return JSON with a concrete reason in dev
    const payload =
      process.env.NODE_ENV !== "production"
        ? { error: "Internal error", details: reason(e) }
        : { error: "Internal error" };
    return NextResponse.json(payload, { status: 500 });
  }
}
