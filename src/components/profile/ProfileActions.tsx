"use client";

import { useState } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileActionsProps {
  canChangePassword: boolean;
}

export function ProfileActions({ canChangePassword }: ProfileActionsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChangePasswordError("");
    setChangePasswordSuccess("");
    setIsChangingPassword(true);

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmNewPassword,
          currentPassword,
          newPassword,
        }),
      });

      const payload = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok || !payload.success) {
        setChangePasswordError(payload.error ?? "Unable to change password.");
        return;
      }

      setChangePasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteError("");
    setIsDeletingAccount(true);

    try {
      const response = await fetch("/api/profile/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmation: deleteConfirmation,
        }),
      });

      const payload = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok || !payload.success) {
        setDeleteError(payload.error ?? "Unable to delete account.");
        return;
      }

      await signOut({ callbackUrl: "/sign-in" });
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-3xl border border-white/10 bg-card/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-white">Account actions</h2>
          <p className="text-sm text-slate-400">
            Update your password or review destructive account controls.
          </p>
        </div>

        {canChangePassword ? (
          <form className="mt-6 space-y-4" onSubmit={handleChangePassword}>
            <div className="space-y-2">
              <label htmlFor="current-password" className="text-sm font-medium text-slate-200">
                Current password
              </label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium text-slate-200">
                New password
              </label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-new-password" className="text-sm font-medium text-slate-200">
                Confirm new password
              </label>
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={confirmNewPassword}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
              />
            </div>

            {changePasswordError ? (
              <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {changePasswordError}
              </p>
            ) : null}

            {changePasswordSuccess ? (
              <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {changePasswordSuccess}
              </p>
            ) : null}

            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Change Password
            </Button>
          </form>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Password changes are only available for accounts that sign in with email and password.
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-[0_0_0_1px_rgba(244,63,94,0.06)]">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl bg-rose-500/10 p-2 text-rose-300">
            <TriangleAlert className="size-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight text-white">Delete account</h2>
            <p className="text-sm text-slate-300">
              This permanently deletes your account, collections, items, tags, and sessions.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Button
            type="button"
            variant="outline"
            className="border-rose-500/30 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
            disabled={isDeletingAccount}
            onClick={() => {
              setDeleteError("");
              setIsDeleteDialogOpen(true);
            }}
          >
            Delete Account
          </Button>
        </div>
      </section>

      {isDeleteDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/20 bg-slate-950 p-6 shadow-2xl shadow-slate-950/40">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Confirm account deletion</h3>
              <p className="text-sm text-slate-400">
                This action is permanent. Type{" "}
                <span className="font-semibold text-rose-200">DELETE</span> to confirm that you
                want to remove your account.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <Input
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                placeholder="DELETE"
              />

              {deleteError ? (
                <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {deleteError}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setDeleteConfirmation("");
                    setDeleteError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-rose-500/30 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                  disabled={isDeletingAccount}
                  onClick={handleDeleteAccount}
                >
                  {isDeletingAccount ? <LoaderCircle className="size-4 animate-spin" /> : null}
                  Permanently Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
