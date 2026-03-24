import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardCollections } from "@/lib/db/collections";
import { getDashboardItems } from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [collections, { pinnedItems, recentItems }] = await Promise.all([
    getDashboardCollections(),
    getDashboardItems(),
  ]);

  return (
    <DashboardShell
      collections={collections}
      pinnedItems={pinnedItems}
      recentItems={recentItems}
    />
  );
}
