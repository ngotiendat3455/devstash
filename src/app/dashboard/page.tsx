import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardCollections } from "@/lib/db/collections";
import { getDashboardItems, getDashboardSidebarData, getDashboardStats } from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [collections, { pinnedItems, recentItems }, sidebarData, stats] = await Promise.all([
    getDashboardCollections(),
    getDashboardItems(),
    getDashboardSidebarData(),
    getDashboardStats(),
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
