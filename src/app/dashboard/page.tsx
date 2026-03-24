import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardCollections } from "@/lib/db/collections";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const collections = await getDashboardCollections();

  return <DashboardShell collections={collections} />;
}
