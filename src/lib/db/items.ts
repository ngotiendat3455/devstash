import "server-only";

import { getUserInitials } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";

export const DEFAULT_DASHBOARD_USER_EMAIL = "demo@devstash.io";

const SYSTEM_TYPE_ORDER = [
  "snippets",
  "prompts",
  "commands",
  "notes",
  "files",
  "images",
  "links",
] as const;

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

export type DashboardAccentColor =
  (typeof ACCENT_COLOR_BY_TYPE_SLUG)[keyof typeof ACCENT_COLOR_BY_TYPE_SLUG];
export type DashboardIconName =
  (typeof ICON_NAME_BY_ITEM_TYPE_ICON)[keyof typeof ICON_NAME_BY_ITEM_TYPE_ICON];

export interface DashboardItemTypeData {
  id: string;
  name: string;
  slug: string;
  icon: DashboardIconName;
  accentColor: DashboardAccentColor;
}

export interface DashboardSidebarItemTypeData extends DashboardItemTypeData {
  count: number;
  href: string;
  label: string;
}

export interface DashboardSidebarCollectionData {
  id: string;
  name: string;
  itemCount: number;
  isFavorite: boolean;
  accentColor: DashboardAccentColor;
}

export interface DashboardSidebarUserData {
  email: string;
  image: string | null;
  initials: string;
  name: string;
}

export interface DashboardSidebarData {
  favoriteCollections: DashboardSidebarCollectionData[];
  itemTypes: DashboardSidebarItemTypeData[];
  recentCollections: DashboardSidebarCollectionData[];
  user: DashboardSidebarUserData;
}

export interface DashboardStatsData {
  totalCollections: number;
  totalItems: number;
  totalItemTypes: number;
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

function getTypeOrder(slug: string) {
  const orderIndex = SYSTEM_TYPE_ORDER.indexOf(slug as (typeof SYSTEM_TYPE_ORDER)[number]);

  return orderIndex === -1 ? Number.MAX_SAFE_INTEGER : orderIndex;
}

function getItemTypeLabel(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function getMostUsedTypeSlug(items: Array<{ type: { slug: string } }>) {
  const typeCounts = new Map<string, number>();

  for (const item of items) {
    typeCounts.set(item.type.slug, (typeCounts.get(item.type.slug) ?? 0) + 1);
  }

  return Array.from(typeCounts.entries()).sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }

    return getTypeOrder(left[0]) - getTypeOrder(right[0]);
  })[0]?.[0] ?? null;
}

export function normalizeDashboardIconName(icon: string | null): DashboardIconName {
  if (!icon) {
    return "file-text";
  }

  return ICON_NAME_BY_ITEM_TYPE_ICON[icon as keyof typeof ICON_NAME_BY_ITEM_TYPE_ICON] ?? "file-text";
}

export function getDashboardAccentColor(slug: string | null): DashboardAccentColor {
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
      icon: normalizeDashboardIconName(item.type.icon),
      accentColor: getDashboardAccentColor(item.type.slug),
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

export async function getDashboardStats(
  userEmail = DEFAULT_DASHBOARD_USER_EMAIL,
): Promise<DashboardStatsData> {
  const [totalItems, totalCollections, totalItemTypes] = await Promise.all([
    prisma.item.count({
      where: {
        user: {
          email: userEmail,
        },
      },
    }),
    prisma.collection.count({
      where: {
        user: {
          email: userEmail,
        },
      },
    }),
    prisma.itemType.count({
      where: {
        isSystem: true,
      },
    }),
  ]);

  return {
    totalCollections,
    totalItems,
    totalItemTypes,
  };
}

export async function getDashboardSidebarData(
  userEmail = DEFAULT_DASHBOARD_USER_EMAIL,
): Promise<DashboardSidebarData> {
  const [user, itemTypes, collections] = await Promise.all([
    prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        email: true,
        image: true,
        name: true,
      },
    }),
    prisma.itemType.findMany({
      where: {
        isSystem: true,
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
    }),
    prisma.collection.findMany({
      where: {
        user: {
          email: userEmail,
        },
      },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
      select: {
        id: true,
        isFavorite: true,
        name: true,
        items: {
          select: {
            type: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const sidebarItemTypes = itemTypes
    .sort((left, right) => {
      const orderDifference = getTypeOrder(left.slug) - getTypeOrder(right.slug);

      if (orderDifference !== 0) {
        return orderDifference;
      }

      return left.name.localeCompare(right.name);
    })
    .map((itemType) => ({
      id: itemType.id,
      name: itemType.name,
      slug: itemType.slug,
      icon: normalizeDashboardIconName(itemType.icon),
      accentColor: getDashboardAccentColor(itemType.slug),
      count: itemType.items.length,
      href: `/items/${itemType.slug}`,
      label: getItemTypeLabel(itemType.slug),
    }));

  const sidebarCollections = collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    itemCount: collection.items.length,
    isFavorite: collection.isFavorite,
    accentColor: getDashboardAccentColor(getMostUsedTypeSlug(collection.items)),
  }));

  return {
    favoriteCollections: sidebarCollections.filter((collection) => collection.isFavorite),
    itemTypes: sidebarItemTypes,
    recentCollections: sidebarCollections.filter((collection) => !collection.isFavorite).slice(0, 6),
    user: {
      email: user?.email ?? userEmail,
      image: user?.image ?? null,
      initials: getUserInitials(user?.name, user?.email ?? userEmail),
      name: user?.name ?? "Demo User",
    },
  };
}
