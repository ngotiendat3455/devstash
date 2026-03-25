import { redirect, notFound } from "next/navigation";

import { auth } from "@/auth";
import { getItemsByType, getItemTypeBySlug } from "@/actions/items";
import { ItemCard } from "@/components/items/ItemCard";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ItemsByTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const session = await auth();
  const userEmail = session?.user?.email;
  console.log('#session', session);
  if (!userEmail) {
    redirect("/sign-in");
  }

  const { type } = await params;
  const itemType = await getItemTypeBySlug(userEmail, type);

  if (!itemType) {
    notFound();
  }

  const items = await getItemsByType(userEmail, type);

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{itemType.name}</Badge>
            <Badge>{itemType.slug}</Badge>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-white">{itemType.name}</h1>
            <p className="max-w-2xl text-base text-slate-400">
              Browse all saved {itemType.name.toLowerCase()} items in your workspace.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span>{itemType.itemCount} items</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>Route /items/{itemType.slug}</span>
            </div>
          </div>
        </section>

        {items.length > 0 ? (
          <section className="grid gap-5 md:grid-cols-2">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-xl font-semibold text-white">No {itemType.name.toLowerCase()} yet</h2>
            <p className="mt-3 text-sm text-slate-400">
              Once items of this type are added, they&apos;ll appear here in a responsive grid.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
