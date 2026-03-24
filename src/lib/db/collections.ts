import "server-only";

import {
  DEFAULT_DASHBOARD_USER_EMAIL,
  getDashboardAccentColor,
  normalizeDashboardIconName,
  type DashboardAccentColor,
  type DashboardIconName,
} from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

export interface DashboardCollectionCardItemType {
  id: string;
  name: string;
  slug: string;
  icon: DashboardIconName;
  accentColor: DashboardAccentColor;
  itemCount: number;
}

export interface DashboardCollectionCardData {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  typeCount: number;
  accentColor: DashboardAccentColor;
  itemTypes: DashboardCollectionCardItemType[];
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
        icon: normalizeDashboardIconName(itemType.icon),
        accentColor: getDashboardAccentColor(itemType.slug),
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
