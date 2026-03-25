import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardCollections } from "@/lib/db/collections";
import { getDashboardItems, getDashboardSidebarData, getDashboardStats } from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const [collections, { pinnedItems, recentItems }, sidebarData, stats] = await Promise.all([
    getDashboardCollections(userEmail),
    getDashboardItems(userEmail),
    getDashboardSidebarData(userEmail),
    getDashboardStats(userEmail),
  ]);

  return (
    <DashboardShell
      collections={collections}
      pinnedItems={pinnedItems}
      recentItems={recentItems}
      sidebarData={sidebarData}
      stats={stats}
    />
  );
}
