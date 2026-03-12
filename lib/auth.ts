import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthUser = {
  email: string;
  name?: string;
};

type UserRecord = {
  name: string;
  email: string;
  passwordHash: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function signToken(payload: Record<string, unknown>, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", secret)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

function secureCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, expectedHash] = passwordHash.split(":");
  if (!salt || !expectedHash) {
    return false;
  }

  const computedHash = scryptSync(password, salt, 64).toString("hex");
  return secureCompare(computedHash, expectedHash);
}

function resolveTokenSecret(): string | null {
  const configuredSecret = process.env.AUTH_TOKEN_SECRET;
  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return process.env.ADMIN_PASSWORD ?? "dev-auth-secret";
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

export async function registerUser(
  input: RegisterInput,
): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  const email = normalizeEmail(input.email);
  const adminEmail = process.env.ADMIN_EMAIL
    ? normalizeEmail(process.env.ADMIN_EMAIL)
    : null;

  if (adminEmail && secureCompare(email, adminEmail)) {
    return { ok: false, error: "This email is reserved." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const createdUser: UserRecord = {
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password),
  };

  await prisma.user.create({
    data: createdUser,
  });

  return {
    ok: true,
    user: {
      email,
      name: input.name.trim(),
    },
  };
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const normalizedEmail = normalizeEmail(email);
  const configuredEmail = process.env.ADMIN_EMAIL
    ? normalizeEmail(process.env.ADMIN_EMAIL)
    : null;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (
    configuredEmail &&
    configuredPassword &&
    secureCompare(normalizedEmail, configuredEmail) &&
    secureCompare(password, configuredPassword)
  ) {
    return { email: normalizedEmail, name: "Admin" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      email: true,
      name: true,
      passwordHash: true,
    },
  });

  if (!existingUser) {
    return null;
  }

  if (!verifyPassword(password, existingUser.passwordHash)) {
    return null;
  }

  return {
    email: existingUser.email,
    name: existingUser.name,
  };
}

export function createAuthResponse(
  user: AuthUser,
  message: string,
): NextResponse {
  const tokenSecret = resolveTokenSecret();

  if (!tokenSecret) {
    return NextResponse.json(
      { error: "AUTH_TOKEN_SECRET must be configured in production." },
      { status: 500 },
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const token = signToken(
    {
      sub: user.email,
      name: user.name,
      iat: now,
      exp: now + 60 * 60 * 24,
    },
    tokenSecret,
  );

  const response = NextResponse.json(
    {
      message,
      user,
    },
    { status: 200 },
  );

  response.cookies.set({
    name: "hexa_auth",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
