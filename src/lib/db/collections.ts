import "server-only";

import { prisma } from "@/lib/prisma";

const DEFAULT_DASHBOARD_USER_EMAIL = "demo@devstash.io";

const ACCENT_COLOR_BY_TYPE_SLUG = {
  snippets: "blue",
  prompts: "violet",
  commands: "orange",
  notes: "yellow",
  files: "zinc",
  images: "pink",
  links: "emerald",
} as const;

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

type AccentColor = (typeof ACCENT_COLOR_BY_TYPE_SLUG)[keyof typeof ACCENT_COLOR_BY_TYPE_SLUG];
type NormalizedIconName =
  (typeof ICON_NAME_BY_ITEM_TYPE_ICON)[keyof typeof ICON_NAME_BY_ITEM_TYPE_ICON];

export interface DashboardCollectionCardItemType {
  id: string;
  name: string;
  slug: string;
  icon: NormalizedIconName;
  accentColor: AccentColor;
  itemCount: number;
}

export interface DashboardCollectionCardData {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  typeCount: number;
  accentColor: AccentColor;
  itemTypes: DashboardCollectionCardItemType[];
}

function normalizeIconName(icon: string | null): NormalizedIconName {
  if (!icon) {
    return "file-text";
  }

  return ICON_NAME_BY_ITEM_TYPE_ICON[icon as keyof typeof ICON_NAME_BY_ITEM_TYPE_ICON] ?? "file-text";
}

function getAccentColor(slug: string | null): AccentColor {
  if (!slug) {
    return "zinc";
  }

  return ACCENT_COLOR_BY_TYPE_SLUG[slug as keyof typeof ACCENT_COLOR_BY_TYPE_SLUG] ?? "zinc";
}

export async function getDashboardCollections(
  userEmail = DEFAULT_DASHBOARD_USER_EMAIL,
  limit = 6,
): Promise<DashboardCollectionCardData[]> {
  const collections = await prisma.collection.findMany({
    where: {
      user: {
        email: userEmail,
      },
    },
    orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      items: {
        select: {
          type: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      },
    },
  });

  return collections.map((collection) => {
    const itemTypeCounts = new Map<
      string,
      {
        id: string;
        name: string;
        slug: string;
        icon: string | null;
        itemCount: number;
      }
    >();

    for (const item of collection.items) {
      const existingType = itemTypeCounts.get(item.type.id);

      if (existingType) {
        existingType.itemCount += 1;
        continue;
      }

      itemTypeCounts.set(item.type.id, {
        id: item.type.id,
        name: item.type.name,
        slug: item.type.slug,
        icon: item.type.icon,
        itemCount: 1,
      });
    }

    const itemTypes = Array.from(itemTypeCounts.values())
      .sort((left, right) => {
        if (right.itemCount !== left.itemCount) {
          return right.itemCount - left.itemCount;
        }

        return left.name.localeCompare(right.name);
      })
      .map((itemType) => ({
        id: itemType.id,
        name: itemType.name,
        slug: itemType.slug,
        icon: normalizeIconName(itemType.icon),
        accentColor: getAccentColor(itemType.slug),
        itemCount: itemType.itemCount,
      }));

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description ?? "No description yet.",
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      typeCount: itemTypes.length,
      accentColor: itemTypes[0]?.accentColor ?? "zinc",
      itemTypes,
    };
  });
}
