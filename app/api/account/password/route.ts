import { type NextRequest, NextResponse } from "next/server";
import {
  createPasswordHash,
  getAuthUserFromToken,
  validatePasswordHash,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type UpdatePasswordPayload = {
  currentPassword?: unknown;
  newPassword?: unknown;
  confirmNewPassword?: unknown;
};

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("hexa_auth")?.value;
  const authUser = token ? getAuthUserFromToken(token) : null;

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: UpdatePasswordPayload;

  try {
    body = (await request.json()) as UpdatePasswordPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : "";
  const confirmNewPassword =
    typeof body.confirmNewPassword === "string" ? body.confirmNewPassword : "";

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return NextResponse.json(
      { error: "All password fields are required." },
      { status: 400 },
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 },
    );
  }

  if (newPassword !== confirmNewPassword) {
    return NextResponse.json(
      { error: "New passwords do not match." },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: authUser.email },
    select: { id: true, passwordHash: true },
  });

  if (!existingUser) {
    return NextResponse.json(
      {
        error:
          "This session is not linked to a registered user account. Sign in with a registered account to change password.",
      },
      { status: 403 },
    );
  }

  if (!validatePasswordHash(currentPassword, existingUser.passwordHash)) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 401 },
    );
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { passwordHash: createPasswordHash(newPassword) },
  });

  return NextResponse.json(
    { message: "Password updated successfully." },
    { status: 200 },
  );
}
