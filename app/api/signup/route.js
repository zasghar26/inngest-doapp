import { NextResponse } from "next/server";
import { inngest } from "../../../src/inngest/client.js";

export async function POST(req) {
  const contentType = req.headers.get("content-type") || "";
  let email = "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    email = body.email;
  } else {
    const form = await req.formData();
    email = form.get("email");
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await inngest.send({
    name: "user/created",
    data: { email },
  });

  return NextResponse.redirect(new URL("/", req.url), 303);
}
