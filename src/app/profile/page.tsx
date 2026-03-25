import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserInitials } from "@/lib/auth/user";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in?callbackUrl=/profile");
  }

  const initials = getUserInitials(session.user.name, session.user.email);

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <UserAvatar
              className="size-20 text-xl"
              fallback={initials}
              image={session.user.image}
            />
            <div className="space-y-1">
              <CardTitle>{session.user.name ?? "Profile"}</CardTitle>
              <CardDescription>{session.user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <p>This is a placeholder profile page for the authenticated user menu.</p>
            <p>Your custom profile experience can grow here in a later feature.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
