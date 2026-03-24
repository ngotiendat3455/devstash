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

export interface DashboardItemTypeData {
  id: string;
  name: string;
  slug: string;
  icon: NormalizedIconName;
  accentColor: AccentColor;
}

export interface DashboardItemCardData {
  id: string;
  title: string;
  description: string;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: string;
  tags: string[];
  type: DashboardItemTypeData;
}

export interface DashboardItemsData {
  pinnedItems: DashboardItemCardData[];
  recentItems: DashboardItemCardData[];
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

function mapDashboardItem(item: {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  type: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
  tags: Array<{
    tag: {
      name: string;
    };
  }>;
}): DashboardItemCardData {
  return {
    id: item.id,
    title: item.title,
    description: item.description ?? "No description yet.",
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    updatedAt: item.updatedAt.toISOString(),
    tags: item.tags.map(({ tag }) => tag.name).sort((left, right) => left.localeCompare(right)),
    type: {
      id: item.type.id,
      name: item.type.name,
      slug: item.type.slug,
      icon: normalizeIconName(item.type.icon),
      accentColor: getAccentColor(item.type.slug),
    },
  };
}

export async function getPinnedDashboardItems(
  userEmail = DEFAULT_DASHBOARD_USER_EMAIL,
  limit = 4,
): Promise<DashboardItemCardData[]> {
  const items = await prisma.item.findMany({
    where: {
      isPinned: true,
      user: {
        email: userEmail,
      },
    },
    orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
    take: limit,
    select: {
      id: true,
      title: true,
      description: true,
      isFavorite: true,
      isPinned: true,
      updatedAt: true,
      type: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return items.map(mapDashboardItem);
}

export async function getRecentDashboardItems(
  userEmail = DEFAULT_DASHBOARD_USER_EMAIL,
  limit = 6,
): Promise<DashboardItemCardData[]> {
  const items = await prisma.item.findMany({
    where: {
      isPinned: false,
      user: {
        email: userEmail,
      },
    },
    orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
    take: limit,
    select: {
      id: true,
      title: true,
      description: true,
      isFavorite: true,
      isPinned: true,
      updatedAt: true,
      type: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return items.map(mapDashboardItem);
}

export async function getDashboardItems(
  userEmail = DEFAULT_DASHBOARD_USER_EMAIL,
): Promise<DashboardItemsData> {
  const [pinnedItems, recentItems] = await Promise.all([
    getPinnedDashboardItems(userEmail),
    getRecentDashboardItems(userEmail),
  ]);

  return {
    pinnedItems,
    recentItems,
  };
}
