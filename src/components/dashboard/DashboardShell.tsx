"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Command,
  FileText,
  Folder,
  FolderOpen,
  ImageIcon,
  Link as LinkIcon,
  Menu,
  MoreHorizontal,
  NotebookPen,
  PanelLeft,
  Pin,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Terminal,
  X,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { DashboardCollectionCardData } from "@/lib/db/collections";
import { mockData, type MockCollection, type MockItem, type MockItemType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const accentClasses: Record<string, string> = {
  blue: "before:bg-sky-500",
  zinc: "before:bg-slate-300",
  yellow: "before:bg-yellow-400",
  orange: "before:bg-orange-400",
  violet: "before:bg-violet-500",
  emerald: "before:bg-emerald-400",
  pink: "before:bg-pink-500",
};

const iconColorClasses: Record<string, string> = {
  blue: "text-sky-400",
  zinc: "text-slate-400",
  yellow: "text-yellow-400",
  orange: "text-orange-400",
  violet: "text-violet-400",
  emerald: "text-emerald-400",
  pink: "text-pink-400",
};

const typeIconMap: Record<string, LucideIcon> = {
  Code: Code2,
  "code-2": Code2,
  Sparkles,
  sparkles: Sparkles,
  Terminal,
  terminal: Terminal,
  StickyNote: NotebookPen,
  NotebookPen: NotebookPen,
  "notebook-pen": NotebookPen,
  File: FileText,
  FileText: FileText,
  "file-text": FileText,
  Image: ImageIcon,
  image: ImageIcon,
  Link: LinkIcon,
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

function SidebarTypeRow({
  itemType,
  collapsed,
}: {
  itemType: MockItemType;
  collapsed: boolean;
}) {
  const Icon = typeIconMap[itemType.icon] ?? FileText;

  return (
    <button
      type="button"
      title={itemType.name}
      className={cn(
        "flex w-full items-center rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white",
        collapsed ? "justify-center" : "gap-3",
      )}
    >
      <Icon className="size-4 shrink-0 text-slate-400" />
      {!collapsed ? (
        <>
          <span className="flex-1 text-left">{itemType.name}</span>
          <span className="text-xs text-slate-500">{itemType.count}</span>
        </>
      ) : null}
    </button>
  );
}

function SidebarCollectionRow({
  collection,
  collapsed,
  showCount,
}: {
  collection: MockCollection;
  collapsed: boolean;
  showCount?: boolean;
}) {
  return (
    <button
      type="button"
      title={collection.name}
      className={cn(
        "flex w-full items-center rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white",
        collapsed ? "justify-center" : "gap-3",
      )}
    >
      <FolderOpen className="size-4 shrink-0 text-slate-500" />
      {!collapsed ? (
        <>
          <span className="flex-1 truncate text-left">{collection.name}</span>
          {collection.isFavorite ? (
            <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
          ) : null}
          {showCount ? <span className="text-xs text-slate-500">{collection.itemCount}</span> : null}
        </>
      ) : null}
    </button>
  );
}

function SidebarSectionLabel({
  label,
  collapsed,
}: {
  label: string;
  collapsed: boolean;
}) {
  if (collapsed) {
    return <div className="mx-auto h-px w-8 bg-white/10" />;
  }

  return (
    <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
      {label}
    </p>
  );
}

function DashboardCollectionCard({
  collection,
}: {
  collection: DashboardCollectionCardData;
}) {
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
            <CardDescription>
              {collection.itemCount} items
              {collection.typeCount > 0
                ? ` | ${collection.typeCount} type${collection.typeCount === 1 ? "" : "s"}`
                : ""}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="size-8 rounded-lg">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-slate-400">{collection.description}</p>
        <div className="flex items-center gap-3 text-slate-400">
          {collection.itemTypes.map((itemType) => {
            const Icon = typeIconMap[itemType.icon] ?? FileText;

            return (
              <Icon
                key={itemType.id}
                className={cn("size-4", iconColorClasses[itemType.accentColor] ?? "text-slate-400")}
              />
            );
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

function DashboardSidebar({
  collapsed,
  onClose,
}: {
  collapsed: boolean;
  onClose?: () => void;
}) {
  const favoriteCollections = mockData.collections.filter((collection) => collection.isFavorite);
  const otherCollections = mockData.collections.filter((collection) => !collection.isFavorite);

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-black/30">
      <div
        className={cn(
          "flex h-20 items-center border-b border-white/10 px-5",
          collapsed ? "justify-center" : "gap-3",
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg shadow-sky-500/20">
          <Command className="size-5" />
        </div>
        {!collapsed ? (
          <>
            <span className="text-lg font-semibold tracking-tight">DevStash</span>
            {onClose ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto size-9 rounded-full lg:hidden"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </>
        ) : null}
      </div>

      <div className={cn("flex-1 overflow-auto px-4 py-6", collapsed ? "space-y-5" : "space-y-8")}>
        <section className="space-y-3">
          <div
            className={cn(
              "flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500",
              collapsed ? "justify-center" : "justify-between px-2",
            )}
          >
            {!collapsed ? <span>Types</span> : null}
            <Menu className="size-4" />
          </div>
          <div className="space-y-1">
            {mockData.itemTypes.map((itemType) => (
              <SidebarTypeRow key={itemType.id} itemType={itemType} collapsed={collapsed} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div
            className={cn(
              "flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500",
              collapsed ? "justify-center" : "justify-between px-2",
            )}
          >
            {!collapsed ? <span>Collections</span> : null}
            <Menu className="size-4" />
          </div>

          <div className="space-y-2">
            <SidebarSectionLabel label="Favorites" collapsed={collapsed} />
            <div className="space-y-1">
              {favoriteCollections.map((collection) => (
                <SidebarCollectionRow
                  key={collection.id}
                  collection={collection}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <SidebarSectionLabel label="All Collections" collapsed={collapsed} />
            <div className="space-y-1">
              {otherCollections.map((collection) => (
                <SidebarCollectionRow
                  key={collection.id}
                  collection={collection}
                  collapsed={collapsed}
                  showCount
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <div
        className={cn(
          "border-t border-white/10 px-5 py-4",
          collapsed ? "flex justify-center" : "flex items-center justify-between",
        )}
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-sm font-semibold text-slate-950">
            {mockData.currentUser.name.slice(0, 1)}
          </div>
          {!collapsed ? (
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-white">{mockData.currentUser.name}</p>
              <p className="text-xs text-slate-500">{mockData.currentUser.email}</p>
            </div>
          ) : null}
        </div>
        {!collapsed ? (
          <Button variant="ghost" size="icon" className="size-9 rounded-full">
            <Settings className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function DashboardShell({
  collections,
}: {
  collections: DashboardCollectionCardData[];
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pinnedItems = mockData.items.filter((item) => item.isPinned);

  return (
    <main className="min-h-screen">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "hidden shrink-0 transition-[width] duration-200 lg:block",
            isSidebarCollapsed ? "w-[92px]" : "w-[272px]",
          )}
        >
          <DashboardSidebar collapsed={isSidebarCollapsed} />
        </aside>

        {isMobileSidebarOpen ? (
          <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden">
            <button
              type="button"
              aria-label="Close sidebar overlay"
              className="absolute inset-0"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <aside className="relative z-10 h-full w-[88vw] max-w-[320px]">
              <DashboardSidebar
                collapsed={false}
                onClose={() => setIsMobileSidebarOpen(false)}
              />
            </aside>
          </div>
        ) : null}

        <section className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-xl">
            <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <PanelLeft className="size-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="hidden lg:inline-flex"
                onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="size-4" />
                ) : (
                  <ChevronLeft className="size-4" />
                )}
              </Button>

              <div className="relative max-w-xl flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <Input
                  aria-label="Search items"
                  defaultValue=""
                  placeholder="Search items..."
                  className="pl-11 pr-16"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:inline-flex">
                  Ctrl K
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
                  {collections.map((collection) => (
                    <DashboardCollectionCard key={collection.id} collection={collection} />
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
