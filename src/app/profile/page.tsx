import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfileData } from "@/lib/db/profile";

function formatJoinedDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/profile");
  }

  const profile = await getProfileData(session.user.id);

  if (!profile) {
    redirect("/sign-in?callbackUrl=/profile");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Profile</h1>
          <p className="max-w-2xl text-base text-slate-400">
            Review your account details, usage stats, and sensitive account controls.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <UserAvatar
                className="size-24 text-2xl"
                fallback={profile.initials}
                image={profile.image}
              />
              <div className="space-y-3">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription>{profile.email}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{profile.accountLabel}</Badge>
                  <Badge>Joined {formatJoinedDate(profile.createdAt)}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage overview</CardTitle>
              <CardDescription>Your current workspace totals and item mix.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Total items</p>
                <p className="mt-2 text-3xl font-semibold text-white">{profile.stats.totalItems}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Total collections</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {profile.stats.totalCollections}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Item type breakdown</CardTitle>
            <CardDescription>
              A snapshot of how your saved knowledge is distributed across DevStash item types.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {profile.stats.typeBreakdown.map((itemType) => (
                <div
                  key={itemType.slug}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm text-slate-400">{itemType.name}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-2xl font-semibold text-white">{itemType.count}</p>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {itemType.slug}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <ProfileActions canChangePassword={profile.canChangePassword} />
      </div>
    </main>
  );
}
