import { type NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type DeleteAccountPayload = {
  confirmText?: unknown;
};

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("hexa_auth")?.value;
  const authUser = token ? getAuthUserFromToken(token) : null;

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: DeleteAccountPayload;

  try {
    body = (await request.json()) as DeleteAccountPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const confirmText =
    typeof body.confirmText === "string" ? body.confirmText.trim() : "";

  if (confirmText !== "DELETE") {
    return NextResponse.json(
      { error: 'Type "DELETE" to confirm account deletion.' },
      { status: 400 },
    );
  }

  const deleted = await prisma.user.deleteMany({
    where: { email: authUser.email },
  });

  if (deleted.count === 0) {
    return NextResponse.json(
      {
        error:
          "This session is not linked to a registered user account. Sign in with a registered account to delete account.",
      },
      { status: 403 },
    );
  }

  const response = NextResponse.json(
    { message: "Account deleted successfully." },
    { status: 200 },
  );

  response.cookies.set({
    name: "hexa_auth",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
