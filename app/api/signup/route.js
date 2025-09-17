// app/api/signup/route.js
import { NextResponse } from "next/server";
import { inngest } from "../../../src/inngest/client.js";

const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req) {
  try {
    const ct = req.headers.get("content-type") || "";
    let email = "";

    if (ct.includes("application/json")) {
      const json = await req.json().catch(() => ({}));
      email = String(json.email || "");
    } else {
      const form = await req.formData();
      email = String(form.get("email") || "");
    }

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Send event, but never crash the request
    let sent = false;
    let sendError = null;

    try {
      if (!process.env.INNGEST_EVENT_KEY) {
        throw new Error("INNGEST_EVENT_KEY missing at runtime");
      }
      await inngest.send({
        name: "app/user.created",
        data: { email, at: new Date().toISOString() },
      });
      sent = true;
    } catch (e) {
      sendError = e instanceof Error ? e.message : String(e);
      console.error("[/api/signup] inngest.send failed:", sendError);
    }

    // For form posts, redirect with result flags so the UI can show a message
    const url = new URL("/", req.url);
    url.searchParams.set("ok", sent ? "1" : "0");
    if (sendError) url.searchParams.set("err", "send");
    return NextResponse.redirect("/?ok=1", 303);
  } catch (err) {
    console.error("[/api/signup] handler error:", err?.stack || err);
    // Return JSON instead of throwing a 500
    return NextResponse.json({ error: "Internal error" }, { status: 200 });
  }
}
