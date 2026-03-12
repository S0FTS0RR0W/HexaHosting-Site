import { NextRequest, NextResponse } from "next/server";
import { createAuthResponse, isValidEmail, normalizeEmail, registerUser } from "@/lib/auth";

type RegisterPayload = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
};

export async function POST(request: NextRequest) {
  let body: RegisterPayload;

  try {
    body = (await request.json()) as RegisterPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  if (confirmPassword !== password) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const result = await registerUser({ name, email, password });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error.includes("already exists") ? 409 : 400 },
    );
  }

  return createAuthResponse(result.user, "Account created successfully.");
}
