import {
  Code2,
  FileText,
  ImageIcon,
  Link as LinkIcon,
  NotebookPen,
  Pin,
  Sparkles,
  Star,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import type { ItemListCardData } from "@/actions/items";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const accentClasses: Record<string, string> = {
  blue: "before:bg-sky-500",
  emerald: "before:bg-emerald-400",
  orange: "before:bg-orange-400",
  pink: "before:bg-pink-500",
  violet: "before:bg-violet-500",
  yellow: "before:bg-yellow-400",
  zinc: "before:bg-slate-300",
};

const iconSurfaceClasses: Record<string, string> = {
  blue: "bg-sky-500/10 text-sky-300",
  emerald: "bg-emerald-500/10 text-emerald-300",
  orange: "bg-orange-500/10 text-orange-300",
  pink: "bg-pink-500/10 text-pink-300",
  violet: "bg-violet-500/10 text-violet-300",
  yellow: "bg-yellow-500/10 text-yellow-300",
  zinc: "bg-slate-400/10 text-slate-300",
};

const typeBadgeClasses: Record<string, string> = {
  blue: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  orange: "border-orange-500/20 bg-orange-500/10 text-orange-300",
  pink: "border-pink-500/20 bg-pink-500/10 text-pink-300",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
  zinc: "border-slate-400/20 bg-slate-400/10 text-slate-300",
};

const typeIconMap: Record<string, LucideIcon> = {
  "code-2": Code2,
  "file-text": FileText,
  image: ImageIcon,
  link: LinkIcon,
  "notebook-pen": NotebookPen,
  sparkles: Sparkles,
  terminal: Terminal,
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function ItemCard({ item }: { item: ItemListCardData }) {
  const Icon = typeIconMap[item.type.icon] ?? FileText;

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-6 before:absolute before:inset-y-6 before:left-0 before:w-1",
        accentClasses[item.type.accentColor] ?? "before:bg-slate-500",
      )}
    >
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl",
              iconSurfaceClasses[item.type.accentColor] ?? "bg-slate-500/10 text-slate-300",
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            {item.isPinned ? <Pin className="size-4 fill-slate-400 text-slate-400" /> : null}
            {item.isFavorite ? <Star className="size-4 fill-yellow-400 text-yellow-400" /> : null}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <Badge
              className={cn(
                "border",
                typeBadgeClasses[item.type.accentColor] ?? "border-white/10 bg-white/5 text-slate-300",
              )}
            >
              {item.type.name}
            </Badge>
          </div>
          <p className="text-sm leading-6 text-slate-400">{item.description}</p>
        </div>

        <div className="mt-auto space-y-4">
          {item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}

          <p className="text-sm text-slate-500">Updated {formatDate(item.updatedAt)}</p>
        </div>
      </div>
    </Card>
  );
}
