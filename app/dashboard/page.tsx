import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardAccountTabs } from "@/components/dashboard-account-tabs";
import { DashboardLogoutButton } from "@/components/dashboard-logout-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("hexa_auth")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const authUser = getAuthUserFromToken(sessionToken);

  if (!authUser) {
    redirect("/login");
  }

  const userRecord = await prisma.user.findUnique({
    where: { email: authUser.email },
    select: {
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const displayName = userRecord?.name ?? authUser.name ?? "User";
  const displayEmail = userRecord?.email ?? authUser.email;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your HexaHosting account and review your profile details.
          </p>
        </div>
        <DashboardLogoutButton className="sm:w-auto" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>
              Your active identity and profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-base font-medium">{displayName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-base font-medium">{displayEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="text-base font-medium">
                {userRecord ? "Registered User" : "Admin Session"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Session Status</p>
              <p className="text-base font-medium text-emerald-600 dark:text-emerald-400">
                Authenticated
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate key areas of the site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/status">View Status</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/blog">Read Blog</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Metadata</CardTitle>
            <CardDescription>
              Timestamp details from your account record.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-base font-medium">
                {userRecord
                  ? formatDate(userRecord.createdAt)
                  : "Not available"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-base font-medium">
                {userRecord
                  ? formatDate(userRecord.updatedAt)
                  : "Not available"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Your session is secured with a signed HTTP-only cookie.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- JWT-style token signed with HMAC SHA-256</p>
            <p>- Cookie is HTTP-only and scoped to this site</p>
            <p>- Sessions expire automatically after 24 hours</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <DashboardAccountTabs
          initialName={displayName}
          email={displayEmail}
          isRegisteredUser={Boolean(userRecord)}
        />
      </section>
    </main>
  );
}
