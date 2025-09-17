import { NextResponse } from "next/server";
import { inngest } from "../../../src/inngest/client.js";

function isEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

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

    // If the Event Key is missing in prod, sending will throw -> we catch below.
    await inngest.send({
      name: "app/user.created",
      data: { email, at: new Date().toISOString() },
    });

    // Success: go home
    return NextResponse.redirect(new URL("/?ok=1", req.url), 303);
  } catch (err) {
    console.error("Signup handler error:", err);
    // Don’t leak details to the user; redirect with an error flag instead of 500
    return NextResponse.redirect(new URL("/?error=signup", req.url), 303);
  }
}
