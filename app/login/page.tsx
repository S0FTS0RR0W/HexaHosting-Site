import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login";
import { getAuthUserFromToken } from "@/lib/auth";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("hexa_auth")?.value;

  if (sessionToken) {
    const authUser = getAuthUserFromToken(sessionToken);

    if (authUser) {
      redirect("/dashboard");
    }
  }

  return <LoginForm />;
}
