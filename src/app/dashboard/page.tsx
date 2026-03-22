import {
  Folder,
  FolderOpen,
  Link as LinkIcon,
  Menu,
  MoreHorizontal,
  NotebookPen,
  PanelLeft,
  Pin,
  Plus,
  Search,
  Sparkles,
  Star,
  Terminal,
  Code2,
  FileText,
  ImageIcon,
  Command,
  Settings,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockData, type MockCollection, type MockItem, type MockItemType } from "@/lib/mock-data";

const accentClasses: Record<string, string> = {
  blue: "before:bg-sky-500",
  zinc: "before:bg-slate-300",
  yellow: "before:bg-yellow-400",
  orange: "before:bg-orange-400",
  violet: "before:bg-violet-500",
  emerald: "before:bg-emerald-400",
  pink: "before:bg-pink-500",
};

const typeIconMap: Record<string, typeof Code2> = {
  "code-2": Code2,
  sparkles: Sparkles,
  terminal: Terminal,
  "notebook-pen": NotebookPen,
  "file-text": FileText,
  image: ImageIcon,
  link: LinkIcon,
};

function getTypeById(typeId: string) {
  return mockData.itemTypes.find((type) => type.id === typeId);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function SidebarTypeRow({ itemType }: { itemType: MockItemType }) {
  const Icon = typeIconMap[itemType.icon] ?? FileText;

  return (
    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
      <Icon className="size-4 text-slate-400" />
      <span className="flex-1 text-left">{itemType.name}</span>
      <span className="text-xs text-slate-500">{itemType.count}</span>
    </button>
  );
}

function SidebarCollectionRow({
  collection,
  showCount,
}: {
  collection: MockCollection;
  showCount?: boolean;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
      <FolderOpen className="size-4 text-slate-500" />
      <span className="flex-1 truncate text-left">{collection.name}</span>
      {collection.isFavorite ? <Star className="size-3.5 fill-yellow-400 text-yellow-400" /> : null}
      {showCount ? <span className="text-xs text-slate-500">{collection.itemCount}</span> : null}
    </button>
  );
}

function CollectionCard({ collection }: { collection: MockCollection }) {
  const relatedTypes = collection.itemTypeIds
    .map((itemTypeId) => getTypeById(itemTypeId))
    .filter((type): type is MockItemType => Boolean(type));

  return (
    <Card
      className={`relative overflow-hidden before:absolute before:inset-y-5 before:left-0 before:w-0.5 ${accentClasses[collection.accentColor] ?? "before:bg-slate-500"}`}
    >
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle>{collection.name}</CardTitle>
              {collection.isFavorite ? (
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
              ) : null}
            </div>
            <CardDescription>{collection.itemCount} items</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="size-8 rounded-lg">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-slate-400">{collection.description}</p>
        <div className="flex items-center gap-3 text-slate-400">
          {relatedTypes.map((itemType) => {
            const Icon = typeIconMap[itemType.icon] ?? FileText;

            return <Icon key={itemType.id} className="size-4" />;
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function PinnedItemCard({ item }: { item: MockItem }) {
  const itemType = getTypeById(item.typeId);
  const Icon = itemType ? typeIconMap[itemType.icon] ?? FileText : FileText;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
            <Icon className="size-5" />
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <Pin className="size-3.5 fill-slate-400 text-slate-400" />
                {item.isFavorite ? (
                  <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                ) : null}
              </div>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
        <span className="shrink-0 text-sm text-slate-500">{formatDate(item.updatedAt)}</span>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const favoriteCollections = mockData.collections.filter((collection) => collection.isFavorite);
  const otherCollections = mockData.collections.filter((collection) => !collection.isFavorite);
  const pinnedItems = mockData.items.filter((item) => item.isPinned);

  return (
    <main className="min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/10 bg-black/30 lg:flex lg:flex-col">
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg shadow-sky-500/20">
              <Command className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">DevStash</span>
          </div>

          <div className="flex-1 space-y-8 overflow-auto px-4 py-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>Types</span>
                <Menu className="size-4" />
              </div>
              <div className="space-y-1">
                {mockData.itemTypes.map((itemType) => (
                  <SidebarTypeRow key={itemType.id} itemType={itemType} />
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>Collections</span>
                <Menu className="size-4" />
              </div>

              <div className="space-y-2">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Favorites
                </p>
                <div className="space-y-1">
                  {favoriteCollections.map((collection) => (
                    <SidebarCollectionRow key={collection.id} collection={collection} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  All Collections
                </p>
                <div className="space-y-1">
                  {otherCollections.map((collection) => (
                    <SidebarCollectionRow
                      key={collection.id}
                      collection={collection}
                      showCount
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/90 text-sm font-semibold text-slate-950">
                {mockData.currentUser.name.slice(0, 1)}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-white">{mockData.currentUser.name}</p>
                <p className="text-xs text-slate-500">{mockData.currentUser.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="size-9 rounded-full">
              <Settings className="size-4" />
            </Button>
          </div>
        </aside>

        <section className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-background/80 backdrop-blur-xl">
            <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <Button variant="outline" size="icon" className="lg:hidden">
                <PanelLeft className="size-4" />
              </Button>

              <div className="relative max-w-xl flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <Input
                  aria-label="Search items"
                  defaultValue=""
                  placeholder="Search items..."
                  className="pl-11 pr-16"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  ⌘ K
                </span>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <Button variant="outline" className="hidden sm:inline-flex">
                  <Folder className="size-4" />
                  New Collection
                </Button>
                <Button>
                  <Plus className="size-4" />
                  New Item
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
              <section className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-white">Dashboard</h1>
                <p className="text-base text-slate-400">Your developer knowledge hub</p>
              </section>

              <section className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">Collections</h2>
                  <button className="text-sm font-medium text-slate-400 transition hover:text-white">
                    View all
                  </button>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {mockData.collections.map((collection) => (
                    <CollectionCard key={collection.id} collection={collection} />
                  ))}
                </div>
              </section>

              <section className="space-y-5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Pin className="size-4" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Pinned
                  </h2>
                </div>
                <div className="space-y-4">
                  {pinnedItems.map((item) => (
                    <PinnedItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
