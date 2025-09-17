import { NextResponse } from "next/server";
import { inngest } from "../../../src/inngest/client.js";

function isEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req) {
  const form = await req.formData();
  const email = String(form.get("email") || "");
  if (!isEmail(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  await inngest.send({ name: "app/user.created", data: { email, at: new Date().toISOString() } });
  return NextResponse.redirect(new URL("/", req.url), 303);
}
