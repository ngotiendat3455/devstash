import "server-only";

import { prisma } from "@/lib/prisma";

const ICON_NAME_BY_ITEM_TYPE_ICON = {
  Code: "code-2",
  Code2: "code-2",
  Sparkles: "sparkles",
  Terminal: "terminal",
  StickyNote: "notebook-pen",
  NotebookPen: "notebook-pen",
  File: "file-text",
  FileText: "file-text",
  Image: "image",
  Link: "link",
} as const;

const ACCENT_COLOR_BY_TYPE_SLUG = {
  snippets: "blue",
  prompts: "violet",
  commands: "orange",
  notes: "yellow",
  files: "zinc",
  images: "pink",
  links: "emerald",
} as const;

export type ItemPageAccentColor =
  (typeof ACCENT_COLOR_BY_TYPE_SLUG)[keyof typeof ACCENT_COLOR_BY_TYPE_SLUG];
export type ItemPageIconName =
  (typeof ICON_NAME_BY_ITEM_TYPE_ICON)[keyof typeof ICON_NAME_BY_ITEM_TYPE_ICON];

export interface ItemTypePageData {
  accentColor: ItemPageAccentColor;
  icon: ItemPageIconName;
  id: string;
  itemCount: number;
  name: string;
  slug: string;
}

export interface ItemListCardData {
  description: string;
  id: string;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  title: string;
  type: Omit<ItemTypePageData, "itemCount">;
  updatedAt: string;
}

export function normalizeItemIconName(icon: string | null): ItemPageIconName {
  if (!icon) {
    return "file-text";
  }

  return ICON_NAME_BY_ITEM_TYPE_ICON[icon as keyof typeof ICON_NAME_BY_ITEM_TYPE_ICON] ?? "file-text";
}

export function getItemAccentColor(slug: string | null): ItemPageAccentColor {
  if (!slug) {
    return "zinc";
  }

  return ACCENT_COLOR_BY_TYPE_SLUG[slug as keyof typeof ACCENT_COLOR_BY_TYPE_SLUG] ?? "zinc";
}

export async function getItemTypeBySlug(
  userEmail: string,
  typeSlug: string,
): Promise<ItemTypePageData | null> {
  const itemType = await prisma.itemType.findFirst({
    where: {
      slug: typeSlug,
      OR: [
        { isSystem: true },
        {
          user: {
            email: userEmail,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      items: {
        where: {
          user: {
            email: userEmail,
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!itemType) {
    return null;
  }

  return {
    accentColor: getItemAccentColor(itemType.slug),
    icon: normalizeItemIconName(itemType.icon),
    id: itemType.id,
    itemCount: itemType.items.length,
    name: itemType.name,
    slug: itemType.slug,
  };
}

export async function getItemsByType(
  userEmail: string,
  typeSlug: string,
): Promise<ItemListCardData[]> {
  const items = await prisma.item.findMany({
    where: {
      user: {
        email: userEmail,
      },
      type: {
        slug: typeSlug,
      },
    },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      isFavorite: true,
      isPinned: true,
      updatedAt: true,
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      type: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
    },
  });

  return items.map((item) => ({
    description: item.description ?? "No description yet.",
    id: item.id,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    tags: item.tags.map(({ tag }) => tag.name).sort((left, right) => left.localeCompare(right)),
    title: item.title,
    type: {
      accentColor: getItemAccentColor(item.type.slug),
      icon: normalizeItemIconName(item.type.icon),
      id: item.type.id,
      name: item.type.name,
      slug: item.type.slug,
    },
    updatedAt: item.updatedAt.toISOString(),
  }));
}
