import "server-only";

import { getUserInitials } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";

const PROFILE_TYPE_ORDER = [
  "snippets",
  "prompts",
  "notes",
  "commands",
  "links",
  "files",
  "images",
] as const;

export interface ProfileTypeBreakdownItem {
  count: number;
  name: string;
  slug: string;
}

export interface ProfileData {
  accountLabel: string;
  canChangePassword: boolean;
  createdAt: string;
  email: string;
  image: string | null;
  initials: string;
  name: string;
  stats: {
    totalCollections: number;
    totalItems: number;
    typeBreakdown: ProfileTypeBreakdownItem[];
  };
}

function getTypeOrder(slug: string) {
  const index = PROFILE_TYPE_ORDER.indexOf(slug as (typeof PROFILE_TYPE_ORDER)[number]);

  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export async function getProfileData(userId: string): Promise<ProfileData | null> {
  const [user, totalItems, totalCollections, itemTypes] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        accounts: {
          select: {
            provider: true,
          },
        },
        createdAt: true,
        email: true,
        image: true,
        name: true,
        password: true,
      },
    }),
    prisma.item.count({
      where: { userId },
    }),
    prisma.collection.count({
      where: { userId },
    }),
    prisma.itemType.findMany({
      where: {
        isSystem: true,
      },
      select: {
        name: true,
        slug: true,
        items: {
          where: { userId },
          select: { id: true },
        },
      },
    }),
  ]);

  if (!user) {
    return null;
  }

  const typeBreakdown = itemTypes
    .map((itemType) => ({
      count: itemType.items.length,
      name: itemType.name,
      slug: itemType.slug,
    }))
    .sort((left, right) => {
      const orderDifference = getTypeOrder(left.slug) - getTypeOrder(right.slug);

      if (orderDifference !== 0) {
        return orderDifference;
      }

      return left.name.localeCompare(right.name);
    });

  const hasGithubAccount = user.accounts.some((account) => account.provider === "github");
  const hasPasswordAccount = Boolean(user.password);

  let accountLabel = "OAuth account";

  if (hasPasswordAccount && hasGithubAccount) {
    accountLabel = "Email + GitHub account";
  } else if (hasPasswordAccount) {
    accountLabel = "Email account";
  }

  return {
    accountLabel,
    canChangePassword: hasPasswordAccount,
    createdAt: user.createdAt.toISOString(),
    email: user.email,
    image: user.image,
    initials: getUserInitials(user.name, user.email),
    name: user.name ?? "Anonymous User",
    stats: {
      totalCollections,
      totalItems,
      typeBreakdown,
    },
  };
}
