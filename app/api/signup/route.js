import { NextResponse } from "next/server";
import { inngest } from "../../../src/inngest/client.js";

function isEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req) {
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

  await inngest.send({
    name: "app/user.created",
    data: { email, at: new Date().toISOString() },
  });

  // Redirect back to home (works on any hostname)
  return NextResponse.redirect(new URL("/", req.url), 303);
}
