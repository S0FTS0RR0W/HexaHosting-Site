"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DashboardAccountTabsProps = {
  initialName: string;
  email: string;
  isRegisteredUser: boolean;
};

type ApiResponse = {
  error?: string;
  message?: string;
};

export function DashboardAccountTabs({
  initialName,
  email,
  isRegisteredUser,
}: DashboardAccountTabsProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profileName, setProfileName] = useState(initialName);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const clearNotices = () => {
    setProfileMessage("");
    setProfileError("");
    setPasswordMessage("");
    setPasswordError("");
    setDeleteError("");
  };

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearNotices();

    if (!profileName.trim()) {
      setProfileError("Name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: profileName.trim() }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }

        setProfileError(data.error ?? "Unable to update profile.");
        return;
      }

      setProfileMessage(data.message ?? "Profile updated successfully.");
      router.refresh();
    } catch {
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSave = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    clearNotices();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }

        setPasswordError(data.error ?? "Unable to update password.");
        return;
      }

      setPasswordMessage(data.message ?? "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    clearNotices();

    if (deleteConfirm !== "DELETE") {
      setDeleteError('Type "DELETE" exactly to confirm deletion.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmText: deleteConfirm,
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }

        setDeleteError(data.error ?? "Unable to delete account.");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setDeleteError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRegisteredUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            This session is authenticated as an environment admin account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Profile editing, password changes, and account deletion are only
          available for registered users.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Update your profile, change your password, or delete your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger
              value="profile"
              className="rounded-md border px-3 py-2"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="rounded-md border px-3 py-2"
            >
              Password
            </TabsTrigger>
            <TabsTrigger value="danger" className="rounded-md border px-3 py-2">
              Delete Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleProfileSave} className="space-y-4">
              {profileError ? (
                <p className="text-sm text-red-500">{profileError}</p>
              ) : null}
              {profileMessage ? (
                <p className="text-sm text-green-600">{profileMessage}</p>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={email} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-name">Display Name</Label>
                <Input
                  id="profile-name"
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value)}
                  placeholder="Enter your display name"
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="password">
            <form onSubmit={handlePasswordSave} className="space-y-4">
              {passwordError ? (
                <p className="text-sm text-red-500">{passwordError}</p>
              ) : null}
              {passwordMessage ? (
                <p className="text-sm text-green-600">{passwordMessage}</p>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="danger">
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              {deleteError ? (
                <p className="text-sm text-red-500">{deleteError}</p>
              ) : null}

              <p className="text-sm text-muted-foreground">
                This action cannot be undone. Type DELETE to permanently remove
                your account.
              </p>

              <div className="space-y-2">
                <Label htmlFor="delete-confirm">Confirmation</Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirm}
                  onChange={(event) => setDeleteConfirm(event.target.value)}
                  placeholder="DELETE"
                />
              </div>

              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete My Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
