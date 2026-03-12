import { type NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type UpdateProfilePayload = {
  name?: unknown;
};

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("hexa_auth")?.value;
  const authUser = token ? getAuthUserFromToken(token) : null;

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: UpdateProfilePayload;

  try {
    body = (await request.json()) as UpdateProfilePayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const updated = await prisma.user.updateMany({
    where: { email: authUser.email },
    data: { name },
  });

  if (updated.count === 0) {
    return NextResponse.json(
      {
        error:
          "This session is not linked to a registered user account. Sign in with a registered account to edit your profile.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json(
    { message: "Profile updated successfully.", user: { ...authUser, name } },
    { status: 200 },
  );
}
