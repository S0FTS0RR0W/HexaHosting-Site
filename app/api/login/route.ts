import { type NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  createAuthResponse,
  isValidEmail,
  normalizeEmail,
} from "@/lib/auth";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: NextRequest) {
  let body: LoginPayload;

  try {
    body = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const email =
    typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }

  if (!password) {
    return NextResponse.json(
      { error: "Password is required." },
      { status: 400 },
    );
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  return createAuthResponse(user, "Login successful.");
}
